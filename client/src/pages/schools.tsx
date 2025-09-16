/**
 * Index of schools. Uses `useCachedSchools` to load all non‑archived schools,
 * filters them in memory based on the global search term and the “My records”
 * toggle (matches current guides or assigned partner), and renders the result in
 * `SchoolsGrid`. The page shows an Add School action and logs debug information
 * about filtering, and tracks the grid's internal
 * filtered row count via callback.
 */
import { useState, useEffect, useRef } from "react";
import SchoolsGrid from "@/components/schools-grid";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import DetailsPanel from "@/components/DetailsPanel";
import { useMutation } from "@tanstack/react-query";
import { buildKanbanColumns, KANBAN_UNSPECIFIED_KEY, SCHOOLS_KANBAN_ORDER, SCHOOLS_KANBAN_COLLAPSED, labelsToKeys } from "@/constants/kanban";
import AddSchoolModal from "@/components/add-school-modal";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Plus, Pencil, Mail, GitMerge } from "lucide-react";
import { GridBase } from "@/components/shared/GridBase";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { type School } from "@/types/db-options";
import { useSearch } from "@/contexts/search-context";
import { useSchoolsSupabase } from "@/hooks/use-schools-supabase";
import { useUserFilter } from "@/contexts/user-filter-context";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";
import { useDetailsSchool } from "@/hooks/use-details";
import { useGlobalTypeToSearch } from "@/hooks/use-global-type-to-search";
import { useEducatorLookup } from "@/hooks/use-lookup";
import { LinkifyEducatorNames } from "@/components/shared/Linkify";
import { createTextFilter } from "@/utils/ag-grid-utils";
import { ViewModeToggle } from "@/components/shared/ViewModeToggle";

