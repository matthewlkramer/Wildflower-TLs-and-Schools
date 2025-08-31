import { Link } from "wouter";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResizableTable, ResizableTableHeader, ResizableTableBody, ResizableTableRow, ResizableTableHead, ResizableTableCell } from "./resizable-table";
import { useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { type Teacher } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import ColumnFilter from "./column-filter";

interface TeachersTableProps {
  teachers: Teacher[];
  isLoading: boolean;
}

export default function TeachersTable({ teachers, isLoading }: TeachersTableProps) {
  const [deleteTeacherId, setDeleteTeacherId] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({
    fullName: [],
    activeSchool: [],
    activeSchoolStageStatus: [],
    currentRole: [],
    montessoriCertified: [],
    raceEthnicity: [],
    discoveryStatus: [],
    individualType: [],
  });
  const { toast } = useToast();

  // Filter handling
  const handleFilterChange = (column: string, values: string[]) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: values
    }));
  };

  // Apply filters to teachers data
  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    
    return teachers.filter(teacher => {
      // Check each column filter
      for (const [column, filterValues] of Object.entries(columnFilters)) {
        if (filterValues.length === 0) continue; // No filter applied
        
        const fieldValue = teacher[column as keyof Teacher];
        
        // Handle different field types
        let matchesFilter = false;
        
        if (fieldValue === null || fieldValue === undefined || fieldValue === "") {
          matchesFilter = filterValues.includes("(Empty)");
        } else if (Array.isArray(fieldValue)) {
          // Multi-value fields (like raceEthnicity, currentRole)
          matchesFilter = fieldValue.some(val => 
            filterValues.includes(val?.toString() || "")
          );
        } else if (typeof fieldValue === "boolean") {
          matchesFilter = filterValues.includes(fieldValue.toString());
        } else {
          matchesFilter = filterValues.includes(fieldValue?.toString() || "");
        }
        
        if (!matchesFilter) return false;
      }
      
      return true;
    });
  }, [teachers, columnFilters]);

  const deleteTeacherMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/teachers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teachers"] });
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteTeacherMutation.mutate(id);
    setDeleteTeacherId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <ResizableTable>
          <ResizableTableHeader>
            <ResizableTableRow className="bg-slate-50">
              <ResizableTableHead className="relative">
                <div className="flex items-center justify-between">
                  <span>Full Name</span>
                  <ColumnFilter
                    column="fullName"
                    data={teachers}
                    fieldKey="fullName"
                    filterValues={columnFilters.fullName}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={180} minWidth={120} maxWidth={250}>
                <div className="flex items-center justify-between">
                  <span>Current School</span>
                  <ColumnFilter
                    column="activeSchool"
                    data={teachers}
                    fieldKey="activeSchool"
                    filterValues={columnFilters.activeSchool}
                    onFilterChange={handleFilterChange}
                    isMultiValue={true}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={160} minWidth={120} maxWidth={220}>
                <div className="flex items-center justify-between">
                  <span>School Stage Status</span>
                  <ColumnFilter
                    column="activeSchoolStageStatus"
                    data={teachers}
                    fieldKey="activeSchoolStageStatus"
                    filterValues={columnFilters.activeSchoolStageStatus}
                    onFilterChange={handleFilterChange}
                    isMultiValue={true}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={140} minWidth={100} maxWidth={200}>
                <div className="flex items-center justify-between">
                  <span>Current Role</span>
                  <ColumnFilter
                    column="currentRole"
                    data={teachers}
                    fieldKey="currentRole"
                    filterValues={columnFilters.currentRole}
                    onFilterChange={handleFilterChange}
                    isMultiValue={true}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={140} minWidth={100} maxWidth={180}>
                <div className="flex items-center justify-between">
                  <span>Montessori Certified</span>
                  <ColumnFilter
                    column="montessoriCertified"
                    data={teachers}
                    fieldKey="montessoriCertified"
                    filterValues={columnFilters.montessoriCertified}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={180} minWidth={140} maxWidth={250}>
                <div className="flex items-center justify-between">
                  <span>Race/Ethnicity</span>
                  <ColumnFilter
                    column="raceEthnicity"
                    data={teachers}
                    fieldKey="raceEthnicity"
                    filterValues={columnFilters.raceEthnicity}
                    onFilterChange={handleFilterChange}
                    isMultiValue={true}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={140} minWidth={100} maxWidth={180}>
                <div className="flex items-center justify-between">
                  <span>Discovery Status</span>
                  <ColumnFilter
                    column="discoveryStatus"
                    data={teachers}
                    fieldKey="discoveryStatus"
                    filterValues={columnFilters.discoveryStatus}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={140} minWidth={100} maxWidth={180}>
                <div className="flex items-center justify-between">
                  <span>Individual Type</span>
                  <ColumnFilter
                    column="individualType"
                    data={teachers}
                    fieldKey="individualType"
                    filterValues={columnFilters.individualType}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </ResizableTableHead>
              <ResizableTableHead defaultWidth={100} minWidth={80} maxWidth={120}>
                <span>Actions</span>
              </ResizableTableHead>
            </ResizableTableRow>
          </ResizableTableHeader>
          <ResizableTableBody>
            {filteredTeachers.map((teacher) => (
              <ResizableTableRow key={teacher.id} className="hover:bg-slate-50">
                {/* Full Name */}
                <ResizableTableCell>
                  <Link href={`/teacher/${teacher.id}`}>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <div className="w-10 h-10 bg-wildflower-green rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {getInitials(teacher.fullName || 'N/A')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{teacher.fullName}</div>
                      </div>
                    </div>
                  </Link>
                </ResizableTableCell>
                
                {/* Current School */}
                <ResizableTableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.activeSchool?.join(', ') || 'No current school'}
                  </div>
                </ResizableTableCell>
                
                {/* School Stage Status */}
                <ResizableTableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.activeSchoolStageStatus?.join(', ') || 'Not specified'}
                  </div>
                </ResizableTableCell>
                
                {/* Current Role */}
                <ResizableTableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.currentRole?.join(', ') || 'No role specified'}
                  </div>
                </ResizableTableCell>
                
                {/* Montessori Certified */}
                <ResizableTableCell>
                  <Badge variant={teacher.montessoriCertified ? "default" : "secondary"}>
                    {teacher.montessoriCertified ? 'Yes' : 'No'}
                  </Badge>
                </ResizableTableCell>
                
                {/* Race/Ethnicity */}
                <ResizableTableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.raceEthnicity?.length ? (
                      teacher.raceEthnicity.map((race, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {race}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Not specified</span>
                    )}
                  </div>
                </ResizableTableCell>
                
                {/* Discovery Status */}
                <ResizableTableCell>
                  <Badge className={getStatusColor(teacher.discoveryStatus || 'unknown')}>
                    {teacher.discoveryStatus || 'Unknown'}
                  </Badge>
                </ResizableTableCell>
                
                {/* Individual Type */}
                <ResizableTableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.individualType || 'Not specified'}
                  </div>
                </ResizableTableCell>
                
                {/* Actions */}
                <ResizableTableCell>
                  <div className="flex space-x-2">
                    <Link href={`/teacher/${teacher.id}`}>
                      <Button variant="ghost" size="sm" className="text-wildflower-blue hover:text-blue-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTeacherId(teacher.id)}
                      className="text-wildflower-red hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </ResizableTableCell>
              </ResizableTableRow>
            ))}
          </ResizableTableBody>
        </ResizableTable>
      </div>

      <DeleteConfirmationModal
        open={deleteTeacherId !== null}
        onOpenChange={() => setDeleteTeacherId(null)}
        onConfirm={() => deleteTeacherId && handleDelete(deleteTeacherId)}
        title="Delete Teacher"
        description="Are you sure you want to delete this teacher? This action cannot be undone."
        isLoading={deleteTeacherMutation.isPending}
      />
    </>
  );
}
