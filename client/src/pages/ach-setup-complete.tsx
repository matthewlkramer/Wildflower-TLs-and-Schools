/**
 * Standalone confirmation screen displayed after a borrower finishes entering
 * bank info for ACH payments. It shows a success icon, outlines the three-step
 * follow‑up process (verification deposits, fund distribution, automatic
 * payments), lists payment method details, and offers navigation back to the
 * loan dashboard or main app. No data is fetched; everything is static copy.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Shield, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function ACHSetupComplete() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          ACH Setup Complete!
        </h1>
        <p className="text-muted-foreground">
          Your automatic payment system has been successfully configured
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            What happens next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            <div>
              <p className="font-medium">Verification Process</p>
              <p className="text-sm text-muted-foreground">
                We'll verify your bank account with small test deposits (this may take 1-2 business days)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">2</span>
            </div>
            <div>
              <p className="font-medium">Fund Distribution</p>
              <p className="text-sm text-muted-foreground">
                Once verified, your loan funds will be distributed to your account
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">3</span>
            </div>
            <div>
              <p className="font-medium">Automatic Payments</p>
              <p className="text-sm text-muted-foreground">
                Monthly payments will automatically be deducted from your account on the due date
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="font-semibold">ACH Bank Transfer</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Security</p>
              <p className="font-semibold">Bank-level encryption</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Processing</p>
              <p className="font-semibold">Automatic monthly</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notifications</p>
              <p className="font-semibold">Email confirmations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          You'll receive an email confirmation with your loan details and payment schedule.
          If you have any questions, please contact your loan officer.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/loans">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              View Loan Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}