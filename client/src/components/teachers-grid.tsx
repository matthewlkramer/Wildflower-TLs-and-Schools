import { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent, FilterChangedEvent } from "ag-grid-community";
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

// Custom cell renderers
const NameCellRenderer = (params: any) => {
  const teacher = params.data;
  return (
    <Link href={`/teacher/${teacher.id}`}>
      <div className="flex items-center cursor-pointer hover:bg-slate-50 p-1 rounded">
        <div className="font-medium text-slate-900">{teacher.fullName}</div>
      </div>
    </Link>
  );
};

const BadgeCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  return (
    <Badge className={getStatusColor(value)}>
      {value}
    </Badge>
  );
};

const DiscoveryStatusCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return <span></span>;
  
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  
  if (value.toLowerCase() === "complete") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
  } else if (value.toLowerCase() === "in process") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
  } else if (value.toLowerCase() === "paused") {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
  }
  
  return (
    <Badge className={`${bgColor} ${textColor} border-transparent`}>
      {value}
    </Badge>
  );
};

const CurrentSchoolCellRenderer = (params: any) => {
  const values = params.value;
  if (!values || !Array.isArray(values) || values.length === 0) {
    return <span></span>;
  }
  
  return (
    <span className="text-slate-900">
      {values.join(", ")}
    </span>
  );
};

const BooleanCellRenderer = (params: any) => {
  const value = params.value;
  return (
    <Badge variant={value ? "default" : "secondary"}>
      {value ? 'Yes' : 'No'}
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

const ActionsCellRenderer = (params: any) => {
  const teacher = params.data;
  
  return (
    <div className="flex space-x-1">
      <Link href={`/teacher/${teacher.id}`}>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Edit className="h-3 w-3" />
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
        onClick={() => {
          // This would trigger delete - you can add the handler here
          console.log('Delete teacher:', teacher.id);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default function TeachersGrid({ teachers, isLoading }: TeachersGridProps) {
  const { toast } = useToast();
  
  // Debug logging
  console.log('TeachersGrid received:', { teachers, isLoading, count: teachers?.length });
  
  const columnDefs: ColDef[] = [
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      cellRenderer: NameCellRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "currentlyActiveSchool",
      headerName: "Current School",
      width: 180,
      cellRenderer: CurrentSchoolCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          teachers.forEach(teacher => {
            if (teacher.currentlyActiveSchool) {
              teacher.currentlyActiveSchool.forEach(school => allValues.add(school));
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "startupStageForActiveSchool",
      headerName: "School Stage Status",
      width: 160,
      cellRenderer: MultiValueCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          teachers.forEach(teacher => {
            if (teacher.startupStageForActiveSchool) {
              teacher.startupStageForActiveSchool.forEach(stage => allValues.add(stage));
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "currentRole",
      headerName: "Current Role",
      width: 140,
      cellRenderer: MultiValueCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          teachers.forEach(teacher => {
            if (teacher.currentRole) {
              teacher.currentRole.forEach(role => allValues.add(role));
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "montessoriCertified",
      headerName: "Montessori Certified",
      width: 140,
      cellRenderer: BooleanCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["Yes", "No"],
      },
    },
    {
      field: "raceEthnicity",
      headerName: "Race/Ethnicity",
      width: 180,
      cellRenderer: MultiValueCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          teachers.forEach(teacher => {
            if (teacher.raceEthnicity) {
              teacher.raceEthnicity.forEach(race => allValues.add(race));
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "discoveryStatus",
      headerName: "Discovery Status",
      width: 140,
      cellRenderer: DiscoveryStatusCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          teachers.forEach(teacher => {
            if (teacher.discoveryStatus) {
              allValues.add(teacher.discoveryStatus);
            }
          });
          return Array.from(allValues);
        }
      },
    },
    {
      field: "individualType",
      headerName: "Individual Type",
      width: 140,
      cellRenderer: BadgeCellRenderer,
      filter: "agSetColumnFilter",
      filterParams: {
        values: () => {
          const allValues = new Set<string>();
          teachers.forEach(teacher => {
            if (teacher.individualType) {
              allValues.add(teacher.individualType);
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
    floatingFilter: false, // We'll show filters in the header instead
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  if (isLoading) {
    return (
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-500">Loading teachers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={teachers}
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