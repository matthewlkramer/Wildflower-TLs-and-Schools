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
    <Link href={`/school/${school.id}`}>
      <div className="flex items-center cursor-pointer hover:bg-slate-50 p-1 rounded">
        <div className="font-medium text-slate-900">{school.shortName || school.name}</div>
      </div>
    </Link>
  );
};

const StatusBadgeCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <Badge className={getStatusColor(value)}>
      {value}
    </Badge>
  );
};

const MembershipStatusCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <Badge variant={value === 'Active' ? "default" : "secondary"}>
      {value}
    </Badge>
  );
};

const MultiValueCellRenderer = (params: any) => {
  const values = params.value;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return <span></span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1">
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
    return (
      <div className="flex flex-wrap gap-1">
        {currentTLs.map((name: string, index: number) => (
          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {name}
          </span>
        ))}
      </div>
    );
  }
  
  if (currentTLs && typeof currentTLs === 'string') {
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{currentTLs}</span>;
  }
  
  return <span className="text-slate-400">No TLs</span>;
};

const ActionsCellRenderer = (params: any) => {
  const school = params.data;
  
  return (
    <div className="flex space-x-1">
      <Link href={`/school/${school.id}`}>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Edit className="h-3 w-3" />
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
  const { toast } = useToast();
  
  const columnDefs: ColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      cellRenderer: SchoolNameCellRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      valueGetter: (params) => params.data.shortName || params.data.name,
    },
    {
      field: "status",
      headerName: "Stage/Status",
      width: 140,
      cellRenderer: StatusBadgeCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          schools.forEach(school => {
            if (school.status) {
              allValues.add(school.status);
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "currentTLs",
      headerName: "Current TLs",
      width: 120,
      cellRenderer: CurrentTLsCellRenderer,
      sortable: false,
      filter: false,
    },
    {
      field: "agesServed",
      headerName: "Ages Served",
      width: 140,
      cellRenderer: MultiValueCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          schools.forEach(school => {
            if (school.agesServed) {
              school.agesServed.forEach(age => allValues.add(age));
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "governanceModel",
      headerName: "Governance Model",
      width: 160,
      cellRenderer: StatusBadgeCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          schools.forEach(school => {
            if (school.governanceModel) {
              allValues.add(school.governanceModel);
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "membershipFeeStatus",
      headerName: "Membership Status",
      width: 160,
      cellRenderer: StatusBadgeCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          schools.forEach(school => {
            if (school.membershipFeeStatus) {
              allValues.add(school.membershipFeeStatus);
            }
          });
          return Array.from(allValues);
        }
      },
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

  if (isLoading) {
    return (
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-500">Loading schools...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={schools}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        animateRows={true}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        enableBrowserTooltips={true}
      />
    </div>
  );
}