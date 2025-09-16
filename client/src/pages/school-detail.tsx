/**
 * School detail page (slim). Fetches core data and renders tab components.
 * Heavy UI and grids live under client/src/components/school/tabs.
 */
import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { SummaryTab } from '@/components/school/tabs/SummaryTab';
import { DetailsTab } from '@/components/school/tabs/DetailsTab';
import { LocationsTab } from '@/components/school/tabs/LocationsTab';
import { GuidesTab } from '@/components/school/tabs/GuidesTab';
import { TLsTab } from '@/components/school/tabs/TLsTab';
import { SupportTab } from '@/components/school/tabs/SupportTab';
import { GovernanceTab } from '@/components/school/tabs/GovernanceTab';
import { GrantsTab } from '@/components/school/tabs/GrantsTab';
import { NotesTab } from '@/components/school/tabs/NotesTab';
import { LinkedTab } from '@/components/school/tabs/LinkedTab';
import { ToDoTab } from '@/components/school/tabs/ToDoTab';
// Membership tab removed per request

import { queryClient } from '@/lib/queryClient';
import { useDetailsSchool } from '@/hooks/use-details';
// Types handled inline to avoid import issues
import { updateSchool } from '@/integrations/supabase/wftls';

export default function SchoolDetail() {
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState('summary');

  const { data: school, isLoading } = useDetailsSchool(id);

  // Tabs fetch their own datasets (associations, teachers, locations, guides)

  const updateSchoolDetailsMutation = useMutation({
    mutationFn: async (data: any) => updateSchool(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase/details_schools", id] });
      queryClient.invalidateQueries({ queryKey: ["supabase/grid_school"] });
    },
  });

  if (isLoading || !school) {
    return (
      <main className="max-w-7xl mx-auto p-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-[60vh] w-full" />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">School: {(school as any).long_name || (school as any).school_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tls">TLs</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="ssj">SSJ</TabsTrigger>
              <TabsTrigger value="governance">Docs</TabsTrigger>
              <TabsTrigger value="grants">Grants/Loans</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="todo">ToDo</TabsTrigger>
              <TabsTrigger value="linked">Emails and Meetings</TabsTrigger>

            </TabsList>

            <div className="mt-4">
              <TabsContent value="summary" className="mt-0">
                <SummaryTab school={school} />
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <DetailsTab school={school} />
              </TabsContent>

              <TabsContent value="locations" className="mt-0">
                <LocationsTab schoolId={id || ''} />
              </TabsContent>

              <TabsContent value="guides" className="mt-0">
              <GuidesTab schoolId={id || ''} />
              </TabsContent>

              <TabsContent value="tls" className="mt-0">
              <TLsTab school={school as any} schoolId={id || ''} />
              </TabsContent>

              <TabsContent value="ssj" className="mt-0">
              <SupportTab school={school as any} onSave={(vals) => updateSchoolDetailsMutation.mutate(vals)} />
              </TabsContent>

              <TabsContent value="governance" className="mt-0">
                <GovernanceTab schoolId={id || ''} />
              </TabsContent>
              
              <TabsContent value="grants" className="mt-0">
                <GrantsTab schoolId={id || ''} />
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
              <NotesTab schoolId={id || ''} onSelectNote={() => {}} />
              </TabsContent>

              <TabsContent value="todo" className="mt-0">
                <ToDoTab schoolId={id || ''} />
              </TabsContent>

              <TabsContent value="linked" className="mt-0">
                <LinkedTab schoolId={id || ''} />
              </TabsContent>


            </div>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
