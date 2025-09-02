/**
 * Full Teachers index. This screen pulls all educator records from Airtable via
 * `useCachedEducators` which wraps a React Query cache. Once loaded, records are
 * filtered entirely on the client: first by the global search term coming from
 * `useSearch`, then optionally by the “My records” toggle from
 * `useUserFilter` which keeps only rows where the current user is listed as an
 * assigned partner. The derived list feeds an `AG Grid` instance rendered by
 * `TeachersGrid`. Rows are prefetched with `prefetchEducator` so that hovering a
 * row loads its detail data in React Query ahead of navigation. The page also
 * registers an “Add New” action through `addNewEmitter`; selecting this opens the
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
import { addNewEmitter } from "@/lib/add-new-emitter";
import AddEducatorModal from "@/components/add-teacher-modal";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

export default function Teachers() {
  const searchContext = useSearch();
  const { searchTerm, setSearchTerm } = searchContext;
  logger.log('Teachers - useSearch context result:', searchContext);
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const [showAddEducatorModal, setShowAddEducatorModal] = useState(false);

  const { data: teachers, isLoading, prefetchEducator } = useCachedEducators();
  
  // Debug search state
  logger.log('Teachers render - searchTerm:', `"${searchTerm}"`);;
  
  // Set up Add New options for teachers page
  useEffect(() => {
    const options = [
      { label: "Create New Teacher", onClick: () => setShowAddEducatorModal(true) }
    ];
    
    addNewEmitter.setOptions(options);
    
    return () => {
      addNewEmitter.setOptions([]);
    };
  }, []);

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
  
  // Debug info after filtering
  const searchDebug = `Search: "${searchTerm}" | Total: ${teachers?.length} | Filtered (user-filter): ${filteredTeachers?.length}`;
  logger.log('Teachers - filtered result:', searchDebug);
  try { console.log('[Teachers] debug:', searchDebug); } catch {}
  
  return (
    <>
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100 flex items-center gap-3">
            <span>Search:</span>
            <code className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200">{searchTerm || '-'}</code>
            <span>Showing {filteredTeachers?.length ?? 0} of {teachers?.length ?? 0}</span>
          </div>
          <TeachersGrid 
            teachers={filteredTeachers || []} 
            isLoading={isLoading}
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
