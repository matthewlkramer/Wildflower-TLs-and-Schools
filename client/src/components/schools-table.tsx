import { Link } from "wouter";
import { Edit, Trash2, School2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type School } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";

interface SchoolsTableProps {
  schools: School[];
  isLoading: boolean;
}

export default function SchoolsTable({ schools, isLoading }: SchoolsTableProps) {
  const [deleteSchoolId, setDeleteSchoolId] = useState<number | null>(null);
  const { toast } = useToast();

  const deleteSchoolMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/schools/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schools"] });
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteSchoolMutation.mutate(id);
    setDeleteSchoolId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
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
              <TableHead>School Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Teachers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id} className="hover:bg-slate-50">
                <TableCell>
                  <Link href={`/school/${school.id}`}>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <div className="w-10 h-10 bg-wildflower-green rounded-lg flex items-center justify-center">
                        <School2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{school.name}</div>
                        <div className="text-sm text-slate-500">Est. {school.established}</div>
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-900">{school.address}</div>
                  <div className="text-sm text-slate-500">{school.city}, {school.state} {school.zipCode}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-900">{school.type}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-wildflower-blue rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs font-medium">J</span>
                      </div>
                      <div className="w-6 h-6 bg-wildflower-green rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs font-medium">M</span>
                      </div>
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs font-medium">+2</span>
                      </div>
                    </div>
                    <span className="ml-2 text-sm text-slate-500">4 teachers</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(school.status)}>
                    {school.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/school/${school.id}`}>
                      <Button variant="ghost" size="sm" className="text-wildflower-blue hover:text-blue-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteSchoolId(school.id)}
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{schools.length}</span> of <span className="font-medium">{schools.length}</span> results
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
        open={deleteSchoolId !== null}
        onOpenChange={() => setDeleteSchoolId(null)}
        onConfirm={() => deleteSchoolId && handleDelete(deleteSchoolId)}
        title="Delete School"
        description="Are you sure you want to delete this school? This action cannot be undone."
        isLoading={deleteSchoolMutation.isPending}
      />
    </>
  );
}
