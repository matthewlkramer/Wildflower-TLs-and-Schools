import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Send, 
  FileText, 
  Settings,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import { format } from "date-fns";

interface QuarterlyReport {
  id: number;
  loanId: number;
  reportYear: number;
  reportQuarter: number;
  dueDate: string;
  submissionDate?: string;
  status: string;
  riskRating?: string;
  remindersSent: number;
  lastReminderSent?: string;
  borrowerName: string;
  loanNumber: string;
}

interface ReportSchedule {
  id: number;
  quarter: number;
  dueMonth: number;
  dueDay: number;
  reminderWeeksBefore: number;
  isActive: boolean;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  submitted: "bg-green-100 text-green-800", 
  under_review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800"
};

const riskColors = {
  "1-Moderate": "bg-green-100 text-green-800",
  "2-Substantial Risk": "bg-yellow-100 text-yellow-800", 
  "3-High Risk": "bg-orange-100 text-orange-800",
  "4-Work-out": "bg-red-100 text-red-800"
};

export default function QuarterlyReportsTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("tracker");
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null);

  // Fetch quarterly reports tracking data
  const { data: reports, isLoading: reportsLoading } = useQuery<QuarterlyReport[]>({
    queryKey: ["/api/quarterly-reports/tracking"],
    enabled: activeTab === "tracker"
  });

  // Fetch overdue reports
  const { data: overdueReports, isLoading: overdueLoading } = useQuery<QuarterlyReport[]>({
    queryKey: ["/api/quarterly-reports/overdue"],
    enabled: activeTab === "overdue"
  });

  // Fetch report schedules
  const { data: schedules, isLoading: schedulesLoading } = useQuery<ReportSchedule[]>({
    queryKey: ["/api/report-schedules"],
    enabled: activeTab === "settings"
  });

  // Send reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: async ({ reportId, reminderType }: { reportId: number; reminderType: string }) => {
      return apiRequest("POST", `/api/quarterly-reports/${reportId}/send-reminder`, {
        reminderType,
        sentBy: "Admin User" // TODO: Get from auth context
      });
    },
    onSuccess: () => {
      toast({
        title: "Reminder Sent",
        description: "Quarterly report reminder has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quarterly-reports/tracking"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reminder.",
        variant: "destructive",
      });
    },
  });

  // Generate reports mutation
  const generateReportsMutation = useMutation({
    mutationFn: async ({ year, quarter }: { year: number; quarter: number }) => {
      return apiRequest("POST", "/api/quarterly-reports/generate", { year, quarter });
    },
    onSuccess: () => {
      toast({
        title: "Reports Generated",
        description: "Quarterly reports have been generated for all active loans.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quarterly-reports/tracking"] });
      setShowGenerateDialog(false);
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to generate quarterly reports.",
        variant: "destructive",
      });
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async (schedule: Partial<ReportSchedule>) => {
      if (schedule.id) {
        return apiRequest("PUT", `/api/report-schedules/${schedule.id}`, schedule);
      } else {
        return apiRequest("POST", "/api/report-schedules", schedule);
      }
    },
    onSuccess: () => {
      toast({
        title: "Schedule Updated",
        description: "Report schedule has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/report-schedules"] });
      setEditingSchedule(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update schedule.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getDueQuarter = (month: number) => {
    if (month === 8) return "Q3";
    if (month === 11) return "Q4"; 
    if (month === 2) return "Q1";
    if (month === 5) return "Q2";
    return `M${month}`;
  };

  const isOverdue = (dueDate: string, submissionDate?: string) => {
    if (submissionDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getStatusDisplay = (report: QuarterlyReport) => {
    const status = isOverdue(report.dueDate, report.submissionDate) ? "overdue" : report.status;
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getRiskRatingDisplay = (riskRating?: string) => {
    if (!riskRating) return null;
    return (
      <Badge className={riskColors[riskRating as keyof typeof riskColors] || "bg-gray-100 text-gray-800"}>
        {riskRating}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quarterly Reports Tracker</h1>
          <p className="text-muted-foreground">Track borrower quarterly report submissions and manage reminders</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Reports
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Quarterly Reports</DialogTitle>
                <DialogDescription>
                  Create quarterly report requirements for all active loans for a specific period.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" placeholder="2025" min="2020" max="2030" />
                  </div>
                  <div>
                    <Label htmlFor="quarter">Quarter</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quarter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Q1</SelectItem>
                        <SelectItem value="2">Q2</SelectItem>
                        <SelectItem value="3">Q3</SelectItem>
                        <SelectItem value="4">Q4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    const year = parseInt((document.getElementById("year") as HTMLInputElement)?.value || "");
                    const quarter = parseInt((document.querySelector('[data-testid="quarter"]') as HTMLInputElement)?.value || "");
                    if (year && quarter) {
                      generateReportsMutation.mutate({ year, quarter });
                    }
                  }}
                  disabled={generateReportsMutation.isPending}
                >
                  Generate Reports
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracker">All Reports</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Reports</TabsTrigger>
          <TabsTrigger value="settings">Schedule Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quarterly Reports Tracker
              </CardTitle>
              <CardDescription>
                Track all quarterly report submissions and send reminders to borrowers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Borrower</TableHead>
                        <TableHead>Loan #</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk Rating</TableHead>
                        <TableHead>Reminders</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports?.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.borrowerName}</TableCell>
                          <TableCell>{report.loanNumber}</TableCell>
                          <TableCell>Q{report.reportQuarter} {report.reportYear}</TableCell>
                          <TableCell>{formatDate(report.dueDate)}</TableCell>
                          <TableCell>{getStatusDisplay(report)}</TableCell>
                          <TableCell>{getRiskRatingDisplay(report.riskRating)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span>{report.remindersSent}</span>
                              {report.lastReminderSent && (
                                <span className="text-xs text-muted-foreground">
                                  (last: {formatDate(report.lastReminderSent)})
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendReminderMutation.mutate({ 
                                  reportId: report.id, 
                                  reminderType: "follow_up" 
                                })}
                                disabled={sendReminderMutation.isPending}
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Overdue Reports
              </CardTitle>
              <CardDescription>
                Reports that are past their due date and require immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overdueLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Borrower</TableHead>
                        <TableHead>Loan #</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Days Overdue</TableHead>
                        <TableHead>Reminders Sent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overdueReports?.map((report) => {
                        const daysOverdue = Math.floor((new Date().getTime() - new Date(report.dueDate).getTime()) / (1000 * 3600 * 24));
                        return (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.borrowerName}</TableCell>
                            <TableCell>{report.loanNumber}</TableCell>
                            <TableCell>Q{report.reportQuarter} {report.reportYear}</TableCell>
                            <TableCell>{formatDate(report.dueDate)}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{daysOverdue} days</Badge>
                            </TableCell>
                            <TableCell>{report.remindersSent}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => sendReminderMutation.mutate({ 
                                  reportId: report.id, 
                                  reminderType: "urgent" 
                                })}
                                disabled={sendReminderMutation.isPending}
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Urgent Reminder
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Report Schedule Settings
              </CardTitle>
              <CardDescription>
                Configure quarterly report due dates and reminder schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedulesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quarter</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Reminder (Weeks Before)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules?.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>Q{schedule.quarter}</TableCell>
                            <TableCell>
                              {getDueQuarter(schedule.dueMonth)} - {schedule.dueMonth}/{schedule.dueDay}
                            </TableCell>
                            <TableCell>{schedule.reminderWeeksBefore} weeks</TableCell>
                            <TableCell>
                              <Badge variant={schedule.isActive ? "default" : "secondary"}>
                                {schedule.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingSchedule(schedule)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Button
                    onClick={() => setEditingSchedule({
                      id: 0,
                      quarter: 1,
                      dueMonth: 2,
                      dueDay: 15,
                      reminderWeeksBefore: 4,
                      isActive: true
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Schedule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Edit Dialog */}
      <Dialog open={!!editingSchedule} onOpenChange={() => setEditingSchedule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSchedule?.id ? "Edit Schedule" : "Add Schedule"}
            </DialogTitle>
          </DialogHeader>
          {editingSchedule && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quarter</Label>
                  <Select
                    value={editingSchedule.quarter.toString()}
                    onValueChange={(value) => setEditingSchedule({
                      ...editingSchedule,
                      quarter: parseInt(value)
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Q1</SelectItem>
                      <SelectItem value="2">Q2</SelectItem>
                      <SelectItem value="3">Q3</SelectItem>
                      <SelectItem value="4">Q4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Month</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={editingSchedule.dueMonth}
                    onChange={(e) => setEditingSchedule({
                      ...editingSchedule,
                      dueMonth: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Day</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={editingSchedule.dueDay}
                    onChange={(e) => setEditingSchedule({
                      ...editingSchedule,
                      dueDay: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Reminder (Weeks Before)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={editingSchedule.reminderWeeksBefore}
                    onChange={(e) => setEditingSchedule({
                      ...editingSchedule,
                      reminderWeeksBefore: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => updateScheduleMutation.mutate(editingSchedule)}
              disabled={updateScheduleMutation.isPending}
            >
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}