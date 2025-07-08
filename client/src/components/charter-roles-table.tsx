import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterRole } from "@shared/schema";
import { Edit, Trash2 } from "lucide-react";

interface CharterRolesTableProps {
  charterId: string;
}

export function CharterRolesTable({ charterId }: CharterRolesTableProps) {
  const { data: roles = [], isLoading } = useQuery<CharterRole[]>({
    queryKey: ["/api/charter-roles/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-roles/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter roles");
      return response.json();
    },
    enabled: !!charterId,
  });

  const handleEdit = (role: CharterRole) => {
    console.log("Edit role:", role);
  };

  const handleDelete = (role: CharterRole) => {
    console.log("Delete role:", role);
  };

  const columnDefs: ColDef<CharterRole>[] = [
    {
      headerName: "Role",
      field: "role",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Name",
      field: "name",
      width: 180,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Currently Active",
      field: "currentlyActive",
      width: 120,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const active = params.value;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {active ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const role = params.data;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(role)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit role"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(role)}
              className="text-red-600 hover:text-red-800"
              title="Delete role"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
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
        rowData={roles}
        columnDefs={columnDefs}
        animateRows={true}
        rowSelection="none"
        suppressRowClickSelection={true}
        domLayout="normal"
        headerHeight={40}
        rowHeight={30}
        defaultColDef={{
          sortable: true,
          resizable: true,
          filter: true,
        }}
      />
    </div>
  );
}