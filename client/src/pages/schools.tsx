import { useState, useEffect } from "react";
import SchoolsGrid from "@/components/schools-grid";
import AddSchoolModal from "@/components/add-school-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type School } from "@shared/schema";
import { useSearch, useAddNew } from "@/App";
import { useCachedSchools } from "@/hooks/use-cached-data";
import { useUserFilter } from "@/contexts/user-filter-context";

export default function Schools() {
  const { searchTerm } = useSearch();
  const { showOnlyMyRecords, currentUser } = useUserFilter();
  const { setAddNewOptions } = useAddNew();
  const [addSchoolModalOpen, setAddSchoolModalOpen] = useState(false);

  const { data: schools, isLoading, prefetchSchool } = useCachedSchools();

  // Set up Add New button in header
  useEffect(() => {
    console.log("Schools component: Setting up Add New options");
    setAddNewOptions([
      { label: "Add School", onClick: () => setAddSchoolModalOpen(true) }
    ]);

    // Cleanup - remove options when component unmounts
    return () => {
      console.log("Schools component: Cleaning up Add New options");
      setAddNewOptions([]);
    };
  }, [setAddNewOptions]);

  const filteredSchools = (schools || []).filter((school: School) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (school.name || '').toLowerCase().includes(searchTermLower) ||
                         (school.shortName || '').toLowerCase().includes(searchTermLower) ||
                         (school.status || '').toLowerCase().includes(searchTermLower) ||
                         (school.membershipStatus || '').toLowerCase().includes(searchTermLower);
    
    if (!matchesSearch) return false;
    
    // Apply user filter if enabled
    if (showOnlyMyRecords && currentUser) {
      // Check if current user is an active guide or assigned partner
      // For demo purposes, we'll check if the school's current guides contains the user
      const isMyRecord = school.currentGuides?.some(guide => 
        guide.toLowerCase().includes('demo')
      ) || school.assignedPartner?.toLowerCase().includes('demo') ||
          false; // Add more conditions as needed
      
      return isMyRecord;
    }
    
    return true;
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">


      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <SchoolsGrid 
          schools={filteredSchools || []} 
          isLoading={isLoading}
        />
      </div>

      <AddSchoolModal 
        open={addSchoolModalOpen} 
        onOpenChange={setAddSchoolModalOpen} 
      />
    </main>
  );
}
