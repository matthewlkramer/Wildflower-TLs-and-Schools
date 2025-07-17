import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePageTitle } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  FileText,
  Users,
  Settings,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import { 
  type LoanApplication, 
  type Loan, 
  type LoanPayment,
  type Borrower 
} from "@shared/loan-schema";
import QuarterlyReportsTracker from "@/components/QuarterlyReportsTracker";
import PromissoryNoteManager from "@/components/PromissoryNoteManager";

interface LoanSummary {
  totalLoans: number;
  activeLoans: number;
  totalOutstanding: number;
  pendingApplications: number;
}

export default function LoansPage() {
  const { setPageTitle } = usePageTitle();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    setPageTitle("Loan Management");
  }, [setPageTitle]);

  // Dashboard summary query
  const { data: summary, isLoading: summaryLoading } = useQuery<LoanSummary>({
    queryKey: ["/api/loan-dashboard/summary"],
    enabled: activeTab === "dashboard"
  });

  // Applications query
  const { data: applications, isLoading: applicationsLoading } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications"],
    enabled: activeTab === "applications"
  });

  // Loans query
  const { data: loans, isLoading: loansLoading } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
    enabled: activeTab === "loans"
  });

  // Borrowers query
  const { data: borrowers, isLoading: borrowersLoading } = useQuery<Borrower[]>({
    queryKey: ["/api/borrowers"],
    enabled: activeTab === "borrowers"
  });

  // Upcoming payments query
  const { data: upcomingPayments, isLoading: paymentsLoading } = useQuery<LoanPayment[]>({
    queryKey: ["/api/loan-dashboard/upcoming-payments"],
    enabled: activeTab === "dashboard"
  });

  // Overdue payments query
  const { data: overduePayments, isLoading: overdueLoading } = useQuery<LoanPayment[]>({
    queryKey: ["/api/loan-dashboard/overdue-payments"],
    enabled: activeTab === "dashboard"
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'draft': { variant: 'outline', color: 'text-gray-500' },
      'submitted': { variant: 'secondary', color: 'text-blue-600' },
      'under_review': { variant: 'secondary', color: 'text-yellow-600' },
      'approved': { variant: 'default', color: 'text-green-600' },
      'rejected': { variant: 'destructive', color: 'text-red-600' },
      'active': { variant: 'default', color: 'text-green-600' },
      'paid_off': { variant: 'outline', color: 'text-gray-500' },
      'defaulted': { variant: 'destructive', color: 'text-red-600' },
      'scheduled': { variant: 'secondary', color: 'text-blue-600' },
      'paid': { variant: 'default', color: 'text-green-600' },
      'overdue': { variant: 'destructive', color: 'text-red-600' }
    };

    const config = statusConfig[status] || { variant: 'outline' as const, color: 'text-gray-500' };
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
            <p className="text-muted-foreground">
              Comprehensive loan origination, servicing, and portfolio management
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/loan-origination">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Origination Pipeline
              </Button>
            </Link>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="loans">Active Loans</TabsTrigger>
            <TabsTrigger value="borrowers">Borrowers</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summaryLoading ? "..." : summary?.totalLoans || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Portfolio size
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summaryLoading ? "..." : summary?.activeLoans || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently servicing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summaryLoading ? "..." : formatCurrency(summary?.totalOutstanding || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total principal
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summaryLoading ? "..." : summary?.pendingApplications || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting review
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payments</CardTitle>
                  <CardDescription>Next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentsLoading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : upcomingPayments && upcomingPayments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingPayments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Loan #{payment.loanId}</p>
                            <p className="text-sm text-muted-foreground">
                              Due {new Date(payment.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(payment.principalAmount + payment.interestAmount)}</p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No upcoming payments
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                    Overdue Payments
                  </CardTitle>
                  <CardDescription>Immediate attention required</CardDescription>
                </CardHeader>
                <CardContent>
                  {overdueLoading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : overduePayments && overduePayments.length > 0 ? (
                    <div className="space-y-3">
                      {overduePayments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Loan #{payment.loanId}</p>
                            <p className="text-sm text-red-600">
                              {Math.ceil((Date.now() - new Date(payment.scheduledDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(payment.principalAmount + payment.interestAmount)}</p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No overdue payments
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Loan Applications</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </div>

            {applicationsLoading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : applications && applications.length > 0 ? (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {application.borrowerName} - {formatCurrency(application.requestedAmount)}
                        </CardTitle>
                        {getStatusBadge(application.status)}
                      </div>
                      <CardDescription>
                        Purpose: {application.loanPurpose} | Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No applications yet</h3>
                  <p className="text-muted-foreground">Get started by creating a new loan application.</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Application
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Active Loans Tab */}
          <TabsContent value="loans" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Active Loans</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Originate Loan
              </Button>
            </div>

            {loansLoading ? (
              <div className="text-center py-8">Loading loans...</div>
            ) : loans && loans.length > 0 ? (
              <div className="grid gap-4">
                {loans.map((loan) => (
                  <Link key={loan.id} href={`/loans/${loan.id}`}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-blue-600 hover:text-blue-800">
                            Loan #{loan.loanNumber}
                          </CardTitle>
                          {getStatusBadge(loan.status)}
                        </div>
                        <CardDescription>
                          {loan.borrower?.name || `Borrower ID: ${loan.borrowerId}`} | Balance: {formatCurrency(loan.currentPrincipalBalance || 0)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Original Amount</p>
                            <p className="font-medium">{formatCurrency(loan.principalAmount || 0)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Interest Rate</p>
                            <p className="font-medium">{(parseFloat(loan.interestRate || 0) * 100).toFixed(2)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Origination Date</p>
                            <p className="font-medium">{loan.originationDate ? new Date(loan.originationDate).toLocaleDateString() : (loan.issueDate ? new Date(loan.issueDate).toLocaleDateString() : 'Not set')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No active loans</h3>
                  <p className="text-muted-foreground">Start by originating your first loan.</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Originate Loan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Borrowers Tab */}
          <TabsContent value="borrowers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Borrowers</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Borrower
              </Button>
            </div>

            {borrowersLoading ? (
              <div className="text-center py-8">Loading borrowers...</div>
            ) : borrowers && borrowers.length > 0 ? (
              <div className="grid gap-4">
                {borrowers.map((borrower) => (
                  <Card key={borrower.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{borrower.name}</CardTitle>
                      <CardDescription>
                        {borrower.entityType} | Added: {new Date(borrower.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{borrower.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{borrower.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No borrowers yet</h3>
                  <p className="text-muted-foreground">Add borrowers to start the loan process.</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Borrower
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Portfolio Summary</CardTitle>
                  <CardDescription>Complete loan portfolio overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Schedule</CardTitle>
                  <CardDescription>Upcoming and overdue payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Covenant Compliance</CardTitle>
                  <CardDescription>Track borrower compliance status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Check Compliance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <PromissoryNoteManager />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <QuarterlyReportsTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}