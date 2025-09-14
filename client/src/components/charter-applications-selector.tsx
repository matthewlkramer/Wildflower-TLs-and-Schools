import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CharterApplication } from "@/types/schema.generated";
import { getStatusColor } from "@/lib/utils";

interface CharterApplicationsSelectorProps {
  charterId: string;
}

export function CharterApplicationsSelector({ charterId }: CharterApplicationsSelectorProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const { data: applications = [], isLoading } = useQuery<CharterApplication[]>({
    queryKey: ["/api/charter-applications/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-applications/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter applications");
      return response.json();
    },
    enabled: !!charterId,
  });

  const selectedApplication = applications.find(app => app.id === selectedApplicationId) || applications[0];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500">No applications found for this charter.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Application Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Charter Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedApplication?.id === application.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedApplicationId(application.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {application.applicationName || "Application"}
                    </h4>
                    <p className="text-sm text-slate-600">
                      Target Open: {application.targetOpen || "Not specified"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {application.status && (
                      <Badge className={`${getStatusColor(application.status)} text-xs`}>
                        {application.status}
                      </Badge>
                    )}
                    {application.submissionDate && (
                      <span className="text-xs text-slate-500">
                        Submitted: {application.submissionDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Application Details */}
      {selectedApplication && (
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Application Name</h3>
                <p className="text-sm text-slate-900">
                  {selectedApplication.applicationName || "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Target Open Date</h3>
                <p className="text-sm text-slate-900">
                  {selectedApplication.targetOpen || "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
                {selectedApplication.status ? (
                  <Badge className={`${getStatusColor(selectedApplication.status)} text-xs`}>
                    {selectedApplication.status}
                  </Badge>
                ) : (
                  <p className="text-sm text-slate-900">Not specified</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Submission Date</h3>
                <p className="text-sm text-slate-900">
                  {selectedApplication.submissionDate || "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}