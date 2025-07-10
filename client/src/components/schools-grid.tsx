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
import { type School } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SchoolsGridProps {
  schools: School[];
  isLoading: boolean;
}

// Custom cell renderers
const SchoolNameCellRenderer = (params: any) => {
  const school = params.data;
  return (
    <Link href={`/school/${school.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
      {school.shortName || school.name}
    </Link>
  );
};

const StatusBadgeCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <div className="flex items-center h-full">
      <Badge className={getStatusColor(value)}>
        {value}
      </Badge>
    </div>
  );
};

const MembershipStatusCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <div className="flex items-center h-full">
      <Badge variant={value === 'Active' ? "default" : "secondary"}>
        {value}
      </Badge>
    </div>
  );
};

const MultiValueCellRenderer = (params: any) => {
  const values = params.value;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return <span></span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {values.map((value: string, index: number) => (
        <Badge key={index} variant="outline" className="text-xs">
          {value}
        </Badge>
      ))}
    </div>
  );
};

const CurrentTLsCellRenderer = (params: any) => {
  const school = params.data;
  const currentTLs = school.currentTLs;
  
  if (currentTLs && Array.isArray(currentTLs) && currentTLs.length > 0) {
    return <span>{currentTLs.join(', ')}</span>;
  }
  
  if (currentTLs && typeof currentTLs === 'string') {
    return <span>{currentTLs}</span>;
  }
  
  return <span className="text-slate-400">-</span>;
};

const ActionsCellRenderer = (params: any) => {
  const school = params.data;
  
  return (
    <div className="flex space-x-1">
      <Link href={`/school/${school.id}`}>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <ExternalLink className="h-3 w-3" />
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
        onClick={() => {
          console.log('Delete school:', school.id);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default function SchoolsGrid({ schools, isLoading }: SchoolsGridProps) {
  console.log('SchoolsGrid: received', schools?.length, 'schools');
  console.log('SchoolsGrid: test schools', schools?.filter(s => (s.name || '').toLowerCase().includes('test')));
  const { toast } = useToast();
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
  
  const columnDefs: ColDef[] = [
    {
      field: "name",
      headerName: "School Name",
      width: 200,
      cellRenderer: SchoolNameCellRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      valueGetter: (params) => params.data.shortName || params.data.name,
      comparator: (valueA: string, valueB: string) => {
        const a = (valueA || '').toLowerCase();
        const b = (valueB || '').toLowerCase();
        return a.localeCompare(b);
      },
      sort: 'asc',
    },
    {
      field: "status",
      headerName: "Stage/Status",
      width: 140,
      cellRenderer: StatusBadgeCellRenderer,
      filter: "agTextColumnFilter",
      comparator: (valueA: string, valueB: string) => {
        const a = (valueA || '').toLowerCase();
        const b = (valueB || '').toLowerCase();
        return a.localeCompare(b);
      },
    },
    {
      field: "membershipStatus",
      headerName: "Membership Status",
      width: 160,
      cellRenderer: MembershipStatusCellRenderer,
      filter: "agTextColumnFilter",
      comparator: (valueA: string, valueB: string) => {
        const a = (valueA || '').toLowerCase();
        const b = (valueB || '').toLowerCase();
        return a.localeCompare(b);
      },
    },
    {
      field: "currentTLs",
      headerName: "Current TLs",
      width: 120,
      cellRenderer: CurrentTLsCellRenderer,
      sortable: false,
      filter: false,
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(', ');
        }
        return params.value || '';
      },
    },
    {
      field: "agesServed",
      headerName: "Ages Served",
      width: 140,
      cellRenderer: MultiValueCellRenderer,
      filter: "agTextColumnFilter",
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(', ');
        }
        return params.value || '';
      },
    },
    {
      field: "governanceModel",
      headerName: "Governance Model",
      width: 160,
      cellRenderer: (params: any) => {
        const value = params.value;
        if (!value) return <span></span>;
        
        return (
          <div className="flex items-center h-full">
            <Badge className={getStatusColor(value)}>
              {value}
            </Badge>
          </div>
        );
      },
      filter: "agTextColumnFilter",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
    },
  ];

  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: false,
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

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

  if (isLoading) {
    return (
      <div className="w-full min-h-[280px]" style={{ height: getGridHeight() }}>
        <div className="ag-theme-alpine h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-500">Loading schools...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!schools || schools.length === 0) {
    return (
      <div className="w-full min-h-[280px]" style={{ height: getGridHeight() }}>
        <div className="ag-theme-alpine h-full">
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-500">No schools found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[280px]" style={{ height: getGridHeight() }}>
      <div className="ag-theme-material h-full">
        <AgGridReact
          rowData={schools}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
          animateRows={true}
          rowSelection={{
            mode: 'multiRow',
            enableClickSelection: false
          }}
          enableBrowserTooltips={true}
          rowHeight={30}
        />
      </div>
    </div>
  );
}