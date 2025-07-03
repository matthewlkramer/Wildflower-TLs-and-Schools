import { Link } from "wouter";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type Teacher } from "@shared/schema";
import { getInitials, getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";

interface TeachersTableProps {
  teachers: Teacher[];
  isLoading: boolean;
}

export default function TeachersTable({ teachers, isLoading }: TeachersTableProps) {
  const [deleteTeacherId, setDeleteTeacherId] = useState<string | null>(null);
  const { toast } = useToast();

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
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Full Name</TableHead>
              <TableHead>Current School</TableHead>
              <TableHead>School Stage Status</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Montessori Certified</TableHead>
              <TableHead>Race/Ethnicity</TableHead>
              <TableHead>Discovery Status</TableHead>
              <TableHead>Individual Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id} className="hover:bg-slate-50">
                {/* Full Name */}
                <TableCell>
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
                </TableCell>
                
                {/* Current School */}
                <TableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.currentlyActiveSchool?.join(', ') || 'No current school'}
                  </div>
                </TableCell>
                
                {/* School Stage Status */}
                <TableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.startupStageForActiveSchool?.join(', ') || 'Not specified'}
                  </div>
                </TableCell>
                
                {/* Current Role */}
                <TableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.currentRole?.join(', ') || 'No role specified'}
                  </div>
                </TableCell>
                
                {/* Montessori Certified */}
                <TableCell>
                  <Badge variant={teacher.montessoriCertified ? "default" : "secondary"}>
                    {teacher.montessoriCertified ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                
                {/* Race/Ethnicity */}
                <TableCell>
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
                </TableCell>
                
                {/* Discovery Status */}
                <TableCell>
                  <Badge className={getStatusColor(teacher.discoveryStatus || 'unknown')}>
                    {teacher.discoveryStatus || 'Unknown'}
                  </Badge>
                </TableCell>
                
                {/* Individual Type */}
                <TableCell>
                  <div className="text-sm text-slate-900">
                    {teacher.individualType || 'Not specified'}
                  </div>
                </TableCell>
                
                {/* Actions */}
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-6 py-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{teachers.length}</span> of <span className="font-medium">{teachers.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button size="sm" className="bg-wildflower-blue hover:bg-blue-700">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
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
