import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import type { NineNineties } from "@shared/schema.generated";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import { RowActionsSelect } from "@/components/shared/RowActionsSelect";
import { createTextFilter } from "@/utils/ag-grid-utils";
import { supabase } from "@/integrations/supabase/client";

interface NineNinetiesTableProps {
  charterId: string;
}

export function NineNinetiesTable({ charterId }: NineNinetiesTableProps) {
  const { data: tax990s = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/nine_nineties/charter", charterId],
    enabled: !!charterId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nine_nineties')
        .select('*')
        .eq('charter_id', charterId)
        .order('year', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const handleOpen = (tax990: NineNineties) => {
    if (tax990.docUrl) {
      window.open(tax990.docUrl, '_blank');
    }
  };

  const handleEdit = (tax990: NineNineties) => {
    console.log("Edit 990:", tax990);
  };

  const handleDelete = (tax990: NineNineties) => {
    console.log("Delete 990:", tax990);
  };

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "990 Year",
      field: "year",
      width: 120,
      ...createTextFilter(),
      cellRenderer: (params: any) => {
        const tax990 = params.data;
        const year = params.value || "Unknown Year";
        const docUrl = tax990.docUrl ?? tax990.doc_url ?? tax990.attachment_url;
        if (docUrl) {
          return (
            <button
              onClick={() => handleOpen(tax990)}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left flex items-center gap-1"
            >
              {year}
              <ExternalLink className="h-3 w-3" />
            </button>
          );
        }
        return <span>{year}</span>;
      },
    },
    {
      headerName: "Date Entered",
      field: "dateEntered",
      width: 120,
      ...createTextFilter(),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const tax990 = params.data as NineNineties;
        return (
          <RowActionsSelect
            options={[
              { value: 'open', label: 'Open', run: () => handleOpen(tax990), hidden: !tax990.docUrl },
              { value: 'edit', label: 'Edit', run: () => handleEdit(tax990) },
              { value: 'delete', label: 'Delete', run: () => handleDelete(tax990) },
            ]}
          />
        );
      },
    },
  ];

  // Sort 990s by year descending (most recent first)
  const sorted990s = [...tax990s].sort((a, b) => {
    const yearA = parseInt(a.year || "0");
    const yearB = parseInt(b.year || "0");
    return yearB - yearA;
  });

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
        rowData={sorted990s}
        columnDefs={columnDefs}
        defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
        gridProps={{
          rowSelection: { enableClickSelection: false } as any,
          domLayout: 'normal',
          context: { componentName: 'charter-990s-table' },
        }}
      />
    </div>
  );
}
