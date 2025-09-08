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
import { SummaryTab as TeacherSummary } from "@/components/teacher/tabs/SummaryTab";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type Teacher } from "@shared/schema";
import { useSearch } from "@/contexts/search-context";
import { useCachedEducators } from "@/hooks/use-cached-data";
import { useUserFilter } from "@/contexts/user-filter-context";
import { useEffect, useState } from "react";
import AddEducatorModal from "@/components/add-teacher-modal";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Mail, GitMerge } from "lucide-react";

export default function Teachers() {
  const searchContext = useSearch();
  const { searchTerm, setSearchTerm } = searchContext;
  logger.log('Teachers - useSearch context result:', searchContext);
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const [showAddEducatorModal, setShowAddEducatorModal] = useState(false);
  const [selected, setSelected] = useState<Teacher[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "kanban" | "split">("table");

  const { data: teachers, isLoading, prefetchEducator } = useCachedEducators();
  const [gridFilteredCount, setGridFilteredCount] = useState<number | null>(null);
  
  // Debug search state
  logger.log('Teachers render - searchTerm:', `"${searchTerm}"`);;
  
  // No header AddNew wiring; header shows a fixed Add menu.

  // Apply text search + user filter
  const filteredTeachers = (teachers || []).filter((teacher: Teacher) => {
    if (!teacher) return false;
    // Text search across common fields (fallback in case AG Grid Quick Filter is unavailable)
    const term = (searchTerm || "").trim().toLowerCase();
    if (term) {
      const haystacks: string[] = [];
      // Name and types
      haystacks.push(teacher.fullName || "");
      haystacks.push(teacher.individualType || "");
      haystacks.push(teacher.discoveryStatus || "");
      // Roles with standard abbreviations (match the grid's valueGetter)
      if (Array.isArray(teacher.currentRole)) {
        const roleText = teacher.currentRole.join(", ")
          .replace(/\bEmerging Teacher Leader\b/g, 'ETL')
          .replace(/\bTeacher Leader\b/g, 'TL');
        haystacks.push(roleText);
      }
      // Active school names
      if (Array.isArray(teacher.activeSchool)) haystacks.push(teacher.activeSchool.join(", "));
      // Stage/Status for active school association
      if (Array.isArray(teacher.activeSchoolStageStatus)) haystacks.push(teacher.activeSchoolStageStatus.join(", "));
      // Demographics and assignments
      if (Array.isArray(teacher.raceEthnicity)) haystacks.push(teacher.raceEthnicity.join(", "));
      if (Array.isArray(teacher.assignedPartner)) haystacks.push(teacher.assignedPartner.join(", "));
      if (Array.isArray(teacher.assignedPartnerEmail)) haystacks.push(teacher.assignedPartnerEmail.join(", "));
      const matchesSearch = haystacks.some(v => (v || "").toLowerCase().includes(term));
      if (!matchesSearch) return false;
    }
    if (showOnlyMyRecords && currentUser) {
      const isMyRecord = teacher.assignedPartner && teacher.assignedPartner.length > 0 &&
        teacher.assignedPartner.some(partner => partner && partner.toLowerCase().includes((currentUser || '').toLowerCase()));
      return isMyRecord;
    }
    return true;
  });
  
  // Debug info after filtering (prefer grid-displayed count when available)
  const showing = gridFilteredCount ?? (filteredTeachers?.length ?? 0);
  const total = teachers?.length ?? 0;
  const searchDebug = `Search: "${searchTerm}" | Total: ${total} | Filtered (user-filter/grid): ${showing}`;
  logger.log('Teachers - filtered result:', searchDebug);
  try { console.log('[Teachers] debug:', searchDebug); } catch {}
  
  // Selected teacher detail for split view
  const selectedId = selected?.[0]?.id;
  const { data: selectedDetail } = useQuery<Teacher>({
    queryKey: ["/api/educators", selectedId],
    enabled: viewMode === "split" && !!selectedId,
    queryFn: async () => {
      const r = await fetch(`/api/educators/${selectedId}`, { credentials: "include" });
      if (!r.ok) throw new Error("Failed to fetch teacher");
      return r.json();
    }
  });

  // Kanban move mutation: update kanban only (no fallback field)
  const moveMutation = useMutation({
    mutationFn: async ({ id, to }: { id: string; to: string }) => {
      const res = await fetch(`/api/educators/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kanban: to === '__UNSPECIFIED__' ? null : to }),
      });
      if (!res.ok) throw new Error('Failed to update educator');
      return res.json();
    },
    onMutate: async ({ id, to }) => {
      const key = ['/api/educators'];
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<any[]>(key);
      if (prev) {
        queryClient.setQueryData<any[]>(key, prev.map((t) => t.id === id ? { ...t, kanban: to === '__UNSPECIFIED__' ? null : to } : t));
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['/api/educators'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/educators'] });
    }
  });

  return (
    <>
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100 flex items-center gap-3">
            {selected.length > 0 ? (
              <>
                <span>Selected {selected.length} of {total}</span>
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-1.5 py-1 sm:flex-nowrap">
                  <Button size="xs" variant="outline" className="h-7 rounded-full shrink-0" onClick={() => {
                    if (selected.length === 1) {
                      window.location.href = `/teacher/${selected[0].id}`;
                    } else {
                      alert('Bulk editing is not implemented yet.');
                    }
                  }}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="xs" className="h-7 rounded-full bg-wildflower-blue hover:bg-blue-700 text-white shrink-0" onClick={() => {
                    const emails = selected.map(s => (s.currentPrimaryEmailAddress || '')).filter(Boolean);
                    const q = encodeURIComponent(emails.join(','));
                    window.location.href = `/compose-email?to=${q}`;
                  }}>
                    <Mail className="h-3 w-3 mr-1" /> Email
                  </Button>
                  <Button size="xs" variant="outline" className="h-7 rounded-full shrink-0" disabled={selected.length < 2} onClick={() => {
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
                    <GitMerge className="h-3 w-3 mr-1" /> Merge
                  </Button>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden sm:flex items-center bg-slate-100 rounded-full p-0.5">
                    {(["table","kanban","split"] as const).map(v => (
                      <button key={v} onClick={() => setViewMode(v)} className={`text-xs px-2 py-1 rounded-full ${viewMode===v?"bg-white border border-slate-300":"text-slate-600"}`}>{v}</button>
                    ))}
                  </div>
                  <Button size="sm" className="rounded-full bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setShowAddEducatorModal(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Teacher
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span>Search:</span>
                <code className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200">{searchTerm || '-'}</code>
                <span>Showing {showing} of {total}</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden sm:flex items-center bg-slate-100 rounded-full p-0.5">
                    {(["table","kanban","split"] as const).map(v => (
                      <button key={v} onClick={() => setViewMode(v)} className={`text-xs px-2 py-1 rounded-full ${viewMode===v?"bg-white border border-slate-300":"text-slate-600"}`}>{v}</button>
                    ))}
                  </div>
                  <Button size="sm" className="rounded-full bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setShowAddEducatorModal(true)}>
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
            <div className="p-3">
              <KanbanBoard
                items={filteredTeachers || []}
                columns={(() => {
                  const keys = new Set<string>();
                  (filteredTeachers||[]).forEach((t:any) => keys.add((t.kanban && String(t.kanban)) || '__UNSPECIFIED__'));
                  const cols = Array.from(keys);
                  return cols.map(k => ({ key: k, label: k === '__UNSPECIFIED__' ? 'Unspecified' : k }));
                })()}
                groupBy={(t:any) => (t.kanban && String(t.kanban)) || '__UNSPECIFIED__'}
                getId={(t:any) => t.id}
                renderCard={(t) => (
                  <div>
                    <div className="font-medium text-sm">{(t as any).fullName || (t as any).firstName + ' ' + (t as any).lastName}</div>
                    <div className="text-xs text-slate-600">{Array.isArray((t as any).currentRole) ? (t as any).currentRole.join(', ') : (t as any).currentRole}</div>
                    <div className="text-xs text-slate-500">{Array.isArray((t as any).activeSchool) ? (t as any).activeSchool.join(', ') : (t as any).activeSchool}</div>
                    <div className="mt-2 text-xs"><a className="text-blue-600 hover:underline" href={`/teacher/${(t as any).id}`}>Open</a></div>
                  </div>
                )}
                onItemMove={({ id, from, to }) => moveMutation.mutate({ id, to })}
              />
            </div>
          )}
          {viewMode === "split" && (
            <div className="h-[70vh]">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={60} minSize={35}>
                  <TeachersGrid 
                    teachers={filteredTeachers || []} 
                    isLoading={isLoading}
                    onFilteredCountChange={(count)=>setGridFilteredCount(count)}
                    onSelectionChanged={(rows)=>setSelected(rows as Teacher[])}
                    onAddTeacher={() => setShowAddEducatorModal(true)}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={25}>
                  <div className="h-full overflow-y-auto p-4">
                    {!selectedId ? (
                      <div className="text-sm text-slate-500">Select a row to see details.</div>
                    ) : selectedDetail ? (
                      <TeacherSummary teacher={selectedDetail} />
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
