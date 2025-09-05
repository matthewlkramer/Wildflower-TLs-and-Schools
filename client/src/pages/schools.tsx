/**
 * Index of schools. Uses `useCachedSchools` to load all non‑archived schools,
 * filters them in memory based on the global search term and the “My records”
 * toggle (matches current guides or assigned partner), and renders the result in
 * `SchoolsGrid`. The page shows an Add School action and logs debug information
 * about filtering, and tracks the grid's internal
 * filtered row count via callback.
 */
import { useState, useEffect } from "react";
import SchoolsGrid from "@/components/schools-grid";
import AddSchoolModal from "@/components/add-school-modal";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Mail, GitMerge } from "lucide-react";
import { type School } from "@shared/schema";
import { useSearch } from "@/contexts/search-context";
import { useCachedSchools } from "@/hooks/use-cached-data";
import { useUserFilter } from "@/contexts/user-filter-context";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";

export default function Schools() {
  const { searchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const [addSchoolModalOpen, setAddSchoolModalOpen] = useState(false);
  const [selected, setSelected] = useState<School[]>([] as any);

  const { data: schools, isLoading, prefetchSchool } = useCachedSchools();

  // No header AddNew wiring; header shows a fixed Add menu.

  const filteredSchools = (schools || []).filter((school: School) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (school.name || '').toLowerCase().includes(searchTermLower) ||
                         (school.shortName || '').toLowerCase().includes(searchTermLower) ||
                         (school.stageStatus || school.status || '').toLowerCase().includes(searchTermLower) ||
                         (school.membershipStatus || '').toLowerCase().includes(searchTermLower);
    
    if (!matchesSearch) return false;
    
    // Apply user filter if enabled
    if (showOnlyMyRecords && currentUser) {
      // Check if current user is an active guide or assigned partner
      const isMyRecord = school.currentGuides?.some(guide => 
        guide.toLowerCase().includes(currentUser.toLowerCase())
      ) || school.assignedPartner?.toLowerCase().includes(currentUser.toLowerCase()) ||
          false;
      
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

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">


      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100 flex items-center gap-3">
          {selected.length > 0 ? (
            <>
              <span>Selected {selected.length} of {totalAfterSearch}</span>
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-1.5 py-1 sm:flex-nowrap">
                <Button size="xs" variant="outline" className="h-7 rounded-full shrink-0" onClick={() => {
                  if (selected.length === 1) window.location.href = `/school/${(selected as any)[0].id}`; else alert('Bulk editing not implemented yet.');
                }}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button size="xs" className="h-7 rounded-full bg-wildflower-blue hover:bg-blue-700 text-white shrink-0" onClick={() => {
                  alert('Emailing schools is not yet implemented (no clear recipient field).');
                }}>
                  <Mail className="h-3 w-3 mr-1" /> Email
                </Button>
                <Button size="xs" variant="outline" className="h-7 rounded-full shrink-0" disabled={selected.length < 2} onClick={() => alert('Merge wizard not implemented yet. Proposed: choose primary school, merge fields/relations, archive others.')}>
                  <GitMerge className="h-3 w-3 mr-1" /> Merge
                </Button>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="rounded-full bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setAddSchoolModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add School
                </Button>
                <Button size="xs" variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/schools'] })}>
                  Refresh
                </Button>
              </div>
            </>
          ) : (
            <>
              <span>Search:</span>
              <code className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200">{searchTerm || '-'}</code>
              <span>Showing {gridFilteredCount ?? totalAfterSearch} of {totalAfterSearch}</span>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="rounded-full bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setAddSchoolModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add School
                </Button>
                <Button size="xs" variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/schools'] })}>
                  Refresh
                </Button>
              </div>
            </>
          )}
        </div>
        <SchoolsGrid 
          schools={filteredSchools || []} 
          isLoading={isLoading}
          onFilteredCountChange={setGridFilteredCount}
          onSelectionChanged={(rows:any)=>setSelected(rows)}
        />
      </div>

      <AddSchoolModal 
        open={addSchoolModalOpen} 
        onOpenChange={setAddSchoolModalOpen} 
      />
    </main>
  );
}
