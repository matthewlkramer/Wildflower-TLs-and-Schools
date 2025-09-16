import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { createTextFilter } from "@/utils/ag-grid-utils";
// Using raw Supabase rows; no explicit type needed here
import { supabase } from "@/integrations/supabase/client";

interface EducatorNotesTableProps {
  educatorId: string;
}

export function EducatorNotesTable({ educatorId }: EducatorNotesTableProps) {
  const { data: notes = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/notes/people", educatorId],
    enabled: !!educatorId,
    queryFn: async () => {
      const base = () => supabase.from('notes').select('*').eq('people_id', educatorId);
      let rows: any[] = [];
      try {
        const { data } = await base().order('date_created', { ascending: false });
        rows = data || [];
      } catch {
        try {
          const { data } = await base().order('date', { ascending: false });
          rows = data || [];
        } catch {
          const { data } = await base().order('created_at', { ascending: false });
          rows = data || [];
        }
      }
      // Normalize keys for display
      return rows.map((r: any) => ({
        id: r.id,
        notes: r.notes ?? r.note ?? '',
        dateCreated: r.date_created ?? r.date ?? r.created_at ?? '',
        createdBy: r.created_by ?? r.createdBy ?? '',
      }));
    },
  });

  const columnDefs: ColDef<any>[] = [
    {
      headerName: "Date Created",
      field: "dateCreated",
      flex: 1,
      ...createTextFilter(),
      sort: "desc",
    },
    {
      headerName: "Created By",
      field: "createdBy",
      flex: 1,
      ...createTextFilter(),
    },
    {
      headerName: "Notes",
      field: "notes",
      flex: 3,
      ...createTextFilter(),
      wrapText: true,
      autoHeight: true,
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

  if (notes.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-500">No notes found for this educator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div style={{ height: "400px", width: "100%" }}>
        <GridBase
          rowData={notes}
          columnDefs={columnDefs}
          defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
          gridProps={{
            rowSelection: { enableClickSelection: false } as any,
            domLayout: 'autoHeight',
            context: { componentName: 'educator-notes-table' },
            sideBar: false,
          }}
        />
      </div>
    </div>
  );
}
