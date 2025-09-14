import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import type { CharterAuthorizerContact } from "@/types/schema.generated";
import { Edit, Trash2, Mail, Phone } from "lucide-react";
import { RowActionsSelect } from "@/components/shared/RowActionsSelect";
import { createTextFilter } from "@/utils/ag-grid-utils";

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

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Name",
      field: "name",
      width: 180,
      ...createTextFilter(),
    },
    {
      headerName: "Organization",
      field: "organization",
      width: 200,
      ...createTextFilter(),
    },
    {
      headerName: "Role",
      field: "role",
      width: 150,
      ...createTextFilter(),
    },
    {
      headerName: "Email",
      field: "email",
      width: 200,
      ...createTextFilter(),
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
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const contact = params.data as CharterAuthorizerContact;
        return (
          <RowActionsSelect
            options={[
              { value: 'edit', label: 'Edit', run: () => handleEdit(contact) },
              { value: 'delete', label: 'Delete', run: () => handleDelete(contact) },
            ]}
          />
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
      <GridBase
        rowData={contacts}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
        gridProps={{
          rowSelection: { enableClickSelection: false } as any,
          domLayout: 'normal',
          context: { componentName: 'charter-authorizer-contacts-table' },
        }}
      />
    </div>
  );
}
