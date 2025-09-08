/**
 * Detail screen for a single loan. Fetches `/api/loans/:id` to obtain loan and
 * borrower data, sets the page title to include the loan number, and formats
 * currency/percentage/date values for display. The layout shows a summary card
 * of principal, rate, term, etc. followed by tabs (timeline, payments,
 * documents, related entities) which each render their own components. Status
 * badges are color‑coded based on loan status. Loading and error states are
 * handled before rendering content.
 */
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { usePageTitle } from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  TrendingUp,
  Building2,
  MapPin,
  Users,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3
} from "lucide-react";
import { type Loan, type Borrower } from "@shared/loan-schema";
import { useSchoolLookup } from "@/hooks/use-lookup";
import { LinkifySchoolName } from "@/components/shared/Linkify";

interface LoanWithBorrower extends Loan {
  borrower?: Borrower;
}

export default function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const { setPageTitle } = usePageTitle();

  // Fetch loan details with borrower information
  const { data: loan, isLoading, error } = useQuery<LoanWithBorrower>({
    queryKey: [`/api/loans/${id}`],
    enabled: !!id
  });

  useEffect(() => {
    if (loan) {
      setPageTitle(`Loan ${loan.loanNumber || loan.id || 'Details'}`);
    }
  }, [loan, setPageTitle]);
  const { schoolByName } = useSchoolLookup();

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount);
  };

  const formatPercentage = (rate: number | string) => {
    const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    return `${(numRate * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string | undefined | null) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      'active': { variant: 'default', color: 'text-green-600 bg-green-50 border-green-200' },
      'paid_off': { variant: 'outline', color: 'text-gray-500 bg-gray-50 border-gray-200' },
      'defaulted': { variant: 'destructive', color: 'text-red-600 bg-red-50 border-red-200' },
      'pending': { variant: 'secondary', color: 'text-blue-600 bg-blue-50 border-blue-200' }
    };

    const config = statusConfig[status] || { variant: 'outline' as const, color: 'text-gray-500' };
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getOriginationStatusBadge = (status: string | undefined | null) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { icon: any, color: string, text: string }> = {
      'pending_approval': { icon: Clock, color: 'text-yellow-600', text: 'Pending Approval' },
      'approved': { icon: CheckCircle, color: 'text-green-600', text: 'Approved' },
      'documents_pending': { icon: FileText, color: 'text-blue-600', text: 'Documents Pending' },
      'ach_pending': { icon: CreditCard, color: 'text-blue-600', text: 'ACH Setup Pending' },
      'ready_to_fund': { icon: DollarSign, color: 'text-green-600', text: 'Ready to Fund' },
      'funded': { icon: CheckCircle, color: 'text-green-600', text: 'Funded' }
    };

    const config = statusConfig[status] || { icon: AlertCircle, color: 'text-gray-500', text: status || 'Unknown' };
    const IconComponent = config.icon;
    
    return (
      <div className={`flex items-center gap-2 ${config.color}`}>
        <IconComponent className="h-4 w-4" />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Loan Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The loan you're looking for could not be found.
              </p>
              <Link href="/loans">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Loans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const outstandingBalance = parseFloat(loan.currentPrincipalBalance || '0');
  const principalAmount = parseFloat(loan.principalAmount || '0');
  const paidAmount = principalAmount - outstandingBalance;
  const paymentProgress = principalAmount > 0 ? (paidAmount / principalAmount) * 100 : 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/loans">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Loan {loan.loanNumber}</h1>
            {getStatusBadge(loan.status)}
          </div>
          <p className="text-muted-foreground">
            {loan.borrower?.name || `Borrower ID: ${loan.borrowerId}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Principal Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(principalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(outstandingBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(loan.interestRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">Maturity Date</p>
                <p className="text-lg font-bold">{formatDate(loan.maturityDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Progress</CardTitle>
          <CardDescription>
            {formatCurrency(paidAmount)} of {formatCurrency(principalAmount)} paid ({paymentProgress.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(paymentProgress, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="borrower">Borrower</TabsTrigger>
          <TabsTrigger value="terms">Loan Terms</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="origination">Origination</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Loan Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Loan Number</p>
                    <p className="font-semibold">{loan.loanNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Use of Proceeds</p>
                    <p className="font-semibold">{loan.useOfProceeds || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fiscal Year</p>
                    <p className="font-semibold">{loan.fiscalYear || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Calendar Year</p>
                    <p className="font-semibold">{loan.calendarYear || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                    <p className="font-semibold">{formatDate(loan.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origination Date</p>
                    <p className="font-semibold">{formatDate(loan.originationDate)}</p>
                  </div>
                </div>
                
                {loan.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                      <p className="text-sm bg-gray-50 p-3 rounded">{loan.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Loan Originated</p>
                      <p className="text-xs text-muted-foreground">{formatDate(loan.originationDate)}</p>
                    </div>
                  </div>
                  
                  {loan.fundsDistributedDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">Funds Distributed</p>
                        <p className="text-xs text-muted-foreground">{formatDate(loan.fundsDistributedDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Maturity Date</p>
                      <p className="text-xs text-muted-foreground">{formatDate(loan.maturityDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Borrower Tab */}
        <TabsContent value="borrower" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Borrower Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loan.borrower ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">School Name</p>
                      <LinkifySchoolName name={loan.borrower.name} schoolByName={schoolByName} />
                    </div>
                    
                    {loan.borrower.businessAddress && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="font-semibold">{loan.borrower.businessAddress}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {loan.borrower.state && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">State</p>
                          <p className="font-semibold">{loan.borrower.state}</p>
                        </div>
                      )}
                      
                      {loan.borrower.schoolNumber && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">School Number</p>
                          <p className="font-semibold">{loan.borrower.schoolNumber}</p>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    {(loan.borrower.email1 || loan.borrower.email2 || loan.borrower.email3) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Contact Emails</p>
                        <div className="space-y-1">
                          {loan.borrower.email1 && (
                            <p className="text-sm text-blue-600">{loan.borrower.email1}</p>
                          )}
                          {loan.borrower.email2 && (
                            <p className="text-sm text-blue-600">{loan.borrower.email2}</p>
                          )}
                          {loan.borrower.email3 && (
                            <p className="text-sm text-blue-600">{loan.borrower.email3}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* CDFI Eligibility */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">CDFI Eligibility</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">2015 CDFI Tract</span>
                          <Badge variant={loan.borrower.cdfiTract2015 ? "default" : "secondary"}>
                            {loan.borrower.cdfiTract2015 ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">2020 CDFI Tract</span>
                          <Badge variant={loan.borrower.cdfiTract2020 ? "default" : "secondary"}>
                            {loan.borrower.cdfiTract2020 ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Disadvantaged Community</span>
                          <Badge variant={loan.borrower.disadvantagedCommunity ? "default" : "secondary"}>
                            {loan.borrower.disadvantagedCommunity ? "Yes" : "No"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* School Characteristics */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">School Characteristics</p>
                      <div className="space-y-2">
                        {loan.borrower.isCharter !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Charter School</span>
                            <Badge variant={loan.borrower.isCharter ? "default" : "secondary"}>
                              {loan.borrower.isCharter ? "Yes" : "No"}
                            </Badge>
                          </div>
                        )}
                        {loan.borrower.schoolHighPoverty !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">High Poverty School</span>
                            <Badge variant={loan.borrower.schoolHighPoverty ? "default" : "secondary"}>
                              {loan.borrower.schoolHighPoverty ? "Yes" : "No"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Demographics */}
                    {(loan.borrower.percentAfricanAmerican || loan.borrower.percentLatino || loan.borrower.percentLowIncomeTransition) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Demographics</p>
                        <div className="space-y-2">
                          {loan.borrower.percentAfricanAmerican && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">% African American</span>
                              <span className="font-medium">{loan.borrower.percentAfricanAmerican}%</span>
                            </div>
                          )}
                          {loan.borrower.percentLatino && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">% Latino</span>
                              <span className="font-medium">{loan.borrower.percentLatino}%</span>
                            </div>
                          )}
                          {loan.borrower.percentLowIncomeTransition && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm">% Low Income Transition</span>
                              <span className="font-medium">{loan.borrower.percentLowIncomeTransition}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Borrower information not available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loan Terms Tab */}
        <TabsContent value="terms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Principal Amount</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(principalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                    <p className="text-xl font-bold text-blue-600">{formatPercentage(loan.interestRate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Term (Months)</p>
                    <p className="text-xl font-bold">{loan.termMonths}</p>
                  </div>
                  {loan.monthlyPayment && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
                      <p className="text-xl font-bold text-purple-600">{formatCurrency(loan.monthlyPayment)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(outstandingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(paidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Progress</p>
                    <p className="text-xl font-bold">{paymentProgress.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Track payment history and upcoming payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Payment history will be displayed here</p>
                <p className="text-sm">This feature is coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Origination Tab */}
        <TabsContent value="origination" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Origination Status</CardTitle>
              <CardDescription>Track the loan origination and setup process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">Current Status</span>
                  {getOriginationStatusBadge(loan.originationStatus || 'funded')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Promissory Note */}
                  <div className={`p-4 rounded-lg border ${
                    loan.promissoryNoteSigned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {loan.promissoryNoteSigned ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-medium">Promissory Note</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {loan.promissoryNoteSigned ? (
                        loan.promissoryNoteSignedDate ? 
                          `Signed ${formatDate(loan.promissoryNoteSignedDate)}` :
                          'Signed'
                      ) : 'Pending signature'}
                    </p>
                  </div>

                  {/* ACH Setup */}
                  <div className={`p-4 rounded-lg border ${
                    loan.achSetupCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {loan.achSetupCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-medium">ACH Setup</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {loan.achSetupCompleted ? (
                        loan.achSetupCompletedDate ? 
                          `Completed ${formatDate(loan.achSetupCompletedDate)}` :
                          'Completed'
                      ) : 'Pending setup'}
                    </p>
                  </div>

                  {/* Funds Distribution */}
                  <div className={`p-4 rounded-lg border ${
                    loan.fundsDistributed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {loan.fundsDistributed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-medium">Funds Distributed</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {loan.fundsDistributed ? (
                        loan.fundsDistributedDate ? 
                          `Distributed ${formatDate(loan.fundsDistributedDate)}` :
                          'Distributed'
                      ) : 'Pending distribution'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

//
