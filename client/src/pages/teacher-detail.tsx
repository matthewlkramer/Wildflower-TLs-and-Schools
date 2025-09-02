/**
 * Teacher detail view. Loads a single educator record and presents multiple
 * tabs (summary, schools, forms, certifications, events, notes, linked
 * systems). Each tab delegates to a component under `components/teacher/tabs`.
 * The page supports editing of educator details via React Query mutation and
 * invalidates cached queries on save.
 */
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Teacher, type SSJFilloutForm } from "@shared/schema";
import { EntityCard } from "@/components/shared/EntityCard";
import { DetailGrid } from "@/components/shared/DetailGrid";
import { TableCard } from "@/components/shared/TableCard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { EmailAddress } from "@shared/schema";
import { GridTableCard } from "@/components/shared/GridTableCard";
import type { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Replaced EmailAddressesTable with GridTableCard
import { SummaryTab } from "@/components/teacher/tabs/SummaryTab";
import { SchoolsTab } from "@/components/teacher/tabs/SchoolsTab";
import { OnlineFormsTab } from "@/components/teacher/tabs/OnlineFormsTab";
import { CertsTab } from "@/components/teacher/tabs/CertsTab";
import { EventsTab } from "@/components/teacher/tabs/EventsTab";
import { NotesTab } from "@/components/teacher/tabs/NotesTab";
import { LinkedTab } from "@/components/teacher/tabs/LinkedTab";
// add-new options handled elsewhere; none on this page for now


export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("summary");
  const { toast } = useToast();

  const { data: teacher, isLoading } = useQuery<Teacher>({
    queryKey: ["/api/teachers", id],
    queryFn: async () => {
      const response = await fetch(`/api/teachers/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch teacher");
      return response.json();
    },
  });

  // Mutation to update educator details
  const updateTeacherDetailsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/teachers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teachers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teachers", id] });
      toast({ title: "Success", description: "Educator details updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update educator", variant: "destructive" });
    },
  });

  const normalizeArray = (v: any): string[] => Array.isArray(v) ? v : (v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []);

  // Columns for Email Addresses (GridTableCard)
  const emailColumns: ColDef<EmailAddress>[] = [
    { headerName: 'Email', field: 'email', flex: 2, filter: 'agTextColumnFilter' },
    { headerName: 'Type', field: 'type', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Primary', field: 'isPrimary', flex: 1, filter: 'agTextColumnFilter', valueGetter: p => (p.data?.isPrimary ? 'Yes' : 'No') },
    { headerName: 'Status', field: 'status', flex: 1, filter: 'agTextColumnFilter' },
    { headerName: 'Actions', field: 'actions', width: 160, sortable: false, filter: false, resizable: false,
      cellRenderer: (params: any) => {
        const row: EmailAddress = params.data;
        if (!row) return null;
        const refresh = () => params?.context?.refresh?.();
        const onEdit = async () => {
          const nextEmail = window.prompt('Update email', row.email || '');
          if (nextEmail === null) return;
          const nextType = window.prompt('Update type', row.type || '');
          await apiRequest('PUT', `/api/email-addresses/${row.id}`, { email: nextEmail, type: nextType || undefined });
          queryClient.invalidateQueries({ queryKey: ["/api/email-addresses/educator", teacher.id] });
          refresh();
        };
        const onMakePrimary = async () => {
          await apiRequest('POST', `/api/email-addresses/${row.id}/make-primary`);
          queryClient.invalidateQueries({ queryKey: ["/api/email-addresses/educator", teacher.id] });
          refresh();
        };
        const onInactivate = async () => {
          await apiRequest('POST', `/api/email-addresses/${row.id}/inactivate`);
          queryClient.invalidateQueries({ queryKey: ["/api/email-addresses/educator", teacher.id] });
          refresh();
        };
        const onDelete = async () => {
          if (!window.confirm('Delete this email address?')) return;
          await apiRequest('DELETE', `/api/email-addresses/${row.id}`);
          queryClient.invalidateQueries({ queryKey: ["/api/email-addresses/educator", teacher.id] });
          refresh();
        };
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-50" onClick={onEdit} title="Edit email">
              <Edit3 className="h-3 w-3 text-blue-600" />
            </Button>
            {!row.isPrimary && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-green-50" onClick={onMakePrimary} title="Make primary">
                <UserCheck className="h-3 w-3 text-green-600" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-yellow-50" onClick={onInactivate} title="Inactivate">
              <UserX className="h-3 w-3 text-yellow-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-50" onClick={onDelete} title="Delete">
              <Trash2 className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        );
      }
    }
  ];



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
                  {teacher.fullName || teacher.firstName + ' ' + teacher.lastName}
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
                <TabsTrigger value="linked" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs whitespace-nowrap flex-shrink-0">
                  Linked Email/Meetings
                </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="p-6">
              <TabsContent value="summary" className="mt-0">
                <SummaryTab teacher={teacher} />
              </TabsContent>

              <TabsContent value="demographics" className="mt-0">
                <DetailGrid>
                  <EntityCard
                    title="Gender"
                    columns={2}
                    fields={[
                      { key: 'gender', label: 'Gender', type: 'text', value: teacher?.gender ?? '' },
                      { key: 'genderOther', label: 'Gender (Other)', type: 'text', value: teacher?.genderOther ?? '' },
                      { key: 'pronouns', label: 'Pronouns', type: 'text', value: teacher?.pronouns ?? '' },
                      { key: 'pronounsOther', label: 'Pronouns (Other)', type: 'text', value: teacher?.pronounsOther ?? '' },
                    ]}
                    onSave={(vals) => updateTeacherDetailsMutation.mutate(vals)}
                  />

                  <EntityCard
                    title="Race/Ethnicity"
                    columns={2}
                    fields={[
                      { key: 'raceEthnicity', label: 'Race/Ethnicity', type: 'multiselect', value: Array.isArray(teacher?.raceEthnicity) ? teacher?.raceEthnicity : (teacher?.raceEthnicity ? [teacher.raceEthnicity as unknown as string] : []) },
                      { key: 'raceEthnicityOther', label: 'Race/Ethnicity (Other)', type: 'text', value: teacher?.raceEthnicityOther ?? '' },
                    ]}
                    onSave={(vals) => updateTeacherDetailsMutation.mutate({
                      ...vals,
                      ...(vals.raceEthnicity !== undefined ? { raceEthnicity: normalizeArray(vals.raceEthnicity) } : {}),
                    })}
                  />

                  <EntityCard
                    title="Income"
                    columns={2}
                    fields={[
                      { key: 'householdIncome', label: 'Household Income', type: 'text', value: teacher?.householdIncome ?? '' },
                      { key: 'incomeBackground', label: 'Income Background', type: 'text', value: teacher?.incomeBackground ?? '' },
                    ]}
                    onSave={(vals) => updateTeacherDetailsMutation.mutate(vals)}
                  />

                  <EntityCard
                    title="Languages"
                    columns={2}
                    fields={[
                      { key: 'primaryLanguage', label: 'Primary Language', type: 'multiselect', value: Array.isArray(teacher?.primaryLanguage) ? teacher?.primaryLanguage : (teacher?.primaryLanguage ? [teacher.primaryLanguage as unknown as string] : []) },
                      { key: 'otherLanguages', label: 'Other Languages', type: 'multiselect', value: Array.isArray(teacher?.otherLanguages) ? teacher?.otherLanguages : (teacher?.otherLanguages ? [teacher.otherLanguages as unknown as string] : []) },
                    ]}
                    onSave={(vals) => updateTeacherDetailsMutation.mutate({
                      ...vals,
                      ...(vals.primaryLanguage !== undefined ? { primaryLanguage: normalizeArray(vals.primaryLanguage) } : {}),
                      ...(vals.otherLanguages !== undefined ? { otherLanguages: normalizeArray(vals.otherLanguages) } : {}),
                    })}
                  />

                  <EntityCard
                    title="Educational Attainment"
                    columns={1}
                    fields={[
                      { key: 'educationalAttainment', label: 'Educational Attainment', type: 'text', value: teacher?.educationalAttainment ?? '' },
                    ]}
                    onSave={(vals) => updateTeacherDetailsMutation.mutate(vals)}
                  />
                </DetailGrid>
              </TabsContent>

              <TabsContent value="contact" className="mt-0">
                {/* Tables default to full width */}
                <GridTableCard<EmailAddress>
                  title="Email Addresses"
                  queryKey={["/api/email-addresses/educator", teacher.id]}
                  fetchUrl={`/api/email-addresses/educator/${teacher.id}`}
                  columns={emailColumns}
                  emptyText="No email addresses found for this educator."
                />

                {/* EntityCards use the 2-column DetailGrid */}
                <DetailGrid className="mt-6">
                  {/* Phone numbers */}
                  <EntityCard
                    title="Phone"
                    columns={1}
                    showDivider={false}
                    fields={[
                      { key: 'primaryPhone', label: 'Primary Phone', type: 'text', value: teacher?.primaryPhone ?? '' },
                      { key: 'secondaryPhone', label: 'Secondary Phone', type: 'text', value: teacher?.secondaryPhone ?? '' },
                    ]}
                    onSave={(vals) => updateTeacherDetailsMutation.mutate(vals)}
                  />

                  {/* Address */}
                  <EntityCard
                    title="Address"
                    columns={1}
                    showDivider={false}
                    fields={[
                      { key: 'homeAddress', label: 'Home Address', type: 'textarea', value: teacher?.homeAddress ?? '' },
                    ]}
                    onSave={(vals) => updateTeacherDetailsMutation.mutate(vals)}
                  />
                </DetailGrid>
              </TabsContent>

              <TabsContent value="schools" className="mt-0">
                <SchoolsTab educatorId={teacher.id} />
              </TabsContent>

              <TabsContent value="online-forms" className="mt-0">
                <OnlineFormsTab educatorId={teacher.id} />
              </TabsContent>

              <TabsContent value="cultivation" className="mt-0">
                <div className="space-y-6">
                  {/* Early Cultivation Data */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Early Cultivation Data</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Geographic Interest:</span> {[teacher.targetCity, teacher.targetState].filter(Boolean).join(', ') || '-'}</p>
                        <p><span className="text-slate-600">Primary Language:</span> {teacher.primaryLanguage ? (Array.isArray(teacher.primaryLanguage) ? teacher.primaryLanguage.join(', ') : teacher.primaryLanguage) : '-'}</p>
                        <p><span className="text-slate-600">Source:</span> {teacher.source || '-'}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">SendGrid Template Selected:</span> {teacher.sendgridTemplateSelected || '-'}</p>
                        <p><span className="text-slate-600">SendGrid Send Date:</span> {teacher.sendgridSendDate || '-'}</p>
                        <p><span className="text-slate-600">Routed To:</span> {teacher.routedTo || '-'}</p>
                        <p><span className="text-slate-600">Assigned Partner Override:</span> {teacher.assignedPartnerOverride || '-'}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Personal Email Sent:</span> {teacher.personalEmailSent ? 'Yes' : 'No'}</p>
                        <p><span className="text-slate-600">Personal Email Sent Date:</span> {teacher.personalEmailSentDate || '-'}</p>
                        <p><span className="text-slate-600">Person Responsible for Follow Up:</span> {teacher.personResponsibleForFollowUp || '-'}</p>
                        <p><span className="text-slate-600">One on One Scheduling Status:</span> {teacher.oneOnOneSchedulingStatus || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* First Contact Information */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">First Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">First Contact WF School Employment Status:</span> {teacher.firstContactWFSchoolEmploymentStatus || '-'}</p>
                        <p><span className="text-slate-600">First Contact Notes on Pre-Wildflower Employment:</span> {teacher.firstContactNotesOnPreWildflowerEmployment || '-'}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">First Contact Initial Interest in Governance Model:</span> {teacher.firstContactInitialInterestInGovernanceModel ? (Array.isArray(teacher.firstContactInitialInterestInGovernanceModel) ? teacher.firstContactInitialInterestInGovernanceModel.join(', ') : teacher.firstContactInitialInterestInGovernanceModel) : '-'}</p>
                        <p><span className="text-slate-600">Onboarding Experience:</span> {teacher.onboardingExperience || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
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
