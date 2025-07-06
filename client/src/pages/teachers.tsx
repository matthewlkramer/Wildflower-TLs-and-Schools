import TeachersGrid from "@/components/teachers-grid";
import { type Teacher } from "@shared/schema";
import { useSearch } from "@/App";
import { useCachedEducators } from "@/hooks/use-cached-data";

export default function Teachers() {
  const { searchTerm } = useSearch();

  const { data: teachers, isLoading, prefetchEducator } = useCachedEducators();

  const filteredTeachers = teachers?.filter((teacher: Teacher) => {
    const matchesSearch = (teacher.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (teacher.primaryPhone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (teacher.currentRole?.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <TeachersGrid 
          teachers={filteredTeachers || []} 
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
