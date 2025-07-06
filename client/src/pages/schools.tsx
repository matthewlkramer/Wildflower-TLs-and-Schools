import { useState } from "react";
import SchoolsGrid from "@/components/schools-grid";
import AddSchoolModal from "@/components/add-school-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type School } from "@shared/schema";
import { useSearch } from "@/App";
import { useCachedSchools } from "@/hooks/use-cached-data";

export default function Schools() {
  const { searchTerm } = useSearch();
  const [addSchoolModalOpen, setAddSchoolModalOpen] = useState(false);

  const { data: schools, isLoading, prefetchSchool } = useCachedSchools();

  const filteredSchools = (schools || []).filter((school: School) => {
    const matchesSearch = (school.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (school.status || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Add School Button */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setAddSchoolModalOpen(true)}
          className="bg-wildflower-green hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add School
        </Button>
      </div>

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
