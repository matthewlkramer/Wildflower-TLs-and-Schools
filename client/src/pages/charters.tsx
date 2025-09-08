/**
 * Lists charter organizations in an AG‑Grid table. Records are fetched from
 * `/api/charters` and kept in React Query cache. Client‑side filters apply the
 * global search term and optional “My records” user filter. Clicking a short
 * name navigates to the charter detail page. The page sets its title to
 * "Charters". The header Add menu is fixed; this page also includes a local
 * Add Charter button in the search row.
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { Charter } from "@shared/schema";
import { useSearch } from "@/contexts/search-context";
import { usePageTitle } from "@/App";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { getStatusColor } from "@/lib/utils";
import { useUserFilter } from "@/contexts/user-filter-context";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { useGridHeight } from "@/components/shared/use-grid-height";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useQuery as useRQ } from "@tanstack/react-query";

export default function Charters() {
  const gridHeight = useGridHeight();
  const { searchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const { setPageTitle } = usePageTitle();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"table" | "kanban" | "split">("table");
  const [selected, setSelected] = useState<Charter[]>([] as any);

  useEffect(() => {
    setPageTitle("Charters");
  }, [setPageTitle]);

  const { data: charters = [], isLoading } = useQuery<Charter[]>({
    queryKey: ["/api/charters"],
    queryFn: async () => {
      const response = await fetch("/api/charters", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch charters");
      return response.json();
    },
  });

  // Filter charters based on search term and user filter
  const filteredCharters = useMemo(() => {
    let filtered = charters;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(charter => 
        charter.shortName?.toLowerCase().includes(searchLower) ||
        charter.fullName?.toLowerCase().includes(searchLower) ||
        charter.city?.toLowerCase().includes(searchLower) ||
        charter.status?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply user filter if enabled
    if (showOnlyMyRecords && currentUser) {
      filtered = filtered.filter(charter => {
        // For demo purposes, we'll check if the charter has demo user relationships
        // In a real app, this would be based on proper user authentication and roles
        const isMyRecord = charter.assignedPartner?.toLowerCase().includes('demo') ||
                          false; // Add more conditions as needed
        
        return isMyRecord;
      });
    }
    
    return filtered;
  }, [charters, searchTerm, showOnlyMyRecords, currentUser]);

  // Debug info similar to Teachers page
  const searchDebug = `Search: "${searchTerm}" | Total: ${charters?.length} | Filtered (user-filter): ${filteredCharters?.length}`;
  logger.log('Charters - filtered result:', searchDebug);
  try { console.log('[Charters] debug:', searchDebug); } catch {}

  const selectedId = (selected as any)?.[0]?.id as string | undefined;
  const { data: selectedDetail } = useRQ<Charter>({
    queryKey: ["/api/charters", selectedId],
    enabled: viewMode === "split" && !!selectedId,
    queryFn: async () => {
      const r = await fetch(`/api/charters/${selectedId}`, { credentials: "include" });
      if (!r.ok) throw new Error("Failed to fetch charter");
      return r.json();
    }
  });

  // Kanban move mutation: update status only (no field fallback)
  const moveMutation = useMutation({
    mutationFn: async ({ id, to }: { id: string; to: string }) => {
      const res = await fetch(`/api/charters/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: to === '__UNSPECIFIED__' ? null : to }),
      });
      if (!res.ok) throw new Error('Failed to update charter');
      return res.json();
    },
    onMutate: async ({ id, to }) => {
      const key = ['/api/charters'];
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<any[]>(key);
      if (prev) {
        queryClient.setQueryData<any[]>(key, prev.map((c) => c.id === id ? { ...c, status: to === '__UNSPECIFIED__' ? null : to } : c));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['/api/charters'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/charters'] });
    }
  });

  const columnDefs: ColDef<Charter>[] = [
    {
      headerName: "Short Name",
      field: "shortName",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        return (
          <button
            onClick={() => setLocation(`/charter/${params.data.id}`)}
            className="text-left hover:text-blue-600 hover:underline w-full h-full"
          >
            {params.value || ""}
          </button>
        );
      },
    },
    {
      headerName: "Full Name",
      field: "fullName",
      flex: 1,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Initial Target Community",
      field: "initialTargetCommunity",
      width: 200,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Projected Open",
      field: "projectedOpen",
      width: 150,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Initial Target Ages",
      field: "initialTargetAges",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const ages = params.value;
        if (!ages || ages.length === 0) {
          return <span className="text-slate-500">Not specified</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {ages.map((age: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {age}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      filter: "agTextColumnFilter",
      cellRenderer: (params: any) => {
        const status = params.value;
        if (!status) {
          return <span className="text-slate-500">Not specified</span>;
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full bg-white rounded-lg border border-slate-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full bg-white rounded-lg border border-slate-200">
        <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100 flex items-center gap-3">
          <span>Search:</span>
          <code className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200">{searchTerm || '-'}</code>
          <span>Showing {filteredCharters?.length ?? 0} of {charters?.length ?? 0}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full p-0.5">
              {(["table","kanban","split"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)} className={`text-xs px-2 py-1 rounded-full ${viewMode===v?"bg-white border border-slate-300":"text-slate-600"}`}>{v}</button>
              ))}
            </div>
            <Button size="xs" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => { try { console.log('Create Charter - to be implemented'); } catch {} }}>
              Add Charter
            </Button>
            <Button size="xs" variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/charters'] })}>
              Refresh
            </Button>
          </div>
        </div>
        {viewMode === "table" && (
          <div style={{ height: gridHeight, width: "100%" }}>
            <AgGridReact
              { ...DEFAULT_GRID_PROPS }
              rowData={filteredCharters}
              columnDefs={columnDefs}
              domLayout="normal"
              headerHeight={40}
              onSelectionChanged={(ev: any) => setSelected(ev.api.getSelectedRows() as any)}
              context={{
                componentName: 'charters-grid'
              }}
              defaultColDef={DEFAULT_COL_DEF}
            />
          </div>
        )}
        {viewMode === "kanban" && (
          <div className="p-3">
            <KanbanBoard
              items={filteredCharters || []}
              columns={(() => {
                const keys = new Set<string>();
                (filteredCharters||[]).forEach((c:any) => keys.add((c.status && String(c.status)) || '__UNSPECIFIED__'));
                const arr = Array.from(keys);
                return arr.map(k => ({ key: k, label: k === '__UNSPECIFIED__' ? 'Unspecified' : k }));
              })()}
              groupBy={(c:any) => (c.status && String(c.status)) || '__UNSPECIFIED__'}
              getId={(c:any) => c.id}
              renderCard={(c:any) => (
                <div>
                  <div className="font-medium text-sm">{c.shortName || c.fullName}</div>
                  <div className="text-xs text-slate-600">{c.city ? c.city : ''}</div>
                  <div className="mt-2 text-xs"><a className="text-blue-600 hover:underline" href={`/charter/${c.id}`}>Open</a></div>
                </div>
              )}
              onItemMove={({ id, to }) => moveMutation.mutate({ id, to })}
            />
          </div>
        )}
        {viewMode === "split" && (
          <div className="h-[70vh]">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={60} minSize={35}>
                <div style={{ height: gridHeight, width: "100%" }}>
                  <AgGridReact
                    { ...DEFAULT_GRID_PROPS }
                    rowData={filteredCharters}
                    columnDefs={columnDefs}
                    domLayout="normal"
                    headerHeight={40}
                    onSelectionChanged={(ev: any) => setSelected(ev.api.getSelectedRows() as any)}
                    context={{ componentName: 'charters-grid' }}
                    defaultColDef={DEFAULT_COL_DEF}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={25}>
                <div className="h-full overflow-y-auto p-4 text-sm">
                  {!selectedId ? (
                    <div className="text-slate-500">Select a row to see details.</div>
                  ) : selectedDetail ? (
                    <div className="space-y-2">
                      <div className="text-lg font-semibold">{selectedDetail.shortName || selectedDetail.fullName}</div>
                      <div><span className="text-slate-500">Status:</span> {selectedDetail.status || '—'}</div>
                      {selectedDetail.initialTargetCommunity && (
                        <div><span className="text-slate-500">Initial Target Community:</span> {selectedDetail.initialTargetCommunity}</div>
                      )}
                      {selectedDetail.projectedOpen && (
                        <div><span className="text-slate-500">Projected Open:</span> {selectedDetail.projectedOpen}</div>
                      )}
                      {selectedDetail.initialTargetAges && (
                        <div><span className="text-slate-500">Ages:</span> {selectedDetail.initialTargetAges}</div>
                      )}
                      <div className="pt-2"><a className="text-blue-600 hover:underline" href={`/charter/${selectedDetail.id}`}>Open full page</a></div>
                    </div>
                  ) : (
                    <div className="text-slate-500">Loading…</div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}
      </div>
    </main>
  );
}
