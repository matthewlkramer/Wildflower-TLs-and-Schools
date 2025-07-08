import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterAuthorizerContact } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";

interface CharterAuthorizerContactsTableProps {
  charterId: string;
}

export function CharterAuthorizerContactsTable({ charterId }: CharterAuthorizerContactsTableProps) {
  const { data: contacts = [], isLoading } = useQuery<CharterAuthorizerContact[]>({
    queryKey: ["/api/charter-authorizer-contacts/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-authorizer-contacts/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter authorizer contacts");
      return response.json();
    },
  });

  const handleOpen = (contact: CharterAuthorizerContact) => {
    console.log("Open contact:", contact);
  };

  const handleEdit = (contact: CharterAuthorizerContact) => {
    console.log("Edit contact:", contact);
  };

  const handleDelete = (contact: CharterAuthorizerContact) => {
    console.log("Delete contact:", contact);
  };

  const columnDefs: ColDef<CharterAuthorizerContact>[] = [
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Organization",
      field: "organization",
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Role",
      field: "role",
      flex: 1,
      minWidth: 120,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Email",
      field: "email",
      flex: 1,
      minWidth: 180,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Phone",
      field: "phone",
      width: 120,
      filter: "agTextColumnFilter",
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
            title="Open contact details"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(params.data)}
            className="h-6 w-6 p-0"
            title="Edit contact"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(params.data)}
            className="h-6 w-6 p-0"
            title="Delete contact"
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
        rowData={contacts}
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