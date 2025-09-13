import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/integrations/supabase/client";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { createTextFilter } from "@/utils/ag-grid-utils";
import type { EmailAddress } from "@shared/schema.generated";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, UserCheck } from "lucide-react";

interface EmailAddressesTableProps {
  educatorId: string;
}

export function EmailAddressesTable({ educatorId }: EmailAddressesTableProps) {
  const { data: emailAddresses = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/email_addresses/people", educatorId],
    enabled: !!educatorId,
    queryFn: async () => {
      // Attempt fresh builders for each ordering to avoid multiple order params
      const base = () => supabase.from('email_addresses').select('*').eq('people_id', educatorId);
      try {
        const { data } = await base().order('updated_at', { ascending: false });
        return data || [];
      } catch (e) {
        try {
          const { data } = await base().order('created_at', { ascending: false });
          return data || [];
        } catch (e2) {
          const { data } = await base().order('id', { ascending: false });
          return data || [];
        }
      }
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["supabase/email_addresses/people", educatorId] });
  };

  const handleEdit = async (emailAddress: any) => {
    const nextEmail = window.prompt("Update email", (emailAddress as any).email_address || "");
    if (nextEmail === null) return;
    const nextType = window.prompt("Update type", (emailAddress as any).category || "");
    try {
      const { error } = await supabase.from('email_addresses').update({ email_address: nextEmail, category: nextType || null }).eq('id', emailAddress.id);
      if (error) throw error;
      refresh();
    } catch (err) {
      console.error("Failed to update email address", err);
    }
  };

  const handleDelete = async (emailAddress: EmailAddress) => {
    if (!window.confirm("Delete this email address?")) return;
    try {
      const { error } = await supabase.from('email_addresses').delete().eq('id', emailAddress.id);
      if (error) throw error;
      refresh();
    } catch (err) {
      console.error("Failed to delete email address", err);
    }
  };

  const handleInactivate = async (emailAddress: EmailAddress) => {
    try {
      const { error } = await supabase.from('email_addresses').update({ status: 'inactive' }).eq('id', emailAddress.id);
      if (error) throw error;
      refresh();
    } catch (err) {
      console.error("Failed to inactivate email address", err);
    }
  };

  const handleMakePrimary = async (emailAddress: EmailAddress) => {
    try {
      // Mark the selected as primary; you may also want to unset others in DB via trigger or additional updates
      const { error } = await supabase.from('email_addresses').update({ is_primary: true }).eq('id', emailAddress.id);
      if (error) throw error;
      refresh();
    } catch (err) {
      console.error("Failed to make email primary", err);
    }
  };

  const ActionsCellRenderer = (params: ICellRendererParams<any>) => {
    const emailAddress = params.data;
    if (!emailAddress) return null;

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-blue-50"
          onClick={() => handleEdit(emailAddress)}
          title="Edit email address"
        >
          <Edit3 className="h-3 w-3 text-blue-600" />
        </Button>
        {!emailAddress["primary"] && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-green-50"
            onClick={() => handleMakePrimary(emailAddress)}
            title="Make primary"
          >
            <UserCheck className="h-3 w-3 text-green-600" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-50"
          onClick={() => handleDelete(emailAddress)}
          title="Delete email address"
        >
          <Trash2 className="h-3 w-3 text-red-600" />
        </Button>
      </div>
    );
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Email",
      field: "email_address",
      flex: 2,
      ...createTextFilter(),
    },
    {
      headerName: "Type",
      field: "category",
      flex: 1,
      ...createTextFilter(),
    },
    {
      headerName: "Primary",
      field: "primary",
      flex: 1,
      valueGetter: (p: any) => Boolean(p?.data?.["primary"]),
      cellRenderer: (params: any) => params.value ? "Yes" : "No",
      ...createTextFilter(),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 140,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
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
        <GridBase
          rowData={emailAddresses}
          columnDefs={columnDefs}
          defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
          gridProps={{
            rowSelection: { enableClickSelection: false } as any,
            domLayout: 'autoHeight',
            context: { componentName: 'email-addresses-table' },
            sideBar: false,
          }}
        />
      </div>
    </div>
  );
}
