import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, ElementsConsumer } from "@stripe/react-stripe-js";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Initialize Stripe lazily to avoid evaluating at import time for unrelated routes
let _stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise(): Promise<Stripe | null> | null {
  const key = (import.meta as any)?.env?.VITE_STRIPE_PUBLIC_KEY as string | undefined;
  if (!key) return null;
  if (!_stripePromise) {
    _stripePromise = loadStripe(key);
  }
  return _stripePromise;
}

const achSetupSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  routingNumber: z.string().regex(/^\d{9}$/, "Routing number must be 9 digits"),
  accountNumber: z.string().min(4, "Account number is required"),
  accountType: z.enum(["checking", "savings"]),
  authorizeACH: z.boolean().refine(val => val === true, "You must authorize ACH payments"),
  confirmDetails: z.boolean().refine(val => val === true, "You must confirm account details are correct"),
});

type ACHSetupForm = z.infer<typeof achSetupSchema>;

interface LoanDetails {
  id: number;
  loanNumber: string;
  principalAmount: string;
  monthlyPayment: string;
  borrower: {
    entityName: string;
    primaryContactEmail: string;
  };
}

function ACHSetupContent({ loanId }: { loanId: string }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  
  const { data: loan, isLoading } = useQuery<LoanDetails>({
    queryKey: [`/api/loans/${loanId}`],
  });

  const form = useForm<ACHSetupForm>({
    resolver: zodResolver(achSetupSchema),
    defaultValues: {
      accountHolderName: "",
      routingNumber: "",
      accountNumber: "",
      accountType: "checking",
      authorizeACH: false,
      confirmDetails: false,
    },
  });

  const achSetupMutation = useMutation({
    mutationFn: async (data: ACHSetupForm) => {
      if (!stripe) throw new Error("Stripe not loaded");
      
      // Create a payment method with the bank account details
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'us_bank_account',
        us_bank_account: {
          routing_number: data.routingNumber,
          account_number: data.accountNumber,
          account_holder_type: 'company',
          account_type: data.accountType,
        },
      });

      if (error) throw new Error(error.message);

      // Send to our backend to set up the ACH mandate
      return apiRequest("POST", `/api/loans/${loanId}/ach-setup`, {
        paymentMethodId: paymentMethod?.id,
        accountHolderName: data.accountHolderName,
      });
    },
    onSuccess: () => {
      toast({
        title: "ACH Setup Complete",
        description: "Your bank account has been successfully connected for automatic payments.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/loans/${loanId}`] });
      setLocation("/ach-setup-complete");
    },
    onError: (error: any) => {
      toast({
        title: "ACH Setup Failed",
        description: error.message || "Failed to set up ACH payments. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ACHSetupForm) => {
    achSetupMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Loan Not Found</h2>
              <p className="text-muted-foreground">
                The loan you're trying to set up ACH for could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Set Up Automatic Payments</h1>
        <p className="text-muted-foreground">
          Connect your bank account for secure automatic loan payments
        </p>
      </div>

      {/* Loan Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Loan Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Loan Number</p>
              <p className="text-lg font-semibold">{loan.loanNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Principal Amount</p>
              <p className="text-lg font-semibold">${parseFloat(loan.principalAmount).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
              <p className="text-lg font-semibold">${parseFloat(loan.monthlyPayment).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your bank account information is encrypted and securely processed by Stripe. We never store your account details on our servers.
        </AlertDescription>
      </Alert>

      {/* ACH Setup Form */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Account Information</CardTitle>
          <CardDescription>
            Enter your bank account details to set up automatic payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the name on the account" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the business or individual on the bank account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="routingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormDescription>
                        9-digit bank routing number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your bank account number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="authorizeACH"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I authorize ACH payments
                        </FormLabel>
                        <FormDescription>
                          I authorize Wildflower Schools to electronically debit my account for the monthly loan payment amount on the scheduled due date.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmDetails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I confirm the account details are correct
                        </FormLabel>
                        <FormDescription>
                          I have verified that the bank account information provided is accurate and I have authority to authorize payments from this account.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={achSetupMutation.isPending || !stripe}
              >
                {achSetupMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Setting up ACH...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Set Up Automatic Payments
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ACHSetup() {
  const [, params] = useLocation();
  const loanId = params?.split('/')[2]; // Extract loan ID from URL like /ach-setup/123
  const stripePromise = getStripePromise();

  if (!loanId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Invalid Request</h2>
              <p className="text-muted-foreground">
                No loan ID provided for ACH setup.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-2">Payments Not Configured</h2>
              <p className="text-muted-foreground">
                Stripe is not configured. Please set VITE_STRIPE_PUBLIC_KEY to enable ACH setup.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <ACHSetupContent loanId={loanId} />
    </Elements>
  );
}
