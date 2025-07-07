import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { EducatorSchoolAssociation } from "@shared/schema";

interface EducatorSchoolAssociationsTableProps {
  educatorId: string;
}

export function EducatorSchoolAssociationsTable({ educatorId }: EducatorSchoolAssociationsTableProps) {
  const { data: associations = [], isLoading } = useQuery<EducatorSchoolAssociation[]>({
    queryKey: ["/api/educator-school-associations/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/educator-school-associations/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch educator school associations");
      return response.json();
    },
  });

  const columnDefs: ColDef<EducatorSchoolAssociation>[] = [
    {
      headerName: "School",
      field: "schoolShortName",
      flex: 2,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Role",
      field: "role",
      flex: 2,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const roles = params.value;
        if (Array.isArray(roles)) {
          return roles.join(', ');
        }
        return roles || '-';
      }
    },
    {
      headerName: "Start Date",
      field: "startDate",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "End Date",
      field: "endDate",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Active",
      field: "isActive",
      flex: 1,
      cellRenderer: (params: any) => params.value ? "Yes" : "No",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      filter: "agTextColumnFilter",
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (associations.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No school associations found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
        <AgGridReact
          rowData={associations}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="none"
          suppressRowClickSelection={true}
          domLayout="autoHeight"
          headerHeight={40}
          rowHeight={35}

          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
        />
      </div>
    </div>
  );
}