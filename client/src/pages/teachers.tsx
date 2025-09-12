/**
 * Full Teachers index. This screen pulls all educator records from Airtable via
 * `useCachedEducators` which wraps a React Query cache. Once loaded, records are
 * filtered entirely on the client: first by the global search term coming from
 * `useSearch`, then optionally by the “My records” toggle from
 * `useUserFilter` which keeps only rows where the current user is listed as an
 * assigned partner. The derived list feeds an `AG Grid` instance rendered by
 * `TeachersGrid`. Rows are prefetched with `prefetchEducator` so that hovering a
 * row loads its detail data in React Query ahead of navigation. The page also
 * includes an inline Add Teacher button and opens the
 * `AddEducatorModal` for inline creation. A small debug header shows the active
 * search term and how many rows remain after filtering so that QA can verify the
 * query logic. No server calls occur for filtering; all transformations happen
 * in-memory after the initial fetch.
 */
import TeachersGrid from "@/components/teachers-grid";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import DetailsPanel from "@/components/DetailsPanel";
import { useMutation } from "@tanstack/react-query";
import { buildKanbanColumns, KANBAN_UNSPECIFIED_KEY, TEACHERS_KANBAN_ORDER, TEACHERS_KANBAN_COLLAPSED, labelsToKeys } from "@/constants/kanban";
import { type Teacher } from "@shared/schema.generated";
import { useEducatorsSupabase } from "@/hooks/use-educators-supabase";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { useState } from "react";
import { useGlobalTypeToSearch } from "@/hooks/use-global-type-to-search";
import AddEducatorModal from "@/components/add-teacher-modal";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";
import { useDetailsTeacher } from "@/hooks/use-details";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Plus, Pencil, Mail, GitMerge } from "lucide-react";
import { GridBase } from "@/components/shared/GridBase";
import { DEFAULT_COL_DEF, DEFAULT_GRID_PROPS } from "@/components/shared/ag-grid-defaults";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewModeToggle } from "@/components/shared/ViewModeToggle";

