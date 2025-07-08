import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CharterApplication } from "@shared/schema";

interface CharterApplicationsSelectorProps {
  charterId: string;
}

export function CharterApplicationsSelector({ charterId }: CharterApplicationsSelectorProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");

  const { data: applications = [], isLoading } = useQuery<CharterApplication[]>({
    queryKey: ["/api/charter-applications/charter", charterId],
    queryFn: async () => {
      const response = await fetch(`/api/charter-applications/charter/${charterId}`, { 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch charter applications");
      return response.json();
    },
  });

  // Auto-select the most recent application
  const selectedApplication = applications.find(app => app.id === selectedApplicationId) || applications[0];

  return (
    <div className="space-y-6">
      {/* Application Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Charter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedApplicationId || applications[0]?.id || ""} 
            onValueChange={setSelectedApplicationId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an application..." />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.applicationName || `Application ${app.id}`} 
                  {app.submissionDate && ` (${app.submissionDate})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Selected Application Details */}
      {selectedApplication && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Application Name</h3>
                <p className="text-sm text-slate-900">{selectedApplication.applicationName || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Target Open Date</h3>
                <p className="text-sm text-slate-900">{selectedApplication.targetOpen || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
                <p className="text-sm text-slate-900">{selectedApplication.status || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Submission Date</h3>
                <p className="text-sm text-slate-900">{selectedApplication.submissionDate || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}