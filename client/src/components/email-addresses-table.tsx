import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { themeMaterial } from "ag-grid-community";
import type { EmailAddress } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit3, Trash2, UserCheck, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmailAddressesTableProps {
  educatorId: string;
}

export function EmailAddressesTable({ educatorId }: EmailAddressesTableProps) {
  const { data: emailAddresses = [], isLoading } = useQuery<EmailAddress[]>({
    queryKey: ["/api/email-addresses/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/email-addresses/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch email addresses");
      return response.json();
    },
  });

  const handleEdit = (emailAddress: EmailAddress) => {
    console.log("Edit email address:", emailAddress);
    // TODO: Implement edit functionality
  };

  const handleDelete = (emailAddress: EmailAddress) => {
    console.log("Delete email address:", emailAddress);
    // TODO: Implement delete functionality
  };

  const handleInactivate = (emailAddress: EmailAddress) => {
    console.log("Inactivate email address:", emailAddress);
    // TODO: Implement inactivate functionality
  };

  const handleMakePrimary = (emailAddress: EmailAddress) => {
    console.log("Make primary:", emailAddress);
    // TODO: Implement make primary functionality
  };

  const ActionsCellRenderer = (params: ICellRendererParams<EmailAddress>) => {
    const emailAddress = params.data;
    if (!emailAddress) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleEdit(emailAddress)}
            className="cursor-pointer"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          {!emailAddress.isPrimary && (
            <DropdownMenuItem
              onClick={() => handleMakePrimary(emailAddress)}
              className="cursor-pointer"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Make Primary
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => handleInactivate(emailAddress)}
            className="cursor-pointer"
          >
            <UserX className="mr-2 h-4 w-4" />
            Inactivate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleDelete(emailAddress)}
            className="cursor-pointer text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const columnDefs: ColDef<EmailAddress>[] = [
    {
      headerName: "Email",
      field: "email",
      flex: 2,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Type",
      field: "type",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Primary",
      field: "isPrimary",
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
    {
      headerName: "Actions",
      field: "actions",
      width: 80,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
      suppressMenu: true,
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

  if (emailAddresses.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No email addresses found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div style={{ height: "300px", width: "100%" }}>
        <AgGridReact
          theme={themeMaterial}
          rowData={emailAddresses}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection="none"
          suppressRowClickSelection={true}
          domLayout="autoHeight"
          headerHeight={40}
          rowHeight={30}

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