export default function Schools() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const [addSchoolModalOpen, setAddSchoolModalOpen] = useState(false);
  const [selected, setSelected] = useState<School[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "kanban" | "split">("table");
  const [kFilters, setKFilters] = useState({ stage: "All", membership: "All", ages: "All", governance: "All" });
  const searchRef = useRef<HTMLInputElement | null>(null);

  const { data: schools, isLoading } = useSchoolsSupabase();
  const { educatorByName } = useEducatorLookup();

  // No header AddNew wiring; header shows a fixed Add menu.
  useGlobalTypeToSearch(searchRef as any, setSearchTerm as any);

  const filteredSchools = (schools || []).filter((school: School) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (
      ((school as any).school_name || (school as any).long_name || '').toString().toLowerCase().includes(searchTermLower) ||
      ((school as any).short_name || '').toString().toLowerCase().includes(searchTermLower) ||
      ((school as any).stage_status || (school as any).status || '').toString().toLowerCase().includes(searchTermLower) ||
      ((school as any).membership_status || '').toString().toLowerCase().includes(searchTermLower)
    );
    
    if (!matchesSearch) return false;
    
    // Apply user filter if enabled
    if (showOnlyMyRecords && currentUser) {
      // Check if current user is an active guide or assigned partner
      const guides: string[] = ((school as any).current_tls as any) || [];
      const assigned: string = ((school as any).assigned_partner as any) || '';
      const isMyRecord = (Array.isArray(guides) && guides.some(g=>String(g).toLowerCase().includes(currentUser.toLowerCase()))) ||
                         (assigned && String(assigned).toLowerCase().includes(currentUser.toLowerCase())) || false;
      
      return isMyRecord;
    }
    
    return true;
  });

  // Debug info similar to Teachers page
  const [gridFilteredCount, setGridFilteredCount] = useState<number>(filteredSchools?.length || 0);
  const totalAfterSearch = filteredSchools?.length || 0;
  const searchDebug = `Search: "${searchTerm}" | Total: ${schools?.length} | Filtered (user-filter): ${filteredSchools?.length} | Grid count: ${gridFilteredCount}`;
  logger.log('Schools - filtered result:', searchDebug);
  try { console.log('[Schools] debug:', searchDebug); } catch {}

  const selectedId = selected?.[0]?.id;
  const selectedIds = new Set(selected.map(s => s.id));
  const { data: selectedDetail } = useDetailsSchool(selectedId);

  // Kanban move mutation: update stageStatus only (no field fallback)
  const moveMutation = useMutation({
    mutationFn: async ({ id, to }: { id: string; to: string }) => {
      const res = await fetch(`/api/schools/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageStatus: to === '__UNSPECIFIED__' ? null : to }),
      });
      if (!res.ok) throw new Error('Failed to update school');
      return res.json();
    },
    onMutate: async ({ id, to }) => {
      const key = ['/api/schools'];
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<any[]>(key);
      if (prev) {
        queryClient.setQueryData<any[]>(key, prev.map((s) => s.id === id ? { ...s, stageStatus: to === '__UNSPECIFIED__' ? null : to } : s));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['/api/schools'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schools'] });
    }
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">


      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          {selected.length > 0 ? (
            <>
              <div className="relative mr-2">
                <Input
                  type="text"
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  ref={searchRef}
                  className="h-8 pl-8 w-48 sm:w-64"
                />
                <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
              </div>
              <span className="hidden sm:inline">Selected {selected.length} of {totalAfterSearch}</span>
              {/* actions moved to right side and always visible */}
              <div className="ml-auto flex items-center gap-2">
                {/* Always-visible row actions (disabled when no selection) */}
                 <div className="hidden sm:flex items-center gap-2 mr-2">
                  <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                    if (selected.length === 1) window.location.href = `/school/${selected[0].id}`; else alert('Bulk editing not implemented yet.');
                  }}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                    if (selected.length === 0) return;
                    alert('Emailing schools is not yet implemented (no clear recipient field).');
                  }}>
                    <Mail className="h-3.5 w-3.5 mr-1" /> Email
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length < 2} onClick={() => alert('Merge wizard not implemented yet. Proposed: choose primary school, merge fields/relations, archive others.')}>
                    <GitMerge className="h-3.5 w-3.5 mr-1" /> Merge
                  </Button>
                </div>
                <div className="hidden sm:flex items-center"><ViewModeToggle value={viewMode} onChange={setViewMode} /></div>
                <Button size="sm" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setAddSchoolModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add School
                </Button>
              </div>
            </>
            ) : (
            <>
              <div className="relative mr-2">
                <Input
                  type="text"
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  ref={searchRef}
                  className="h-8 pl-8 w-48 sm:w-64"
                />
                <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
              </div>
              <span className="hidden sm:inline">Showing {gridFilteredCount ?? totalAfterSearch} of {totalAfterSearch}</span>
              <div className="ml-auto flex items-center gap-2">
                {/* Always-visible row actions (disabled when no selection) */}
                <div className="hidden sm:flex items-center gap-2 mr-2">
                  <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                    if (selected.length === 1) window.location.href = `/school/${selected[0].id}`; else alert('Bulk editing not implemented yet.');
                  }}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                    if (selected.length === 0) return;
                    alert('Emailing schools is not yet implemented (no clear recipient field).');
                  }}>
                    <Mail className="h-3.5 w-3.5 mr-1" /> Email
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length < 2} onClick={() => alert('Merge wizard not implemented yet. Proposed: choose primary school, merge fields/relations, archive others.')}>
                    <GitMerge className="h-3.5 w-3.5 mr-1" /> Merge
                  </Button>
                </div>
                <div className="hidden sm:flex items-center"><ViewModeToggle value={viewMode} onChange={setViewMode} /></div>
                <Button size="sm" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setAddSchoolModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add School
                </Button>
              </div>
            </>
          )}
        </div>
        {viewMode === "table" && (
          <SchoolsGrid 
            schools={filteredSchools || []}
            isLoading={isLoading}
            onFilteredCountChange={setGridFilteredCount}
            onSelectionChanged={(rows: School[]) => setSelected(rows)}
          />
        )}
        {viewMode === "kanban" && (
          <div className="p-3 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={kFilters.stage} onValueChange={(v)=>setKFilters(s=>({ ...s, stage: v }))}>
                <SelectTrigger className="h-8 w-[200px]"><SelectValue placeholder="Stage/Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Stage/Status: All</SelectItem>
                  {Array.from(new Set((filteredSchools||[]).map((s:any)=>s.stage_status || s.status).filter(Boolean))).map((v)=>(
                    <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={kFilters.membership} onValueChange={(v)=>setKFilters(s=>({ ...s, membership: v }))}>
                <SelectTrigger className="h-8 w-[200px]"><SelectValue placeholder="Membership" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Membership: All</SelectItem>
                  {Array.from(new Set((filteredSchools||[]).map((s:any)=>s.membership_status).filter(Boolean))).map((v)=>(
                    <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={kFilters.ages} onValueChange={(v)=>setKFilters(s=>({ ...s, ages: v }))}>
                <SelectTrigger className="h-8 w-[200px]"><SelectValue placeholder="Ages Served" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Ages Served: All</SelectItem>
                  {Array.from(new Set((filteredSchools||[]).flatMap((s:any)=>Array.isArray(s.ages_served)?s.ages_served: (s.ages_served?[s.ages_served]:[])))).filter(Boolean).map((v)=>(
                    <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={kFilters.governance} onValueChange={(v)=>setKFilters(s=>({ ...s, governance: v }))}>
                <SelectTrigger className="h-8 w-[200px]"><SelectValue placeholder="Governance" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Governance: All</SelectItem>
                  {Array.from(new Set((filteredSchools||[]).map((s:any)=>s.governance_model).filter(Boolean))).map((v)=>(
                    <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <KanbanBoard
              items={(filteredSchools || []).filter((s:any)=>{
                if (kFilters.stage!=='All' && ((s.stage_status || s.status) !== kFilters.stage)) return false;
                if (kFilters.membership!=='All' && ((s.membership_status) !== kFilters.membership)) return false;
                if (kFilters.ages!=='All'){
                  const ages = Array.isArray(s.ages_served)?s.ages_served:[s.ages_served].filter(Boolean);
                  if (!ages.includes(kFilters.ages)) return false;
                }
                if (kFilters.governance!=='All' && ((s.governance_model) !== kFilters.governance)) return false;
                return true;
              })}
              columns={(() => {
                const keys = new Set<string>();
                (filteredSchools||[]).forEach((s:any) => keys.add(((s.stage_status) && String(s.stage_status)) || KANBAN_UNSPECIFIED_KEY));
                return buildKanbanColumns(SCHOOLS_KANBAN_ORDER, Array.from(keys));
              })()}
              groupBy={(s: any) => ((s.stage_status) && String(s.stage_status)) || KANBAN_UNSPECIFIED_KEY}
              getId={(s: School) => s.id}
              initialCollapsedKeys={labelsToKeys(SCHOOLS_KANBAN_COLLAPSED)}
              selectedIds={selectedIds}
              onToggleItem={(id, checked) => {
                const map = new Map((filteredSchools||[]).map((s)=>[s.id,s]));
                const item = map.get(id);
                if (!item) return;
                setSelected(prev => {
                  const exists = prev.some(p => p.id === id);
                  if (checked && !exists) return [...prev, item];
                  if (!checked && exists) return prev.filter(p => p.id !== id);
                  return prev;
                });
              }}
              onToggleColumn={(key, checked) => {
                const itemsInCol = (filteredSchools||[]).filter((s:any) => (((s.stage_status || s.stageStatus) && String(s.stage_status || s.stageStatus)) || KANBAN_UNSPECIFIED_KEY) === key);
                setSelected(prev => {
                  const prevMap = new Map(prev.map(p=>[p.id,p]));
                  if (checked) {
                    itemsInCol.forEach((it)=>{ if (!prevMap.has(it.id)) prevMap.set(it.id, it); });
                  } else {
                    itemsInCol.forEach((it)=>{ if (prevMap.has(it.id)) prevMap.delete(it.id); });
                  }
                  return Array.from(prevMap.values());
                });
              }}
              renderCard={(s: any) => (
                <div>
                  <div className="font-medium text-sm"><Link className="text-blue-600 hover:underline" href={`/school/${s.id}`}>{s.school_name || s.short_name || s.long_name}</Link></div>
                  <div className="text-xs text-slate-600 flex flex-wrap gap-1">
                    <LinkifyEducatorNames names={(s.current_tls as any) ?? (s.currentTLs as any)} educatorByName={educatorByName} />
                  </div>
                </div>
              )}
              onItemMove={({ id, to }) => moveMutation.mutate({ id, to })}
            />
          </div>
        )}
        {viewMode === "split" && (
          <div className="h-[70vh]">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
                <div className="ag-theme-material h-full max-w-[260px] min-w-[180px]">
                  <GridBase
                    rowData={filteredSchools || []}
                    columnDefs={[{
                      headerName: 'School Name',
                      valueGetter: (p:any) => p?.data?.school_name || p?.data?.shortName || p?.data?.name,
                      ...createTextFilter(),
                      sortable: true,
                      flex: 1,
                      minWidth: 140,
                      cellRenderer: (p: {data: any; value: string}) => (
                        <a href={`/school/${p?.data?.id}`} className="text-blue-600 hover:underline">{p.value}</a>
                      ),
                    }]}
                    defaultColDefOverride={DEFAULT_COL_DEF}
                    gridProps={{
                      rowSelection: { mode: 'multiRow', checkboxes: true, headerCheckbox: true },
                      sideBar: DEFAULT_GRID_PROPS.sideBar,
                      enableAdvancedFilter: true,
                      onSelectionChanged: (e: {api: {getSelectedRows: () => School[]}})=> setSelected(e.api.getSelectedRows()),
                    }}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={80} minSize={70}>
                <div className="h-full overflow-y-auto p-4">
                  {!selectedId ? (
                    <div className="text-sm text-slate-500">Select a row to see details.</div>
                  ) : selectedDetail ? (
                    <DetailsPanel data={selectedDetail as any} />
                  ) : (
                    <div className="text-sm text-slate-500">Loading…</div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}
      </div>

      <AddSchoolModal 
        open={addSchoolModalOpen} 
        onOpenChange={setAddSchoolModalOpen} 
      />
    </main>
  );
}
