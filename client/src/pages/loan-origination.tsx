/**
 * Loan origination pipeline page. Shows each loan's progress through steps
 * like promissory note signing, ACH setup, and fund distribution, highlighting
 * next required actions.
 */
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, FileText, CreditCard, DollarSign } from "lucide-react";
import { Link } from "wouter";

interface LoanWithProgress {
  id: number;
  loanNumber: string;
  borrowerId: number;
  principalAmount: string;
  interestRate: string;
  originationStatus: string;
  promissoryNoteSigned: boolean;
  achSetupCompleted: boolean;
  fundsDistributed: boolean;
  borrower?: {
    entityName: string;
    primaryContactEmail: string;
  };
}

const getStatusBadge = (status: string) => {
  const variants = {
    pending_approval: { color: "bg-yellow-100 text-yellow-800", label: "Pending Approval" },
    approved: { color: "bg-blue-100 text-blue-800", label: "Approved" },
    documents_pending: { color: "bg-orange-100 text-orange-800", label: "Documents Pending" },
    ach_pending: { color: "bg-purple-100 text-purple-800", label: "ACH Setup Pending" },
    ready_to_fund: { color: "bg-green-100 text-green-800", label: "Ready to Fund" },
    funded: { color: "bg-green-500 text-white", label: "Funded" },
  };
  
  const variant = variants[status as keyof typeof variants] || variants.pending_approval;
  return <Badge className={variant.color}>{variant.label}</Badge>;
};

const getNextSteps = (loan: LoanWithProgress) => {
  const steps = [];
  
  if (!loan.promissoryNoteSigned) {
    steps.push({
      icon: <FileText className="h-4 w-4" />,
      label: "Promissory Note Signature Required",
      action: "Send signature request",
      urgent: true
    });
  }
  
  if (!loan.achSetupCompleted) {
    steps.push({
      icon: <CreditCard className="h-4 w-4" />,
      label: "ACH Setup Required", 
      action: "Send ACH setup link",
      urgent: true
    });
  }
  
  if (loan.promissoryNoteSigned && loan.achSetupCompleted && !loan.fundsDistributed) {
    steps.push({
      icon: <DollarSign className="h-4 w-4" />,
      label: "Ready for Fund Distribution",
      action: "Distribute funds",
      urgent: false
    });
  }
  
  return steps;
};

export default function LoanOrigination() {
  const { data: loans, isLoading } = useQuery<LoanWithProgress[]>({
    queryKey: ["/api/loans/origination-pipeline"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const pendingLoans = loans?.filter(loan => loan.originationStatus !== 'funded') || [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Loan Origination Pipeline</h1>
        <p className="text-muted-foreground">
          Track and manage loans in the origination process
        </p>
      </div>

      <div className="grid gap-6">
        {pendingLoans.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No loans currently in the origination pipeline</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pendingLoans.map((loan) => {
            const nextSteps = getNextSteps(loan);
            
            return (
              <Card key={loan.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {loan.loanNumber}
                        {getStatusBadge(loan.originationStatus)}
                      </CardTitle>
                      <CardDescription>
                        {loan.borrower?.entityName} • ${parseFloat(loan.principalAmount).toLocaleString()} • {(parseFloat(loan.interestRate) * 100).toFixed(2)}%
                      </CardDescription>
                    </div>
                    <Link href={`/loans/${loan.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Progress Steps */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Origination Checklist</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Promissory Note */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                        loan.promissoryNoteSigned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        {loan.promissoryNoteSigned ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium text-sm">Promissory Note</p>
                          <p className="text-xs text-muted-foreground">
                            {loan.promissoryNoteSigned ? 'Signed' : 'Pending signature'}
                          </p>
                        </div>
                      </div>
                      
                      {/* ACH Setup */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                        loan.achSetupCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        {loan.achSetupCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium text-sm">ACH Setup</p>
                          <p className="text-xs text-muted-foreground">
                            {loan.achSetupCompleted ? 'Completed' : 'Pending setup'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Fund Distribution */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                        loan.fundsDistributed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        {loan.fundsDistributed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium text-sm">Funds Distributed</p>
                          <p className="text-xs text-muted-foreground">
                            {loan.fundsDistributed ? 'Complete' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Next Actions */}
                    {nextSteps.length > 0 && (
                      <div className="mt-6">
                        <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          Next Actions Required
                        </h5>
                        <div className="space-y-2">
                          {nextSteps.map((step, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                {step.icon}
                                <span className="text-sm font-medium">{step.label}</span>
                              </div>
                              <Button size="sm" variant={step.urgent ? "default" : "secondary"}>
                                {step.action}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}