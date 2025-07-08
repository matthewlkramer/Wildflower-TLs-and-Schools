import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterRole } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";

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
  });

  const handleOpen = (role: CharterRole) => {
    console.log("Open role:", role);
  };

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
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Active",
      field: "currentlyActive",
      width: 100,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const active = params.value;
        return (
          <Badge 
            className={`${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-xs`}
            variant="secondary"
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpen(params.data)}
            className="h-6 w-6 p-0"
            title="Open role details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit role"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete role"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-96 w-full">
      <AgGridReact
        rowData={roles}
        columnDefs={columnDefs}
        theme={themeMaterial}
        loading={isLoading}
        rowHeight={30}
        suppressRowClickSelection={true}
        pagination={false}
        domLayout="normal"
        suppressHorizontalScroll={false}
        className="ag-theme-material"
      />
    </div>
  );
}