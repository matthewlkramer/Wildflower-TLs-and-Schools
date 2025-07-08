import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { CharterAuthorizerContact } from "@shared/schema";
import { Edit, Trash2, Mail, Phone } from "lucide-react";

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
    enabled: !!charterId,
  });

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
      width: 180,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Organization",
      field: "organization",
      width: 200,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Role",
      field: "role",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Email",
      field: "email",
      width: 200,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const email = params.value;
        if (!email) return <span className="text-slate-500">Not provided</span>;
        return (
          <a
            href={`mailto:${email}`}
            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
          >
            <Mail className="h-3 w-3" />
            {email}
          </a>
        );
      },
    },
    {
      headerName: "Phone",
      field: "phone",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const phone = params.value;
        if (!phone) return <span className="text-slate-500">Not provided</span>;
        return (
          <a
            href={`tel:${phone}`}
            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
          >
            <Phone className="h-3 w-3" />
            {phone}
          </a>
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
        const contact = params.data;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(contact)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit contact"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(contact)}
              className="text-red-600 hover:text-red-800"
              title="Delete contact"
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
        rowData={contacts}
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