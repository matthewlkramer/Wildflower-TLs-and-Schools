import { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, GridApi } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);
import { Link } from "wouter";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Teacher } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";

interface TeachersGridProps {
  teachers: Teacher[];
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
    
    // Default to existing color logic for other fields
    return getStatusColor(val);
  };
  
  return (
    <div className="flex flex-wrap gap-1">
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
    <div className="flex flex-wrap gap-1">
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
const ActionRenderer = ({ data: teacher }: { data: Teacher }) => {
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/teachers/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
      toast({
        title: "Teacher deleted",
        description: "The teacher has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
          <Link href={`/teacher/${teacher.id}`}>
            <Edit className="h-3 w-3" />
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
        title="Delete Teacher"
        description={`Are you sure you want to delete ${teacher.fullName}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
};

export default function TeachersGrid({ teachers, isLoading }: TeachersGridProps) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: "Full Name",
      field: "fullName",
      filter: 'agTextColumnFilter',
      minWidth: 200,
      cellRenderer: ({ data: teacher }: { data: Teacher }) => (
        <Link href={`/teacher/${teacher.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
          {teacher.fullName}
        </Link>
      ),
    },
    {
      headerName: "Current School",
      field: "currentlyActiveSchool",
      filter: 'agTextColumnFilter',
      minWidth: 200,
      valueGetter: (params) => {
        const school = params.data?.currentlyActiveSchool;
        return Array.isArray(school) ? school.join(', ') : (school || '');
      }
    },
    {
      headerName: "Stage/Status",
      field: "startupStageForActiveSchool",
      filter: 'agTextColumnFilter',
      minWidth: 180,
      cellRenderer: ({ data }: { data: Teacher }) => (
        <BadgeRenderer value={data.startupStageForActiveSchool || []} field="stageStatus" />
      )
    },
    {
      headerName: "Current Role",
      field: "currentRole",
      filter: 'agTextColumnFilter',
      minWidth: 150,
      cellRenderer: ({ data }: { data: Teacher }) => (
        <PillRenderer value={data.currentRole || ''} />
      )
    },
    {
      headerName: "Montessori Certified",
      field: "montessoriCertified",
      filter: 'agTextColumnFilter',
      minWidth: 160,
      cellRenderer: ({ data }: { data: Teacher }) => (
        <BadgeRenderer value={String(data.montessoriCertified || 'No')} field="montessoriCertified" />
      )
    },
    {
      headerName: "Race/Ethnicity",
      field: "raceEthnicity",
      filter: 'agTextColumnFilter',
      minWidth: 140,
      cellRenderer: ({ data }: { data: Teacher }) => (
        <PillRenderer value={data.raceEthnicity || []} />
      )
    },
    {
      headerName: "Discovery Status",
      field: "discoveryStatus",
      filter: 'agTextColumnFilter',
      minWidth: 140,
      cellRenderer: ({ data }: { data: Teacher }) => (
        <BadgeRenderer value={data.discoveryStatus || ''} field="discoveryStatus" />
      )
    },
    {
      headerName: "Individual Type",
      field: "individualType",
      filter: 'agTextColumnFilter',
      minWidth: 120,
      cellRenderer: ({ data }: { data: Teacher }) => (
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

  return (
    <div className="h-[calc(100vh-200px)] w-full">
      <div className="ag-theme-alpine h-full">
        <AgGridReact
          rowData={teachers}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowSelection="multiple"
          suppressRowClickSelection={false}
          animateRows={true}
          pagination={false}
        />
      </div>
    </div>
  );
}