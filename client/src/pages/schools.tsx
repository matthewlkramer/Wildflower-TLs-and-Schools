import { useState, useEffect } from "react";
import SchoolsGrid from "@/components/schools-grid";
import AddSchoolModal from "@/components/add-school-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type School } from "@shared/schema";
import { useSearch } from "@/contexts/search-context";
import { useCachedSchools } from "@/hooks/use-cached-data";
import { useUserFilter } from "@/contexts/user-filter-context";
import { addNewEmitter } from "@/lib/add-new-emitter";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/queryClient";

export default function Schools() {
  const { searchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const [addSchoolModalOpen, setAddSchoolModalOpen] = useState(false);

  const { data: schools, isLoading, prefetchSchool } = useCachedSchools();

  // Set up Add New button in header
  useEffect(() => {
    const options = [
      { label: "Create New School", onClick: () => setAddSchoolModalOpen(true) }
    ];
    
    addNewEmitter.setOptions(options);
    
    return () => {
      addNewEmitter.setOptions([]);
    };
  }, []);

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
          <span>Search:</span>
          <code className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200">{searchTerm || '-'}</code>
          <span>Showing {gridFilteredCount ?? totalAfterSearch} of {totalAfterSearch}</span>
        </div>
        <SchoolsGrid 
          schools={filteredSchools || []} 
          isLoading={isLoading}
          onFilteredCountChange={setGridFilteredCount}
        />
      </div>

      <AddSchoolModal 
        open={addSchoolModalOpen} 
        onOpenChange={setAddSchoolModalOpen} 
      />
    </main>
  );
}
