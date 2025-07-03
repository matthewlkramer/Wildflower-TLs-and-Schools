import { useQuery } from "@tanstack/react-query";
import TeachersGrid from "@/components/teachers-grid";
import { type Teacher } from "@shared/schema";
import { useSearch } from "@/App";

export default function Teachers() {
  const { searchTerm } = useSearch();

  const { data: teachers, isLoading } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
  });

  const filteredTeachers = teachers?.filter(teacher => {
    const matchesSearch = (teacher.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (teacher.primaryPhone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (teacher.currentRole?.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <TeachersGrid teachers={filteredTeachers || []} isLoading={isLoading} />
      </div>
    </main>
  );
}
