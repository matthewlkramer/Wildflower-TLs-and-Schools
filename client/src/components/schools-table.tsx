import { Link } from "wouter";
import { Edit, Trash2, School2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type School } from "@/types/db-options";
import { getStatusColor } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { deleteSchool } from "@/integrations/supabase/wftls";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import { useEducatorLookup } from "@/hooks/use-lookup";
import { LinkifyEducatorNames } from "@/components/shared/Linkify";
import { RowActionsSelect } from "@/components/shared/RowActionsSelect";

interface SchoolsTableProps {
  schools: School[];
  isLoading: boolean;
}

export default function SchoolsTable({ schools, isLoading }: SchoolsTableProps) {
  const [deleteSchoolId, setDeleteSchoolId] = useState<string | null>(null);
  const { toast } = useToast();
  const { educatorByName } = useEducatorLookup();

  const deleteSchoolMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteSchool(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase/grid_school"] });
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

  const handleDelete = (id: string) => {
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
              <TableHead>Short Name</TableHead>
              <TableHead>Stage Status</TableHead>
              <TableHead>Current TLs</TableHead>
              <TableHead>Ages Served</TableHead>
              <TableHead>Governance Model</TableHead>
              <TableHead>Membership Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id} className="hover:bg-slate-50">
                {/* Short Name */}
                <TableCell>
                  <Link href={`/school/${school.id}`}>
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <div className="w-10 h-10 bg-wildflower-green rounded-lg flex items-center justify-center">
                        <School2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{school.shortName || school.name}</div>
                      </div>
                    </div>
                  </Link>
                </TableCell>
                
                {/* Stage Status */}
                <TableCell>
                  <Badge className={getStatusColor(school.status || 'unknown')}>
                    {school.status || 'Not specified'}
                  </Badge>
                </TableCell>
                
                {/* Current TLs (Teacher Leaders) */}
                <TableCell>
                  <div className="text-sm text-slate-900 flex flex-wrap gap-1">
                    <LinkifyEducatorNames names={school.currentTLs as any} educatorByName={educatorByName} />
                  </div>
                </TableCell>
                
                {/* Ages Served */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {school.agesServed?.length ? (
                      school.agesServed.map((age, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {age}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Not specified</span>
                    )}
                  </div>
                </TableCell>
                
                {/* Governance Model */}
                <TableCell>
                  <div className="text-sm text-slate-900">
                    {school.governanceModel || 'Not specified'}
                  </div>
                </TableCell>
                
                {/* Membership Status */}
                <TableCell>
                  <Badge variant={school.membershipFeeStatus === 'Active' ? "default" : "secondary"}>
                    {school.membershipFeeStatus || 'Not specified'}
                  </Badge>
                </TableCell>
                
                {/* Actions */}
                <TableCell>
                  <RowActionsSelect
                    size="sm"
                    options={[
                      { value: 'open', label: 'Open', run: () => { try { window.location.href = `/school/${school.id}`; } catch {} } },
                      { value: 'delete', label: 'Delete', run: () => setDeleteSchoolId(school.id) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
