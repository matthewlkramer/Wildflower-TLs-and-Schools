import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import TeachersTable from "@/components/teachers-table";
import { type Teacher } from "@shared/schema";

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const { data: teachers, isLoading } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers"],
  });

  const { data: schools } = useQuery({
    queryKey: ["/api/schools"],
  });

  const filteredTeachers = teachers?.filter(teacher => {
    const matchesSearch = (teacher.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (teacher.primaryPhone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (teacher.currentRole?.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // TODO: Filter by school when associations are implemented
    const matchesSchool = schoolFilter === "all";
    
    return matchesSearch && matchesSchool;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Teachers</h2>
              <p className="text-sm text-slate-600 mt-1">Manage teacher profiles and school associations</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Schools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {(schools as any[])?.map((school: any) => (
                    <SelectItem key={school.id} value={school.id.toString()}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <TeachersTable teachers={filteredTeachers || []} isLoading={isLoading} />
      </div>
    </main>
  );
}
