import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { EmailAddress } from "@shared/schema";

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
      headerName: "Notes",
      field: "notes",
      flex: 2,
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

  if (emailAddresses.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No email addresses found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="ag-theme-alpine" style={{ height: "300px", width: "100%" }}>
        <AgGridReact
          rowData={emailAddresses}
          columnDefs={columnDefs}
          animateRows={true}
          rowSelection={{ mode: "singleRow" }}
          suppressRowClickSelection={false}
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