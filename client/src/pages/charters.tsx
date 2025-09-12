/**
 * Lists charter organizations in an AG‑Grid table. Records are fetched from
 * `/api/charters` and kept in React Query cache. Client‑side filters apply the
 * global search term and optional “My records” user filter. Clicking a short
 * name navigates to the charter detail page. The page sets its title to
 * "Charters". The header Add menu is fixed; this page also includes a local
 * Add Charter button in the search row.
 */
import { useMutation } from "@tanstack/react-query";
import { GridBase } from "@/components/shared/GridBase";
import type { ColDef } from "ag-grid-community";
import type { Charter } from "@shared/schema.generated";
import { useSearch } from "@/contexts/search-context";
import { usePageTitle } from "@/App";
import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation } from "wouter";
import { getStatusColor } from "@/lib/utils";
import { useUserFilter } from "@/contexts/user-filter-context";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { useGridHeight } from "@/components/shared/use-grid-height";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useQuery as useRQ } from "@tanstack/react-query";
import { useChartersSupabase } from "@/hooks/use-charters-supabase";
import { buildKanbanColumns, KANBAN_UNSPECIFIED_KEY, CHARTERS_KANBAN_ORDER, CHARTERS_KANBAN_COLLAPSED, labelsToKeys } from "@/constants/kanban";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useGlobalTypeToSearch } from "@/hooks/use-global-type-to-search";
import { createTextFilter } from "@/utils/ag-grid-utils";

