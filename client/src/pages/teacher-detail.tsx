/**
 * Detailed view for a single educator. Fetches `/api/teachers/:id` and renders
 * tabbed content for summary info, school associations, online forms,
 * certifications, events, notes, and linked systems via tab components under
 * `components/teacher/tabs`. The page also manages inline editing for email
 * addresses using a `GridTableCard` and exposes a mutation to update top-level
 * educator fields, invalidating React Query caches after save.
 */
import { useParams } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useDetailsTeacher } from "@/hooks/use-details";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Teacher, type SSJFilloutForm } from "@shared/schema.generated";
import { InfoCard } from "@/components/shared/InfoCard";
import { DetailGrid } from "@/components/shared/DetailGrid";
import { TableCard } from "@/components/shared/TableCard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { EmailAddress } from "@shared/schema.generated";
import { GridTableCard } from "@/components/shared/GridTableCard";
import type { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SummaryTab } from "@/components/teacher/tabs/SummaryTab";
import { SchoolsTab } from "@/components/teacher/tabs/SchoolsTab";
import { OnlineFormsTab } from "@/components/teacher/tabs/OnlineFormsTab";
import { CertsTab } from "@/components/teacher/tabs/CertsTab";
import { EventsTab } from "@/components/teacher/tabs/EventsTab";
import { NotesTab } from "@/components/teacher/tabs/NotesTab";
import { LinkedTab } from "@/components/teacher/tabs/LinkedTab";
import { DemographicsTab } from "@/components/teacher/tabs/DemographicsTab";
import { ContactTab } from "@/components/teacher/tabs/ContactTab";
import { CultivationTab } from "@/components/teacher/tabs/CultivationTab";


export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("summary");
  const { toast } = useToast();

  const { data: teacher, isLoading } = useDetailsTeacher(id);

  // Mutation to update educator details
  const updateTeacherDetailsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/educators/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/educators"] });
      queryClient.invalidateQueries({ queryKey: ["/api/educators", id] });
      toast({ title: "Success", description: "Educator details updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update educator", variant: "destructive" });
    },
  });

  const normalizeArray = (v: any): string[] => Array.isArray(v) ? v : (v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []);

  



  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (!teacher) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Teacher not found</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-200 overflow-x-auto">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 px-3 py-3 flex-shrink-0">
                  {(teacher as any)?.full_name || (teacher as any)?.fullName || ''}
                </h1>
              <TabsList className="flex bg-transparent h-auto p-0 w-max">
                <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="demographics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Demographics
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Contact Info
                </TabsTrigger>
                <TabsTrigger value="schools" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Schools
                </TabsTrigger>
                <TabsTrigger value="online-forms" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Online Forms
                </TabsTrigger>
                <TabsTrigger value="cultivation" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Early Cultivation
                </TabsTrigger>
                <TabsTrigger value="certs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Certs
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Events
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Notes
                </TabsTrigger>
                <TabsTrigger value="todo" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  ToDo
                </TabsTrigger>
                <TabsTrigger value="linked" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Emails and Meetings
                </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="p-6">
              <TabsContent value="summary" className="mt-0">
                <SummaryTab teacher={teacher} />
              </TabsContent>

              <TabsContent value="demographics" className="mt-0">
                <DemographicsTab teacher={teacher} onSave={(vals)=>updateTeacherDetailsMutation.mutate(vals)} />
              </TabsContent>

              <TabsContent value="contact" className="mt-0">
                <ContactTab teacher={teacher} onSave={(vals)=>updateTeacherDetailsMutation.mutate(vals)} />
              </TabsContent>

              <TabsContent value="schools" className="mt-0">
                <SchoolsTab educatorId={teacher.id} />
              </TabsContent>

              <TabsContent value="online-forms" className="mt-0">
                <OnlineFormsTab educatorId={teacher.id} />
              </TabsContent>

              <TabsContent value="cultivation" className="mt-0">
                <CultivationTab teacher={teacher} />
              </TabsContent>

              <TabsContent value="certs" className="mt-0">
                <CertsTab educatorId={teacher.id} />
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <EventsTab educatorId={teacher.id} />
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <NotesTab educatorId={teacher.id} />
              </TabsContent>

              <TabsContent value="linked" className="mt-0">
                <LinkedTab teacher={teacher} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
