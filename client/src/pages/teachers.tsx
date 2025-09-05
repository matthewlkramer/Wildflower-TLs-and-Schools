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
                  <Button size="sm" className="rounded-full bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setShowAddEducatorModal(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Teacher
                  </Button>
                </div>
              </>
            )}
          </div>
          <TeachersGrid 
            teachers={filteredTeachers || []} 
            isLoading={isLoading}
            onFilteredCountChange={(count)=>setGridFilteredCount(count)}
            onSelectionChanged={(rows)=>setSelected(rows as Teacher[])}
            onAddTeacher={() => setShowAddEducatorModal(true)}
          />
        </div>
      </main>
      
      <AddEducatorModal 
        open={showAddEducatorModal} 
        onOpenChange={setShowAddEducatorModal} 
      />
    </>
  );
}
