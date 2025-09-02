/**
 * Full detail view for a charter organization. Fetches the charter by id and
 * sets the app header to include the charter’s short name. The page is tabbed:
 * summary information in a static grid, plus child tabs for startup process,
 * sites, staff roles, educator associations, applications, contract documents,
 * authorizer contacts, reports, assessments, governance docs, 990 filings,
 * notes/action steps, and emails/meetings. Each tab mounts a specialized table
 * component responsible for its own CRUD operations. No “Add New” options are
 * registered from this page.
 */
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import type { Charter } from "@shared/schema";
import { usePageTitle, useAddNew } from "@/App";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusColor } from "@/lib/utils";
import { CharterSchoolsTable } from "@/components/charter-schools-table";
import { CharterRolesTable } from "@/components/charter-roles-table";
import { CharterEducatorAssociationsTable } from "@/components/charter-educator-associations-table";
import { CharterApplicationsSelector } from "@/components/charter-applications-selector";
import { CharterAuthorizerContactsTable } from "@/components/charter-authorizer-contacts-table";
import { CharterReportsTable } from "@/components/charter-reports-table";
import { CharterAssessmentsTable } from "@/components/charter-assessments-table";
import { CharterGovernanceDocumentsTable } from "@/components/charter-governance-documents-table";
import { Charter990sTable } from "@/components/charter-990s-table";
import { CharterNotesTable } from "@/components/charter-notes-table";
import { CharterActionStepsTable } from "@/components/charter-action-steps-table";

export default function CharterDetail() {
  const { id } = useParams<{ id: string }>();
  const { setPageTitle } = usePageTitle();
  const { setAddNewOptions } = useAddNew();

  const { data: charter, isLoading } = useQuery<Charter>({
    queryKey: ["/api/charters", id],
    queryFn: async () => {
      const response = await fetch(`/api/charters/${id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch charter");
      return response.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (charter) {
      setPageTitle(`Wildflower > ${charter.shortName || charter.fullName || 'Charter'}`);
    }
    setAddNewOptions([]);
  }, [charter, setPageTitle, setAddNewOptions]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!charter) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900">Charter not found</h1>
          <p className="text-slate-600 mt-2">The charter you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="summary" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {charter.shortName || charter.fullName}
            </h1>
            <TabsList className="flex-1 grid grid-cols-6 lg:grid-cols-12 overflow-x-auto">
              <TabsTrigger value="summary" className="text-xs sm:text-sm whitespace-nowrap">Summary</TabsTrigger>
              <TabsTrigger value="startup" className="text-xs sm:text-sm whitespace-nowrap">Startup Process</TabsTrigger>
              <TabsTrigger value="sites" className="text-xs sm:text-sm whitespace-nowrap">Sites</TabsTrigger>
              <TabsTrigger value="staff" className="text-xs sm:text-sm whitespace-nowrap">Staff/Roles</TabsTrigger>
              <TabsTrigger value="applications" className="text-xs sm:text-sm whitespace-nowrap">Application(s)</TabsTrigger>
              <TabsTrigger value="contract" className="text-xs sm:text-sm whitespace-nowrap">Contract</TabsTrigger>
              <TabsTrigger value="authorizer" className="text-xs sm:text-sm whitespace-nowrap">Authorizer</TabsTrigger>
              <TabsTrigger value="reports" className="text-xs sm:text-sm whitespace-nowrap">Reports</TabsTrigger>
              <TabsTrigger value="assessments" className="text-xs sm:text-sm whitespace-nowrap">Assessments</TabsTrigger>
              <TabsTrigger value="docs" className="text-xs sm:text-sm whitespace-nowrap">Docs</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm whitespace-nowrap">Notes/Actions</TabsTrigger>
              <TabsTrigger value="emails" className="text-xs sm:text-sm whitespace-nowrap">Emails/Meetings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Charter Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Short Name</h3>
                  <p className="text-sm text-slate-900">{charter.shortName || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Full Name</h3>
                  <p className="text-sm text-slate-900">{charter.fullName || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Initial Target Community</h3>
                  <p className="text-sm text-slate-900">{charter.initialTargetCommunity || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Projected Open</h3>
                  <p className="text-sm text-slate-900">{charter.projectedOpen || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Initial Target Ages</h3>
                  <div className="flex flex-wrap gap-2">
                    {charter.initialTargetAges && charter.initialTargetAges.length > 0 ? (
                      charter.initialTargetAges.map((age, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {age}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
                  {charter.status ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(charter.status)}`}>
                      {charter.status}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="startup" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Startup Process</h2>
              <p className="text-sm text-slate-500">Startup process information will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="sites" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Sites</h2>
              <CharterSchoolsTable charterId={id!} />
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Educators x Schools</h2>
                <CharterEducatorAssociationsTable charterId={id!} />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Charter Roles</h2>
                <CharterRolesTable charterId={id!} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <CharterApplicationsSelector charterId={id!} />
          </TabsContent>

          <TabsContent value="contract" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract</h2>
              <p className="text-sm text-slate-500">Contract information will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="authorizer" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Contacts</h2>
              <CharterAuthorizerContactsTable charterId={id!} />
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Reports</h2>
              <CharterReportsTable charterId={id!} />
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Assessments</h2>
              <CharterAssessmentsTable charterId={id!} />
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Governance Documents</h2>
                <CharterGovernanceDocumentsTable charterId={id!} />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">990s</h2>
                <Charter990sTable charterId={id!} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
                <CharterNotesTable charterId={id!} />
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Action Steps</h2>
                <CharterActionStepsTable charterId={id!} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Linked Emails & Meetings</h2>
              <p className="text-sm text-slate-500">Linked emails and meetings will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}