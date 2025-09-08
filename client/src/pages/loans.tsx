/**
 * Main hub for loan management. Contains tabs for a dashboard overview, loan
 * list, applications, payments, documents, and settings. The dashboard tab shows
 * summary metrics pulled from various endpoints. The loans tab can toggle
 * between card and AG‑Grid table view. A dialog allows creating loan
 * applications using a zod‑validated form that posts to `/api/loan-applications`.
 * Utility components track promissory notes and quarterly reports.
 */
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePageTitle } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  FileText,
  Users,
  Settings,
  Calendar,
  LayoutGrid,
  Table,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { 
  type LoanApplication, 
  type Loan, 
  type LoanPayment
} from "@shared/loan-schema";
import QuarterlyReportsTracker from "@/components/QuarterlyReportsTracker";
import PromissoryNoteManager from "@/components/PromissoryNoteManager";
import { ColDef, AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { GridBase } from "@/components/shared/GridBase";
import { useEducatorLookup } from "@/hooks/use-lookup";
import { LinkifyEducatorNames } from "@/components/shared/Linkify";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface LoanSummary {
  totalLoans: number;
  activeLoans: number;
  totalOutstanding: number;
  pendingApplications: number;
}

// Form schema for loan application
const loanApplicationSchema = z.object({
  borrowerName: z.string().min(1, "Borrower name is required"),
  requestedAmount: z.string().min(1, "Requested amount is required"),
  purpose: z.string().min(1, "Purpose is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  businessAddress: z.string().optional(),
  annualRevenue: z.string().optional(),
  existingDebt: z.string().optional(),
});

export default function LoansPage() {
  const { setPageTitle } = usePageTitle();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loansViewType, setLoansViewType] = useState<"cards" | "table">("cards");
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { educatorByName } = useEducatorLookup();

  // Form for loan application
  const form = useForm<z.infer<typeof loanApplicationSchema>>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      borrowerName: "",
      requestedAmount: "",
      purpose: "",
      contactEmail: "",
      contactPhone: "",
      businessAddress: "",
      annualRevenue: "",
      existingDebt: "",
    },
  });

  // Create application mutation
  const createApplicationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loanApplicationSchema>) => {
      const applicationData = {
        ...data,
        applicationNumber: `APP-${Date.now()}`, // Generate unique application number
        requestedAmount: parseFloat(data.requestedAmount),
        annualRevenue: data.annualRevenue ? parseFloat(data.annualRevenue) : undefined,
        existingDebt: data.existingDebt ? parseFloat(data.existingDebt) : undefined,
        status: "submitted",
      };
      return apiRequest("POST", "/api/loan-applications", applicationData);
    },
    onSuccess: () => {
      toast({
        title: "Application Created",
        description: "Loan application has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications"] });
      setShowApplicationDialog(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create loan application.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof loanApplicationSchema>) => {
    createApplicationMutation.mutate(values);
  };

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

  // Borrowers query - using school view endpoint
  const { data: borrowers, isLoading: borrowersLoading } = useQuery<any[]>({
    queryKey: ["/api/borrowers/school-view"],
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

  // Column definitions for loans table
  const loansColumnDefs: ColDef[] = [
    {
      headerName: "Loan #",
      field: "loanNumber",
      width: 120,
      cellRenderer: (params: any) => (
        <Link href={`/loans/${params.data.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {params.value}
        </Link>
      )
    },
    {
      headerName: "School",
      field: "borrower.name",
      width: 200,
      valueGetter: (params: any) => params.data.borrower?.name || `Borrower ID: ${params.data.borrowerId}`
    },
    {
      headerName: "Original Amount",
      field: "principalAmount",
      width: 140,
      valueFormatter: (params: any) => formatCurrency(params.value || 0)
    },
    {
      headerName: "Current Balance",
      field: "currentPrincipalBalance", 
      width: 140,
      valueFormatter: (params: any) => formatCurrency(params.value || 0)
    },
    {
      headerName: "Interest Rate",
      field: "interestRate",
      width: 120,
      valueFormatter: (params: any) => `${(parseFloat(params.value || 0) * 100).toFixed(2)}%`
    },
    {
      headerName: "Origination Date",
      field: "originationDate",
      width: 140,
      valueFormatter: (params: any) => {
        if (!params.value && params.data.issueDate) {
          return new Date(params.data.issueDate).toLocaleDateString();
        }
        return params.value ? new Date(params.value).toLocaleDateString() : 'Not set';
      }
    },
    {
      headerName: "Maturity Date",
      field: "maturityDate",
      width: 140,
      valueFormatter: (params: any) => params.value ? new Date(params.value).toLocaleDateString() : 'Not set'
    },
    {
      headerName: "Status",
      field: "status",
      width: 120,
      cellRenderer: (params: any) => getStatusBadge(params.value)
    },
    {
      headerName: "Actions",
      width: 100,
      cellRenderer: (params: any) => (
        <div className="flex items-center space-x-2">
          <Link href={`/loans/${params.data.id}`}>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )
    }
  ];

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
            <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Loan Application</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="borrowerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Borrower Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="School or organization name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="requestedAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requested Amount *</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="50000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe the purpose of the loan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contact@school.org" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full business address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="annualRevenue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Revenue</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="250000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="existingDebt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Existing Debt</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="25000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowApplicationDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createApplicationMutation.isPending}>
                        {createApplicationMutation.isPending ? "Creating..." : "Create Application"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
              <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Application
                  </Button>
                </DialogTrigger>
              </Dialog>
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
                        Purpose: {application.purpose} | Submitted: {new Date(application.applicationDate).toLocaleDateString()}
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
                  <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
                    <DialogTrigger asChild>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Application
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Active Loans Tab */}
          <TabsContent value="loans" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Active Loans</h2>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={loansViewType === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLoansViewType("cards")}
                    className="h-8 px-3"
                  >
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    Cards
                  </Button>
                  <Button
                    variant={loansViewType === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLoansViewType("table")}
                    className="h-8 px-3"
                  >
                    <Table className="h-4 w-4 mr-1" />
                    Table
                  </Button>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Originate Loan
                </Button>
              </div>
            </div>

            {loansLoading ? (
              <div className="text-center py-8">Loading loans...</div>
            ) : loans && loans.length > 0 ? (
              loansViewType === "cards" ? (
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
                <div className="h-96">
                  <div style={{ height: "100%", width: "100%" }}>
                    <GridBase
                      rowData={loans}
                      columnDefs={loansColumnDefs as any}
                      defaultColDefOverride={{ sortable: true, resizable: true, filter: true }}
                      gridProps={{
                        domLayout: 'normal',
                        animateRows: true,
                        suppressRowClickSelection: true,
                        context: { componentName: 'loans-table' },
                      }}
                    />
                  </div>
                </div>
              )
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
                {borrowers.map((borrower) => {
                  const schoolData = borrower.schoolData;
                  const loans = borrower.loans || [];
                  
                  // Separate loans by status
                  const activeLoans = loans.filter(loan => loan.status === 'active');
                  const paidOffLoans = loans.filter(loan => loan.status === 'paid_off');
                  const distressedLoans = loans.filter(loan => loan.status === 'default' || loan.status === 'charged_off');
                  
                  return (
                    <Card key={borrower.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Link href={`/school/${borrower.schoolId}`} className="text-blue-600 hover:text-blue-800">
                            <CardTitle className="text-lg cursor-pointer hover:underline">
                              {schoolData?.name || borrower.name}
                            </CardTitle>
                          </Link>
                          <div className="flex flex-wrap gap-1">
                            {/* Active loans - green if good standing, red if distressed */}
                            {activeLoans.map((loan) => (
                              <Badge key={loan.id} variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                                {loan.loanNumber}
                              </Badge>
                            ))}
                            {/* Distressed loans - red */}
                            {distressedLoans.map((loan) => (
                              <Badge key={loan.id} variant="destructive" className="bg-red-100 text-red-800">
                                {loan.loanNumber}
                              </Badge>
                            ))}
                            {/* Paid off loans - tan */}
                            {paidOffLoans.map((loan) => (
                              <Badge key={loan.id} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                {loan.loanNumber}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm">
                          {/* Date opened */}
                          {schoolData?.opened && (
                            <div>
                              <span className="text-muted-foreground">Opened: </span>
                              <span className="font-medium">{new Date(schoolData.opened).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {/* Current TLs */}
                          {schoolData?.currentTls && (
                            <div>
                              <span className="text-muted-foreground">Current TLs: </span>
                              <LinkifyEducatorNames names={schoolData.currentTls as any} educatorByName={educatorByName} />
                            </div>
                          )}
                          
                          {/* TL Email addresses */}
                          {(borrower.email1 || borrower.email2 || borrower.email3) && (
                            <div>
                              <span className="text-muted-foreground">TL Emails: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {borrower.email1 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {borrower.email1}
                                  </span>
                                )}
                                {borrower.email2 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {borrower.email2}
                                  </span>
                                )}
                                {borrower.email3 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {borrower.email3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Show message if no school data found */}
                          {!schoolData && (
                            <div className="text-muted-foreground text-xs">
                              School data not found for ID: {borrower.schoolId}
                            </div>
                          )}
                        </div>
          </CardContent>
        </Card>
                  );
                })}
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

//
