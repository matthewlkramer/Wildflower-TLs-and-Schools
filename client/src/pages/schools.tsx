import SchoolsGrid from "@/components/schools-grid";
import { type School } from "@shared/schema";
import { useSearch } from "@/App";
import { useCachedSchools } from "@/hooks/use-cached-data";

export default function Schools() {
  const { searchTerm } = useSearch();

  const { data: schools, isLoading, prefetchSchool } = useCachedSchools();

  const filteredSchools = schools?.filter((school: School) => {
    const matchesSearch = (school.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (school.status || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <SchoolsGrid 
          schools={filteredSchools || []} 
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