export default function Charters() {
  const gridHeight = useGridHeight();
  const { searchTerm, setSearchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const { setPageTitle } = usePageTitle();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"table" | "kanban" | "split">("table");
  const [selected, setSelected] = useState<Charter[]>([] as any);
  const [kFilters, setKFilters] = useState({ state: "All", year: "All", ages: "All" });
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPageTitle("Charters");
  }, [setPageTitle]);

  useGlobalTypeToSearch(searchRef, setSearchTerm);

  const { data: charters = [], isLoading, fields } = useChartersSupabase();

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
  const selectedIds = new Set((selected as any[]).map(s => s.id));
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
      headerName: "Actions",
      field: "actions",
      width: 90,
      filter: false,
      sortable: false,
      suppressHeaderMenuButton: true as any,
      suppressHeaderContextMenu: true as any,
      cellRenderer: (p:any) => (
        <div>
          <button onClick={()=> setLocation(`/charter/${p?.data?.id}`)} className="text-xs px-2 py-1 border hover:bg-slate-50">Open</button>
        </div>
      )
    },
    {
      headerName: "Short Name",
      field: "shortName",
      width: 150,
      ...createTextFilter(),
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
      ...createTextFilter(),
    },
    {
      headerName: "Initial Target Community",
      field: "initialTargetCommunity",
      width: 200,
      ...createTextFilter(),
    },
    {
      headerName: "Projected Open",
      field: "projectedOpen",
      width: 150,
      ...createTextFilter(),
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
          <div className="relative mr-2">
            <Input
              type="text"
              placeholder="Search charters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={searchRef}
              className="h-8 pl-8 w-48 sm:w-64"
            />
            <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
          </div>
          <span className="hidden sm:inline">Showing {filteredCharters?.length ?? 0} of {charters?.length ?? 0}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5">
              {(["table","kanban","split"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)} className={`text-xs px-2 py-1 ${viewMode===v?"bg-white border border-slate-300":"text-slate-600"}`}>{v}</button>
              ))}
            </div>
            <Button size="xs" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => { try { console.log('Create Charter - to be implemented'); } catch {} }}>
              Add Charter
            </Button>
          </div>
        </div>
        {viewMode === "table" && (
          <div style={{ height: gridHeight, width: "100%" }}>
            <GridBase
              rowData={filteredCharters}
              columnDefs={columnDefs}
              defaultColDefOverride={DEFAULT_COL_DEF}
              gridProps={{
                domLayout: 'normal',
                onSelectionChanged: (ev: any) => setSelected(ev.api.getSelectedRows() as any),
                context: { componentName: 'charters-grid' },
              }}
            />
          </div>
        )}
        {viewMode === "kanban" && (
          <div className="p-3 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={kFilters.state} onValueChange={(v)=>setKFilters(s=>({ ...s, state: v }))}>
                <SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">State: All</SelectItem>
                  {Array.from(new Set((filteredCharters||[]).map((c:any)=>c.state).filter(Boolean))).map((v:any)=>(
                    <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={kFilters.year} onValueChange={(v)=>setKFilters(s=>({ ...s, year: v }))}>
                <SelectTrigger className="h-8 w-[200px]"><SelectValue placeholder="Projected Open" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Projected Open: All</SelectItem>
                  {Array.from(new Set((filteredCharters||[]).map((c:any)=>c.projectedOpen).filter(Boolean))).map((v:any)=>(
                    <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={kFilters.ages} onValueChange={(v)=>setKFilters(s=>({ ...s, ages: v }))}>
                <SelectTrigger className="h-8 w-[220px]"><SelectValue placeholder="Initial Target Ages" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Initial Ages: All</SelectItem>
                  {Array.from(new Set((filteredCharters||[]).flatMap((c:any)=>Array.isArray(c.initialTargetAges)?c.initialTargetAges: (c.initialTargetAges?[c.initialTargetAges]:[])))).filter(Boolean).map((v:any)=>(
                    <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <KanbanBoard
              items={(filteredCharters || []).filter((c:any)=>{
                if (kFilters.state!=='All' && c.state!==kFilters.state) return false;
                if (kFilters.year!=='All' && c.projectedOpen!==kFilters.year) return false;
                if (kFilters.ages!=='All'){
                  const ages = Array.isArray(c.initialTargetAges)?c.initialTargetAges:[c.initialTargetAges].filter(Boolean);
                  if (!ages.includes(kFilters.ages)) return false;
                }
                return true;
              })}
              columns={(() => {
                const keys = new Set<string>();
                (filteredCharters||[]).forEach((c:any) => keys.add((c.status && String(c.status)) || KANBAN_UNSPECIFIED_KEY));
                return buildKanbanColumns(CHARTERS_KANBAN_ORDER, Array.from(keys));
              })()}
              groupBy={(c:any) => (c.status && String(c.status)) || KANBAN_UNSPECIFIED_KEY}
              getId={(c:any) => c.id}
              initialCollapsedKeys={labelsToKeys(CHARTERS_KANBAN_COLLAPSED)}
              selectedIds={selectedIds}
              onToggleItem={(id, checked) => {
                const map = new Map((filteredCharters||[]).map((c:any)=>[c.id,c]));
                const item = map.get(id);
                if (!item) return;
                setSelected(prev => {
                  const exists = (prev as any[]).some(p => p.id === id);
                  if (checked && !exists) return ([...prev, item] as any);
                  if (!checked && exists) return ((prev as any[]).filter(p => p.id !== id) as any);
                  return prev;
                });
              }}
              onToggleColumn={(key, checked) => {
                const itemsInCol = (filteredCharters||[]).filter((c:any) => ((c.status && String(c.status)) || KANBAN_UNSPECIFIED_KEY) === key);
                setSelected(prev => {
                  const prevMap = new Map((prev as any[]).map(p=>[p.id,p]));
                  if (checked) {
                    itemsInCol.forEach((it:any)=>{ if (!prevMap.has(it.id)) prevMap.set(it.id, it); });
                  } else {
                    itemsInCol.forEach((it:any)=>{ if (prevMap.has(it.id)) prevMap.delete(it.id); });
                  }
                  return Array.from(prevMap.values()) as any;
                });
              }}
              renderCard={(c:any) => (
                <div>
                  <div className="font-medium text-sm"><Link className="text-blue-600 hover:underline" href={`/charter/${c.id}`}>{c.shortName || c.fullName}</Link></div>
                  <div className="text-xs text-slate-600">{Array.isArray(c.initialTargetAges)? c.initialTargetAges.join(', '): (c.initialTargetAges||'')}</div>
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
                <div className="ag-theme-material h-full">
                  {(() => {
                    const pretty = (key: string) => key
                      .replace(/_/g, ' ')
                      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
                      .replace(/^\w/, (c) => c.toUpperCase());
                    const dynamicCols: ColDef[] | null = fields && fields.length ? fields
                      .filter((f) => f !== 'id')
                      .map((f): ColDef => ({
                        headerName: pretty(f),
                        field: f,
                        filter: 'agTextColumnFilter',
                        sortable: true,
                        flex: 1,
                        minWidth: 120,
                        valueGetter: (p: any) => {
                          const v = p?.data?.[f];
                          if (Array.isArray(v)) return v.join(', ');
                          if (v && typeof v === 'object') return JSON.stringify(v);
                          return v ?? '';
                        },
                      })) : null;
                    return (
                      <GridBase
                        rowData={filteredCharters || []}
                        columnDefs={dynamicCols || [{
                          headerName: 'Charter',
                          valueGetter: (p:any) => p?.data?.shortName || p?.data?.fullName,
                          filter: 'agTextColumnFilter',
                          sortable: true,
                          flex: 1,
                          minWidth: 140,
                          cellRenderer: (p:any) => (
                            <a href={`/charter/${p?.data?.id}`} className="text-blue-600 hover:underline">{p.value}</a>
                          ),
                        }]}
                        defaultColDefOverride={DEFAULT_COL_DEF as any}
                        gridProps={{
                          rowSelection: { mode: 'multiRow', checkboxes: true, headerCheckbox: true } as any,
                          sideBar: (DEFAULT_GRID_PROPS as any).sideBar,
                          enableAdvancedFilter: true as any,
                          onSelectionChanged: (e:any)=> setSelected(e.api.getSelectedRows() as any),
                        }}
                      />
                    );
                  })()}
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
