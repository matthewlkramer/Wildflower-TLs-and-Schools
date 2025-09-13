import React from 'react';
import type { School, Teacher, TeacherSchoolAssociation } from '@shared/schema.generated';
import { Skeleton } from '@/components/ui/skeleton';
import { SchoolTLsAssociationGrid } from '@/components/school/SchoolTLsAssociationGrid';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import CreateAndAssignEducatorModal from '@/components/create-and-assign-educator-modal';
import AssignEducatorModal from '@/components/assign-educator-modal';
import { supabase } from '@/integrations/supabase/client';
import { useEducatorsSupabase } from '@/hooks/use-educators-supabase';

export function TLsTab({ school, schoolId }: { school: School; schoolId: string }) {
  const { data: associations = [], isLoading: associationsLoading, refetch } = useQuery<any[]>({
    queryKey: ["supabase/details_associations", { schoolId }],
    enabled: !!schoolId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('details_associations')
        .select('*')
        .eq('school_id', schoolId);
      if (error) throw error;
      return data || [];
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: teachers = [] } = useEducatorsSupabase();

  const updateAssociation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const patch: any = {
        role: data.role,
        start_date: data.startDate,
        end_date: data.endDate,
        currently_active: data.isActive,
        role_specific_email: data.emailAtSchool,
      };
      const { error } = await supabase.from('people_roles_associations').update(patch).eq('id', id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => refetch(),
  });

  const deleteAssociation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('people_roles_associations').delete().eq('id', id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => refetch(),
  });

  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [createAssignOpen, setCreateAssignOpen] = React.useState(false);
  const [assignExistingOpen, setAssignExistingOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-700">Teacher Leaders and Educator assignments</div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-wildflower-blue hover:bg-blue-700 text-white" onClick={() => setCreateAssignOpen(true)}>
            Add New Educator & Assign
          </Button>
          <Button size="sm" variant="outline" onClick={() => setAssignExistingOpen(true)}>
            Assign Existing Educator
          </Button>
        </div>
      </div>

      {associationsLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : associations && associations.length > 0 ? (
        <div className="border rounded-lg p-3">
          <SchoolTLsAssociationGrid
            school={school}
            associations={(associations as any[]).map((a:any) => ({
              id: a.id,
              educatorId: a.people_id || a.educator_id || a.person_id || a.teacher_id,
              role: a.role || a.roles || a.role_at_school,
              startDate: a.start_date || a.startDate || null,
              endDate: a.end_date || a.endDate || null,
              isActive: (a.currently_active ?? a.isActive) ?? null,
              emailAtSchool: a.role_specific_email || null,
            })) as unknown as TeacherSchoolAssociation[]}
            teachers={teachers || []}
            onUpdateAssociation={(id, data) => updateAssociation.mutate({ id, data })}
            onEndStint={(id) => updateAssociation.mutate({ id, data: { endDate: new Date().toISOString().slice(0, 10) } })}
            onDeleteAssociation={(id) => { setPendingDeleteId(id); setConfirmOpen(true); }}
          />
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p>No teachers found for this school.</p>
          <p className="text-sm mt-2">Use the Add menu or modals to create or assign educators.</p>
        </div>
      )}

      <DeleteConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => { if (pendingDeleteId) deleteAssociation.mutate(pendingDeleteId); }}
        title="Delete Teacher Stint"
        description="Are you sure you want to delete this teacher stint? This action cannot be undone."
        isLoading={false}
      />

      <CreateAndAssignEducatorModal
        open={createAssignOpen}
        onOpenChange={setCreateAssignOpen}
        schoolId={schoolId}
        onSwitchToAssign={() => { setCreateAssignOpen(false); setAssignExistingOpen(true); }}
      />

      <AssignEducatorModal
        open={assignExistingOpen}
        onOpenChange={setAssignExistingOpen}
        schoolId={schoolId}
      />
    </>
  );
}
