import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { Link } from "wouter";
import { type Teacher } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/teachers">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teachers
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-wildflower-blue rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{teacher.fullName}</h2>
                  <p className="text-sm text-slate-600">{teacher.currentRole ? (Array.isArray(teacher.currentRole) ? teacher.currentRole.join(', ') : teacher.currentRole) : 'No role specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="summary" className="w-full">
            <div className="border-b border-slate-200">
              <TabsList className="grid w-full grid-cols-9 bg-transparent h-auto p-0">
                <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="demographics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Demographics
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Contact Info
                </TabsTrigger>
                <TabsTrigger value="schools" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Schools
                </TabsTrigger>
                <TabsTrigger value="cultivation" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Early Cultivation
                </TabsTrigger>
                <TabsTrigger value="certs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Certs
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Events
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Notes
                </TabsTrigger>
                <TabsTrigger value="linked" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-wildflower-blue data-[state=active]:text-wildflower-blue rounded-none py-3 px-3 text-xs">
                  Linked Email/Meetings
                </TabsTrigger>
              </TabsList>
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
                        <p><span className="text-slate-600">Discovery Status:</span> <Badge className={getStatusColor(teacher.discoveryStatus || '')}>{teacher.discoveryStatus || '-'}</Badge></p>
                        <p><span className="text-slate-600">Individual Type:</span> {teacher.individualType || '-'}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Education & Certs</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-600">Educational Attainment:</span> {teacher.educationalAttainment || '-'}</p>
                        <p><span className="text-slate-600">Montessori Certified:</span> <Badge className={teacher.montessoriCertified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{teacher.montessoriCertified ? 'Yes' : 'No'}</Badge></p>
                        <p><span className="text-slate-600">Certification Levels:</span> {teacher.certificationLevels ? (Array.isArray(teacher.certificationLevels) ? teacher.certificationLevels.join(', ') : teacher.certificationLevels) : '-'}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">School Connection</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-slate-600">Currently Active:</span> {teacher.currentlyActiveAtSchool ? 'Yes' : 'No'}</p>
                        <p><span className="text-slate-600">Current School:</span> {teacher.currentlyActiveSchool ? (Array.isArray(teacher.currentlyActiveSchool) ? teacher.currentlyActiveSchool.join(', ') : teacher.currentlyActiveSchool) : '-'}</p>
                        <p><span className="text-slate-600">Stage/Status:</span> <Badge className={getStatusColor(teacher.startupStageForActiveSchool ? (Array.isArray(teacher.startupStageForActiveSchool) ? teacher.startupStageForActiveSchool[0] : teacher.startupStageForActiveSchool) : '')}>{teacher.startupStageForActiveSchool ? (Array.isArray(teacher.startupStageForActiveSchool) ? teacher.startupStageForActiveSchool.join(', ') : teacher.startupStageForActiveSchool) : '-'}</Badge></p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demographics" className="mt-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">First Name:</span> {teacher.firstName || '-'}</p>
                        <p><span className="text-slate-600">Last Name:</span> {teacher.lastName || '-'}</p>
                        <p><span className="text-slate-600">Middle Name:</span> {teacher.middleName || '-'}</p>
                        <p><span className="text-slate-600">Nickname:</span> {teacher.nickname || '-'}</p>
                        <p><span className="text-slate-600">Pronouns:</span> {teacher.pronouns || '-'}</p>
                        <p><span className="text-slate-600">Gender:</span> {teacher.gender || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Demographics</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Race/Ethnicity:</span> {teacher.raceEthnicity ? (Array.isArray(teacher.raceEthnicity) ? teacher.raceEthnicity.join(', ') : teacher.raceEthnicity) : '-'}</p>
                        <p><span className="text-slate-600">Primary Language:</span> {teacher.primaryLanguage ? (Array.isArray(teacher.primaryLanguage) ? teacher.primaryLanguage.join(', ') : teacher.primaryLanguage) : '-'}</p>
                        <p><span className="text-slate-600">Other Languages:</span> {teacher.otherLanguages ? (Array.isArray(teacher.otherLanguages) ? teacher.otherLanguages.join(', ') : teacher.otherLanguages) : '-'}</p>
                        <p><span className="text-slate-600">Household Income:</span> {teacher.householdIncome || '-'}</p>
                        <p><span className="text-slate-600">Income Background:</span> {teacher.incomeBackground || '-'}</p>
                      </div>
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
                        <p><span className="text-slate-600">Target City:</span> {teacher.targetCity || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Partner Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600">Assigned Partner:</span> {teacher.assignedPartner ? (Array.isArray(teacher.assignedPartner) ? teacher.assignedPartner.join(', ') : teacher.assignedPartner) : '-'}</p>
                        <p><span className="text-slate-600">Partner Email:</span> {teacher.assignedPartnerEmail ? (Array.isArray(teacher.assignedPartnerEmail) ? teacher.assignedPartnerEmail.join(', ') : teacher.assignedPartnerEmail) : '-'}</p>
                        <p><span className="text-slate-600">Also a Partner:</span> {teacher.alsoAPartner ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schools" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">School Associations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">All Schools:</span> {teacher.allSchools ? (Array.isArray(teacher.allSchools) ? teacher.allSchools.join(', ') : teacher.allSchools) : '-'}</p>
                      <p><span className="text-slate-600">School Statuses:</span> {teacher.schoolStatuses ? (Array.isArray(teacher.schoolStatuses) ? teacher.schoolStatuses.join(', ') : teacher.schoolStatuses) : '-'}</p>
                      <p><span className="text-slate-600">On School Board:</span> {teacher.onSchoolBoard || '-'}</p>
                      <p><span className="text-slate-600">Ever a TL in Open School:</span> {teacher.everATLInAnOpenSchool ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cultivation" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Early Cultivation & First Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">First Contact WF School Employment Status:</span> {teacher.firstContactWFSchoolEmploymentStatus || '-'}</p>
                      <p><span className="text-slate-600">First Contact Notes on Pre-Wildflower Employment:</span> {teacher.firstContactNotesOnPreWildflowerEmployment || '-'}</p>
                      <p><span className="text-slate-600">First Contact Initial Interest in Governance Model:</span> {teacher.firstContactInitialInterestInGovernanceModel ? (Array.isArray(teacher.firstContactInitialInterestInGovernanceModel) ? teacher.firstContactInitialInterestInGovernanceModel.join(', ') : teacher.firstContactInitialInterestInGovernanceModel) : '-'}</p>
                      <p><span className="text-slate-600">Onboarding Experience:</span> {teacher.onboardingExperience || '-'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="certs" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Certifications & Training</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">Certifier:</span> {teacher.certifier ? (Array.isArray(teacher.certifier) ? teacher.certifier.join(', ') : teacher.certifier) : '-'}</p>
                      <p><span className="text-slate-600">Montessori Lead Guide Trainings:</span> {teacher.montessoriLeadGuideTrainings ? (Array.isArray(teacher.montessoriLeadGuideTrainings) ? teacher.montessoriLeadGuideTrainings.join(', ') : teacher.montessoriLeadGuideTrainings) : '-'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Events & Activities</h4>
                  <div className="text-center py-8 text-slate-500">
                    Event information will be displayed here
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Notes & Actions</h4>
                  <div className="text-center py-8 text-slate-500">
                    Notes and action items will be displayed here
                  </div>
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