export default function Teachers() {
  const [showAddEducatorModal, setShowAddEducatorModal] = useState(false);
  const [selected, setSelected] = useState<Teacher[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "kanban" | "split">("table");
  const [kFilters, setKFilters] = useState({ montessori: "All", race: "All", role: "All", stage: "All", discovery: "All", type: "All" });

  const { data: teachers, isLoading } = useEducatorsSupabase();
  
  const {
    filteredData: filteredTeachers,
    searchTerm,
    setSearchTerm,
    searchInputRef,
    gridFilteredCount,
    setGridFilteredCount,
    searchDebug
  } = useSearchFilter<any>({
    data: teachers as any,
    searchFields: (t: any) => {
      const fields: string[] = [];
      fields.push(t.full_name || t.fullName || "");
      fields.push(t.indiv_type || t.individualType || "");
      fields.push(t.discovery_status || t.discoveryStatus || "");
      const roleText = t.current_role_at_active_school || t.currentRoleSchool || '';
      if (roleText) fields.push(roleText.replace(/\bEmerging Teacher Leader\b/g, 'ETL').replace(/\bTeacher Leader\b/g, 'TL'));
      if (Array.isArray(t.race_ethnicity)) fields.push(t.race_ethnicity.join(", "));
      if (Array.isArray(t.raceEthnicity)) fields.push(t.raceEthnicity.join(", "));
      return fields;
    },
    userFilterField: (t: any, currentUser) => {
      const partners = Array.isArray(t.assignedPartner) ? t.assignedPartner : [];
      return partners.some((p: string) => p && p.toLowerCase().includes(currentUser.toLowerCase()));
    },
    debugName: "Teachers"
  });
  // Attach global type-to-search to focus and update the page search input
  useGlobalTypeToSearch(searchInputRef as any, setSearchTerm as any);

  // Counts for header display
  const total = (teachers?.length ?? 0);
  const showing = (gridFilteredCount ?? (filteredTeachers?.length ?? 0));
  
  // Selected teacher detail for split view
  const selectedId = selected?.[0]?.id;
  const selectedIds = new Set((selected || []).map(s => s.id));
  const { data: selectedDetail } = useDetailsTeacher(selectedId);

  // Kanban move mutation: update kanban only (no fallback field)
  const moveMutation = useMutation({ mutationFn: async (_: { id: string; to: string }) => true });

  return (
    <>
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100 flex items-center gap-3 flex-wrap">
            {selected.length > 0 ? (
              <>
                <div className="relative mr-2">
                  <Input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ref={searchInputRef}
                    className="h-8 pl-8 w-48 sm:w-64"
                  />
                  <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
                </div>
                <span className="hidden sm:inline">Selected {selected.length} of {total}</span>
                {/* actions moved to right side and always visible */}
                <div className="ml-auto flex items-center gap-2">
                  {/* Always-visible row actions (disabled when no selection) */}
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                      if (selected.length === 1) window.location.href = `/teacher/${selected[0].id}`; else alert('Bulk editing is not implemented yet.');
                    }}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                      const emails = selected.map(s => (s.currentPrimaryEmailAddress || '')).filter(Boolean);
                      if (!emails.length) return;
                      const q = encodeURIComponent(emails.join(','));
                      window.location.href = `/compose-email?to=${q}`;
                    }}>
                      <Mail className="h-3.5 w-3.5 mr-1" /> Email
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length < 2} onClick={() => {
                      if (selected.length < 2) return;
                      const primary = selected[0];
                      const duplicates = selected.slice(1).map(s => s.id);
                      const ok = window.confirm(`Merge ${selected.length} records into ${primary.fullName}? This will archive duplicates.`);
                      if (!ok) return;
                      fetch('/api/teachers/merge', {
                        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ primaryId: primary.id, duplicateIds: duplicates })
                      }).then(r=>r.json()).then((js)=>{
                        alert('Merge complete');
                        setSelected([] as any);
                        queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
                      }).catch(e=>alert('Merge failed'));
                    }}>
                      <GitMerge className="h-3.5 w-3.5 mr-1" /> Merge
                    </Button>
                  </div>
                  <div className="hidden sm:flex items-center"><ViewModeToggle value={viewMode} onChange={setViewMode} /></div>
                  <Button size="sm" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setShowAddEducatorModal(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Teacher
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="relative mr-2">
                  <Input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ref={searchInputRef}
                    className="h-8 pl-8 w-48 sm:w-64"
                  />
                  <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
                </div>
                <span className="hidden sm:inline">Showing {showing} of {total}</span>
                <div className="ml-auto flex items-center gap-2">
                  {/* Always-visible row actions (disabled when no selection) */}
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                      if (selected.length === 1) window.location.href = `/teacher/${selected[0].id}`; else alert('Bulk editing is not implemented yet.');
                    }}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length === 0} onClick={() => {
                      const emails = selected.map(s => (s.currentPrimaryEmailAddress || '')).filter(Boolean);
                      if (!emails.length) return;
                      const q = encodeURIComponent(emails.join(','));
                      window.location.href = `/compose-email?to=${q}`;
                    }}>
                      <Mail className="h-3.5 w-3.5 mr-1" /> Email
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 shrink-0 whitespace-nowrap px-3" disabled={selected.length < 2} onClick={() => {
                      if (selected.length < 2) return;
                      const primary = selected[0];
                      const duplicates = selected.slice(1).map(s => s.id);
                      const ok = window.confirm(`Merge ${selected.length} records into ${primary.fullName}? This will archive duplicates.`);
                      if (!ok) return;
                      fetch('/api/teachers/merge', {
                        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ primaryId: primary.id, duplicateIds: duplicates })
                      }).then(r=>r.json()).then((js)=>{
                        alert('Merge complete');
                        setSelected([] as any);
                        queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
                      }).catch(e=>alert('Merge failed'));
                    }}>
                      <GitMerge className="h-3.5 w-3.5 mr-1" /> Merge
                    </Button>
                  </div>
                  <div className="hidden sm:flex items-center"><ViewModeToggle value={viewMode} onChange={setViewMode} /></div>
                  <Button size="sm" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setShowAddEducatorModal(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Teacher
                  </Button>
                </div>
              </>
            )}
          </div>
          {viewMode === "table" && (
            <TeachersGrid 
              teachers={filteredTeachers || []} 
              isLoading={isLoading}
              onFilteredCountChange={(count)=>setGridFilteredCount(count)}
              onSelectionChanged={(rows)=>setSelected(rows as Teacher[])}
              onAddTeacher={() => setShowAddEducatorModal(true)}
            />
          )}
          {viewMode === "kanban" && (
            <div className="p-3 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={kFilters.montessori} onValueChange={(v)=>setKFilters(s=>({ ...s, montessori: v }))}>
                  <SelectTrigger className="h-8 w-[160px]"><SelectValue placeholder="Montessori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Montessori: All</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={kFilters.race} onValueChange={(v)=>setKFilters(s=>({ ...s, race: v }))}>
                  <SelectTrigger className="h-8 w-[200px]"><SelectValue placeholder="Race/Ethnicity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Race/Ethnicity: All</SelectItem>
                    {Array.from(new Set((filteredTeachers||[]).flatMap((t:any)=>Array.isArray(t.raceEthnicity)?t.raceEthnicity: (t.raceEthnicity?[t.raceEthnicity]:[])))).filter(Boolean).map((v:any)=>(
                      <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={kFilters.role} onValueChange={(v)=>setKFilters(s=>({ ...s, role: v }))}>
                  <SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Role: All</SelectItem>
                    {Array.from(new Set((filteredTeachers||[]).flatMap((t:any)=>Array.isArray(t.currentRole)?t.currentRole: (t.currentRole?[t.currentRole]:[])))).filter(Boolean).map((v:any)=>(
                      <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={kFilters.stage} onValueChange={(v)=>setKFilters(s=>({ ...s, stage: v }))}>
                  <SelectTrigger className="h-8 w-[200px]"><SelectValue placeholder="Stage/Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Stage/Status: All</SelectItem>
                    {Array.from(new Set((filteredTeachers||[]).flatMap((t:any)=>Array.isArray(t.activeSchoolStageStatus)?t.activeSchoolStageStatus: (t.activeSchoolStageStatus?[t.activeSchoolStageStatus]:[])))).filter(Boolean).map((v:any)=>(
                      <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={kFilters.discovery} onValueChange={(v)=>setKFilters(s=>({ ...s, discovery: v }))}>
                  <SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="Discovery" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Discovery: All</SelectItem>
                    {Array.from(new Set((filteredTeachers||[]).map((t:any)=>t.discoveryStatus).filter(Boolean))).map((v:any)=>(
                      <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={kFilters.type} onValueChange={(v)=>setKFilters(s=>({ ...s, type: v }))}>
                  <SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="Individual Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Type: All</SelectItem>
                    {Array.from(new Set((filteredTeachers||[]).map((t:any)=>t.individualType).filter(Boolean))).map((v:any)=>(
                      <SelectItem key={v} value={String(v)}>{String(v)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <KanbanBoard
                items={(filteredTeachers || []).filter((t:any)=>{
                  const mont = (t.has_montessori_cert ?? t.montessoriCertified) ? 'Yes' : 'No';
                  if (kFilters.montessori!=='All' && mont!==kFilters.montessori) return false;
                  if (kFilters.race!=='All') {
                    const races = Array.isArray(t.race_ethnicity)?t.race_ethnicity:[t.race_ethnicity ?? t.raceEthnicity].filter(Boolean);
                    if (!races.includes(kFilters.race)) return false;
                  }
                  if (kFilters.role!=='All') {
                    const roles = Array.isArray(t.currentRole)?t.currentRole:[t.currentRole].filter(Boolean);
                    if (!roles.includes(kFilters.role)) return false;
                  }
                  if (kFilters.stage!=='All') {
                    const stages = Array.isArray(t.activeSchoolStageStatus)?t.activeSchoolStageStatus:[t.activeSchoolStageStatus].filter(Boolean);
                    if (!stages.includes(kFilters.stage)) return false;
                  }
                  if (kFilters.discovery!=='All' && (t.discovery_status ?? t.discoveryStatus) !== kFilters.discovery) return false;
                  if (kFilters.type!=='All' && (t.indiv_type ?? t.individualType) !== kFilters.type) return false;
                  return true;
                })}
                columns={(() => {
                  const keys = new Set<string>();
                  (filteredTeachers||[]).forEach((t:any) => keys.add((t.kanban_group && String(t.kanban_group)) || KANBAN_UNSPECIFIED_KEY));
                  return buildKanbanColumns(TEACHERS_KANBAN_ORDER, Array.from(keys));
                })()}
                groupBy={(t:any) => (t.kanban_group && String(t.kanban_group)) || KANBAN_UNSPECIFIED_KEY}
                getId={(t:any) => t.id}
                initialCollapsedKeys={labelsToKeys(TEACHERS_KANBAN_COLLAPSED)}
                selectedIds={selectedIds}
                onToggleItem={(id, checked) => {
                  const map = new Map((filteredTeachers||[]).map((t:any)=>[t.id,t]));
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
                  const itemsInCol = (filteredTeachers||[]).filter((t:any) => (((t.kanban_group && String(t.kanban_group)) || KANBAN_UNSPECIFIED_KEY) === key));
                  setSelected(prev => {
                    const prevMap = new Map(prev.map(p=>[p.id,p]));
                    if (checked) {
                      itemsInCol.forEach((it:any)=>{ if (!prevMap.has(it.id)) prevMap.set(it.id, it); });
                    } else {
                      itemsInCol.forEach((it:any)=>{ if (prevMap.has(it.id)) prevMap.delete(it.id); });
                    }
                    return Array.from(prevMap.values()) as any;
                  });
                }}
                renderCard={(t:any) => (
                  <div>
                    <div className="font-medium text-sm"><Link className="text-blue-600 hover:underline" href={`/teacher/${t.id}`}>{t.full_name || t.fullName || ''}</Link></div>
                    <div className="text-xs text-slate-600">
                      <span>{t.current_role_at_active_school || t.currentRoleSchool || ''}</span>
                      {Array.isArray(t.activeSchool) && t.activeSchool.length > 0 && (
                        <>
                          <span className="mx-1 text-slate-400">•</span>
                          {t.activeSchool.map((name:string, i:number) => (
                            t.activeSchoolIds?.[i] ? (
                              <Link key={t.activeSchoolIds[i]} href={`/school/${t.activeSchoolIds[i]}`} className="text-blue-600 hover:underline">{name}</Link>
                            ) : (
                              <span key={`${name}-${i}`}>{name}</span>
                            )
                          )).reduce((prev:any, curr:any, i:number)=> (i? [...prev, <span key={`sep-${i}`}>, </span>, curr] : [curr]), [])}
                        </>
                      )}
                    </div>
                  </div>
                )}
                onItemMove={({ id, from, to }) => moveMutation.mutate({ id, to })}
              />
            </div>
          )}
          {viewMode === "split" && (
            <div className="h-[70vh]">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
                    <div className="ag-theme-material h-full max-w-[260px] min-w-[180px]">
                      <GridBase
                        rowData={filteredTeachers || []}
                        columnDefs={[{
                      headerName: 'Name',
                      valueGetter: (p:any) => p?.data?.full_name || p?.data?.fullName || '',
                      filter: 'agTextColumnFilter',
                      sortable: true,
                      flex: 1,
                      minWidth: 140,
                      cellRenderer: (p:any) => (
                        <a href={`/teacher/${p?.data?.id}`} className="text-blue-600 hover:underline">{p.value}</a>
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
      </main>
      
      <AddEducatorModal 
        open={showAddEducatorModal} 
        onOpenChange={setShowAddEducatorModal} 
      />
    </>
  );
}




