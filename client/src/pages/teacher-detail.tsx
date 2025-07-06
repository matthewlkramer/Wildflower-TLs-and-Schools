import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { type Teacher, type SSJFilloutForm } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";
import { EmailAddressesTable } from "@/components/email-addresses-table";
import { EducatorSchoolAssociationsTable } from "@/components/educator-school-associations-table";
import { SSJFilloutFormsTable } from "@/components/ssj-fillout-forms-table";
import { MontessoriCertificationsTable } from "@/components/montessori-certifications-table";
import { EventAttendanceTable } from "@/components/event-attendance-table";
import { EducatorNotesTable } from "@/components/educator-notes-table";


export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: teacher, isLoading } = useQuery<Teacher>({
    queryKey: ["/api/teachers", id],
    queryFn: async () => {
      const response = await fetch(`/api/teachers/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch teacher");
      return response.json();
    },
  });

  const { data: ssjForms = [] } = useQuery<SSJFilloutForm[]>({
    queryKey: ["/api/ssj-fillout-forms/educator", id],
    queryFn: async () => {
      const response = await fetch(`/api/ssj-fillout-forms/educator/${id}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch SSJ fillout forms");
      return response.json();
    },
    enabled: !!id,
  });

  const computeMostRecentFilloutDate = () => {
    if (!ssjForms || ssjForms.length === 0) return null;
    
    const dates = ssjForms
      .map(form => form.dateSubmitted)
      .filter(Boolean)
      .map(date => new Date(date as string))
      .filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) return null;
    
    const mostRecentDate = new Date(Math.max(...dates.map(date => date.getTime())));
    return mostRecentDate.toLocaleDateString();
  };



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
          <Tabs defaultValue="summary" className="w-full">
            <div className="border-b border-slate-200 overflow-x-auto">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 px-3 py-3 flex-shrink-0">
                  {teacher.fullName}
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Basic Info</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-600">Name:</span> {teacher.fullName}</p>
                        <p><span className="text-slate-600">Current Role:</span> {teacher.currentRole ? (Array.isArray(teacher.currentRole) ? teacher.currentRole.join(', ') : teacher.currentRole) : '-'}</p>
                        <div><span className="text-slate-600">Discovery Status:</span> <Badge className={getStatusColor(teacher.discoveryStatus || '')}>{teacher.discoveryStatus || '-'}</Badge></div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Education & Certs</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-slate-600">Montessori Certified:</span> <Badge className={teacher.montessoriCertified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{teacher.montessoriCertified ? 'Yes' : 'No'}</Badge></div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">School Connection</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-600">Currently Active:</span> {teacher.currentlyActiveAtSchool ? 'Yes' : 'No'}</p>
                        <p><span className="text-slate-600">Current School:</span> {teacher.activeSchool ? (Array.isArray(teacher.activeSchool) ? teacher.activeSchool.join(', ') : teacher.activeSchool) : '-'}</p>
                        <div><span className="text-slate-600">Stage/Status:</span> <Badge className={getStatusColor(teacher.activeSchoolStageStatus ? (Array.isArray(teacher.activeSchoolStageStatus) ? teacher.activeSchoolStageStatus[0] : teacher.activeSchoolStageStatus) : '')}>{teacher.activeSchoolStageStatus ? (Array.isArray(teacher.activeSchoolStageStatus) ? teacher.activeSchoolStageStatus.join(', ') : teacher.activeSchoolStageStatus) : '-'}</Badge></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demographics" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">Pronouns:</span> {teacher.pronouns || '-'}</p>
                      {/* Conditional Pronouns Other */}
                      {teacher.pronouns?.toLowerCase() === 'other' && (
                        <p><span className="text-slate-600">Pronouns (Other):</span> {teacher.pronounsOther || '-'}</p>
                      )}
                      <p><span className="text-slate-600">Gender:</span> {teacher.gender || '-'}</p>
                      {/* Conditional Gender Other */}
                      {teacher.gender?.toLowerCase() === 'other' && (
                        <p><span className="text-slate-600">Gender (Other):</span> {teacher.genderOther || '-'}</p>
                      )}
                      <p><span className="text-slate-600">Race/Ethnicity:</span> {teacher.raceEthnicity ? (Array.isArray(teacher.raceEthnicity) ? teacher.raceEthnicity.join(', ') : teacher.raceEthnicity) : '-'}</p>
                      {/* Conditional Race/Ethnicity Other */}
                      {teacher.raceEthnicity && (Array.isArray(teacher.raceEthnicity) ? teacher.raceEthnicity.some(re => re.toLowerCase().includes('other')) : teacher.raceEthnicity.toLowerCase().includes('other')) && (
                        <p><span className="text-slate-600">Race/Ethnicity (Other):</span> {teacher.raceEthnicityOther || '-'}</p>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">Primary Language:</span> {teacher.primaryLanguage ? (Array.isArray(teacher.primaryLanguage) ? teacher.primaryLanguage.join(', ') : teacher.primaryLanguage) : '-'}</p>
                      <p><span className="text-slate-600">Other Languages:</span> {teacher.otherLanguages ? (Array.isArray(teacher.otherLanguages) ? teacher.otherLanguages.join(', ') : teacher.otherLanguages) : '-'}</p>
                      <p><span className="text-slate-600">Household Income:</span> {teacher.householdIncome || '-'}</p>
                      <p><span className="text-slate-600">Income Background:</span> {teacher.incomeBackground || '-'}</p>
                      <p><span className="text-slate-600">Educational Attainment:</span> {teacher.educationalAttainment || '-'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Primary Phone:</span> {teacher.primaryPhone || '-'}</p>
                        <p><span className="text-slate-600">Secondary Phone:</span> {teacher.secondaryPhone || '-'}</p>
                        <p><span className="text-slate-600">Home Address:</span> {teacher.homeAddress || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Email Addresses</h4>
                      <EmailAddressesTable educatorId={teacher.id} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schools" className="mt-0">
                <div className="space-y-4">
                  <EducatorSchoolAssociationsTable educatorId={teacher.id} />
                </div>
              </TabsContent>

              <TabsContent value="online-forms" className="mt-0">
                <div className="space-y-4">
                  <SSJFilloutFormsTable educatorId={teacher.id} />
                </div>
              </TabsContent>

              <TabsContent value="cultivation" className="mt-0">
                <div className="space-y-6">
                  {/* Early Cultivation Data */}
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Early Cultivation Data</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Date of Most Recent Fillout Form:</span> {computeMostRecentFilloutDate() || '-'}</p>
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
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Montessori Certifications</h4>
                  <MontessoriCertificationsTable educatorId={teacher.id} />
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Event Attendance</h4>
                  <EventAttendanceTable educatorId={teacher.id} />
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Educator Notes</h4>
                  <EducatorNotesTable educatorId={teacher.id} />
                </div>
              </TabsContent>

              <TabsContent value="linked" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Linked Email & Meetings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">Active Holaspirit:</span> {teacher.activeHolaspirit ? 'Yes' : 'No'}</p>
                      <p><span className="text-slate-600">Holaspirit Member ID:</span> {teacher.holaspiritMemberID || '-'}</p>
                      <p><span className="text-slate-600">TC User ID:</span> {teacher.tcUserID || '-'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}