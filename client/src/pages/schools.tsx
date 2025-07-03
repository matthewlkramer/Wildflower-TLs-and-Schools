import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import SchoolsTable from "@/components/schools-table";
import { type School } from "@shared/schema";

export default function Schools() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: schools, isLoading } = useQuery<School[]>({
    queryKey: ["/api/schools"],
  });

  const filteredSchools = schools?.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || school.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Schools</h2>
              <p className="text-sm text-slate-600 mt-1">Manage school locations and associated teachers</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Elementary">Elementary</SelectItem>
                  <SelectItem value="Middle School">Middle School</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <SchoolsTable schools={filteredSchools || []} isLoading={isLoading} />
      </div>
    </main>
  );
}
