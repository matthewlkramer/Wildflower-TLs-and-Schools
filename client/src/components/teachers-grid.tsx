import { useState, useMemo, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, GridApi, themeMaterial } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);
import { Link } from "wouter";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Educator } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";

interface TeachersGridProps {
  teachers: Educator[];
  isLoading: boolean;
}

// Badge renderer for status fields (Discovery Status, Stage/Status, Montessori Certified)
const BadgeRenderer = ({ value, field }: { value: string | string[]; field?: string }) => {
  if (!value) return null;
  
  const values = Array.isArray(value) ? value : [value];
  
  const getFieldColor = (val: string, fieldName?: string) => {
    if (fieldName === 'montessoriCertified') {
      return val?.toLowerCase() === 'yes' 
        ? 'bg-green-100 text-green-800 border-green-200' 
        : 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    if (fieldName === 'discoveryStatus') {
      const status = val?.toLowerCase();
      if (status === 'complete') return 'bg-green-100 text-green-800 border-green-200';
      if (status === 'in process' || status === 'in progress') return 'bg-green-50 text-green-700 border-green-200';
      if (status === 'paused') return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    if (fieldName === 'stageStatus') {
      // Use the updated getStatusColor function for Stage/Status fields
      return getStatusColor(val);
    }
    
    // Default to existing color logic for other fields
    return getStatusColor(val);
  };
  
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {values.map((val, index) => (
        <Badge 
          key={index}
          variant="outline" 
          className={`text-xs ${getFieldColor(val, field)}`}
        >
          {val}
        </Badge>
      ))}
    </div>
  );
};

// Pill renderer for categorical fields (Individual Type, Current Role, Race/Ethnicity)
const PillRenderer = ({ value }: { value: string | string[] }) => {
  if (!value) return null;
  
  const values = Array.isArray(value) ? value : [value];
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {values.map((val, index) => (
        <span 
          key={index}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
        >
          {val}
        </span>
      ))}
    </div>
  );
};

// Action buttons renderer
const ActionRenderer = ({ data: teacher }: { data: Educator }) => {
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/teachers/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
      toast({
        title: "Educator deleted",
        description: "The educator has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete educator. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
          <Link href={`/teacher/${teacher.id}`}>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={() => {
          deleteMutation.mutate(teacher.id);
          setShowDeleteModal(false);
        }}
        title="Delete Educator"
        description={`Are you sure you want to delete ${teacher.fullName}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default function TeachersGrid({ teachers, isLoading }: TeachersGridProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  // Handle viewport height changes for orientation changes
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: "Educator Name",
      field: "fullName",
      filter: 'agTextColumnFilter',
      minWidth: 200,
      cellRenderer: ({ data: teacher }: { data: Educator }) => (
        <Link href={`/teacher/${teacher.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
          {teacher.fullName}
        </Link>
      ),
      sort: 'asc',
    },
    {
      headerName: "Current School",
      field: "activeSchool",
      filter: 'agTextColumnFilter',
      minWidth: 200,
      valueGetter: (params) => {
        const school = params.data?.activeSchool;
        return Array.isArray(school) ? school.join(', ') : (school || '');
      }
    },
    {
      headerName: "Stage/Status",
      field: "activeSchoolStageStatus",
      filter: 'agTextColumnFilter',
      minWidth: 180,
      cellRenderer: ({ data }: { data: Educator }) => (
        <BadgeRenderer value={data.activeSchoolStageStatus || []} field="stageStatus" />
      )
    },
    {
      headerName: "Current Role",
      field: "currentRole",
      filter: 'agTextColumnFilter',
      minWidth: 150,
      cellRenderer: ({ data }: { data: Educator }) => (
        <PillRenderer value={data.currentRole || ''} />
      )
    },
    {
      headerName: "Montessori Certified",
      field: "montessoriCertified",
      filter: 'agTextColumnFilter',
      minWidth: 160,
      cellRenderer: ({ data }: { data: Educator }) => (
        <BadgeRenderer value={String(data.montessoriCertified || 'No')} field="montessoriCertified" />
      )
    },
    {
      headerName: "Race/Ethnicity",
      field: "raceEthnicity",
      filter: 'agTextColumnFilter',
      minWidth: 140,
      cellRenderer: ({ data }: { data: Educator }) => (
        <PillRenderer value={data.raceEthnicity || []} />
      )
    },
    {
      headerName: "Discovery Status",
      field: "discoveryStatus",
      filter: 'agTextColumnFilter',
      minWidth: 140,
      cellRenderer: ({ data }: { data: Educator }) => (
        <BadgeRenderer value={data.discoveryStatus || ''} field="discoveryStatus" />
      )
    },
    {
      headerName: "Type",
      field: "individualType",
      filter: 'agTextColumnFilter',
      minWidth: 120,
      cellRenderer: ({ data }: { data: Educator }) => (
        <PillRenderer value={data.individualType || ''} />
      )
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionRenderer,
      sortable: false,
      filter: false,
      width: 100,
      pinned: 'right'
    }
  ], []);

  const defaultColDef: ColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[600px] bg-white rounded-lg border flex items-center justify-center">
        <div>Loading teachers...</div>
      </div>
    );
  }

  // Calculate appropriate height based on viewport
  const getGridHeight = () => {
    if (viewportHeight === 0) return 'calc(100vh - 200px)'; // Fallback
    
    // Mobile landscape mode (height < 500px)
    if (viewportHeight < 500) {
      return Math.max(viewportHeight - 120, 280) + 'px';
    }
    
    // Regular desktop/tablet
    return Math.min(viewportHeight - 200, 800) + 'px';
  };

  return (
    <div className="w-full min-h-[280px]" style={{ height: getGridHeight() }}>
      <div className="h-full">
        <AgGridReact
          theme={themeMaterial}
          rowData={teachers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowSelection="multiple"
          suppressRowClickSelection={false}
          animateRows={true}
          pagination={false}
          rowHeight={30}

        />
      </div>
    </div>
  );
}