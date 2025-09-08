import { useQuery } from "@tanstack/react-query";
import type { ColDef } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { createTextFilter } from "@/utils/ag-grid-utils";
import type { EducatorNote } from "@shared/schema";

interface EducatorNotesTableProps {
  educatorId: string;
}

export function EducatorNotesTable({ educatorId }: EducatorNotesTableProps) {
  const { data: notes = [], isLoading } = useQuery<EducatorNote[]>({
    queryKey: ["/api/educator-notes/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/educator-notes/educator/${educatorId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch educator notes");
      return response.json();
    },
  });

  const columnDefs: ColDef<EducatorNote>[] = [
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
          }}
        />
      </div>
    </div>
  );
}
