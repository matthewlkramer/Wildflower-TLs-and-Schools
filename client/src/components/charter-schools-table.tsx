import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { School } from "@shared/schema";
import { useLocation } from "wouter";
import { getStatusColor } from "@/lib/utils";

interface CharterSchoolsTableProps {
  charterId: string;
}

export function CharterSchoolsTable({ charterId }: CharterSchoolsTableProps) {
  const [, setLocation] = useLocation();

  const { data: schools = [], isLoading } = useQuery<School[]>({
    queryKey: ["/api/schools/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/schools/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter schools");
      return response.json();
    },
    enabled: !!charterId,
  });

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "School Name",
      field: "name",
      width: 200,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const school = params.data;
        return (
          <button
            onClick={() => setLocation(`/schools/${school.id}`)}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
          >
            {school.name}
          </button>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const status = params.value;
        if (!status) return <span className="text-slate-500">Not specified</span>;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      headerName: "SSJ Stage",
      field: "ssjStage",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const stage = params.value;
        if (!stage) return <span className="text-slate-500">Not specified</span>;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stage)}`}>
            {stage}
          </span>
        );
      },
    },
    {
      headerName: "Community",
      field: "community",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Current Guide(s)",
      field: "currentGuides",
      width: 180,
      filter: "agTextColumnFilter",
    },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <AgGridReact
        theme={themeMaterial}
        rowData={schools}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection={{ enableClickSelection: false } as any}
        domLayout="normal"
        headerHeight={40}
        rowHeight={30}
        context={{
          componentName: 'charter-schools-table'
        }}
        defaultColDef={{
          sortable: true,
          resizable: true,
          filter: true,
        }}
      />
    </div>
  );
}
