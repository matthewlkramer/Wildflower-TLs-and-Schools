// Custom business logic routes that overlay on top of generated CRUD routes
// This file contains all the custom endpoints that don't fit the standard CRUD pattern

import type { Express, Request, Response } from "express";
import { storage } from "./generic-storage.generated";
import { loanStorage } from "./loan-storage";
import { cache } from "./cache";
import { logger } from "./logger";
import Stripe from "stripe";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import {
  borrowers,
  loanApplications,
  loans,
  loanPayments,
  loanDocuments,
  loanCovenants,
  loanCommitteeReviews,
  capitalSources,
  quarterlyReports,
  reportSchedules,
  quarterlyReportReminders,
  promissoryNoteTemplates,
  templateFields,
  generatedDocuments
} from "@shared/loan-schema";

// Initialize Stripe for ACH payments
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

// Create validation schemas for loan system
const insertBorrowerSchema = createInsertSchema(borrowers);
const insertLoanApplicationSchema = createInsertSchema(loanApplications);
const insertLoanSchema = createInsertSchema(loans);
const insertLoanPaymentSchema = createInsertSchema(loanPayments);
const insertLoanDocumentSchema = createInsertSchema(loanDocuments);
const insertLoanCovenantSchema = createInsertSchema(loanCovenants);
const insertLoanCommitteeReviewSchema = createInsertSchema(loanCommitteeReviews);
const insertCapitalSourceSchema = createInsertSchema(capitalSources);
const insertQuarterlyReportSchema = createInsertSchema(quarterlyReports);
const insertReportScheduleSchema = createInsertSchema(reportSchedules);
const insertQuarterlyReportReminderSchema = createInsertSchema(quarterlyReportReminders);
const insertPromissoryNoteTemplateSchema = createInsertSchema(promissoryNoteTemplates);
const insertTemplateFieldSchema = createInsertSchema(templateFields);
const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments);

/**
 * Register all custom business logic routes
 * These routes provide functionality beyond standard CRUD operations
 */
export function registerCustomRoutes(app: Express): void {
  console.log('🔧 Registering custom business logic routes...');

  // ============================================
  // CUSTOM QUERY ENDPOINTS
  // ============================================

  // Get schools for a specific user
  app.get("/api/schools/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const schools = await storage.getSchoolsByUserId(userId);
      res.json(schools);
    } catch (error) {
      logger.error("Failed to fetch user schools:", error);
      res.status(500).json({ message: "Failed to fetch user schools" });
    }
  });

  // Get educator associations by educator ID
  app.get("/api/educator-school-associations/educator/:educatorId", async (req, res) => {
    try {
      const educatorId = req.params.educatorId;
      const associations = await storage.getEducatorAssociations(educatorId);
      res.json(associations);
    } catch (error) {
      logger.error("Failed to fetch educator associations:", error);
      res.status(500).json({ message: "Failed to fetch educator associations" });
    }
  });

  // Get school associations by school ID  
  app.get("/api/school-associations/:schoolId", async (req, res) => {
    try {
      const schoolId = req.params.schoolId;
      const associations = await storage.getSchoolAssociations(schoolId);
      res.json(associations);
    } catch (error) {
      logger.error("Failed to fetch school associations:", error);
      res.status(500).json({ message: "Failed to fetch school associations" });
    }
  });

  // Search endpoints
  app.post("/api/schools/search", async (req, res) => {
    try {
      const { query, filters } = req.body;
      const results = await storage.searchSchools(query, filters);
      res.json(results);
    } catch (error) {
      logger.error("School search failed:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // ============================================
  // LOAN SYSTEM ROUTES (Database, not Airtable)
  // ============================================

  // Borrowers
  app.get("/api/borrowers", async (req, res) => {
    try {
      const borrowers = await loanStorage.getAllBorrowers();
      res.json(borrowers);
    } catch (error) {
      logger.error("Failed to fetch borrowers:", error);
      res.status(500).json({ message: "Failed to fetch borrowers" });
    }
  });

  app.get("/api/borrowers/:id", async (req, res) => {
    try {
      const borrower = await loanStorage.getBorrowerById(req.params.id);
      if (!borrower) {
        return res.status(404).json({ message: "Borrower not found" });
      }
      res.json(borrower);
    } catch (error) {
      logger.error("Failed to fetch borrower:", error);
      res.status(500).json({ message: "Failed to fetch borrower" });
    }
  });

  app.post("/api/borrowers", async (req, res) => {
    try {
      const data = insertBorrowerSchema.parse(req.body);
      const borrower = await loanStorage.createBorrower(data);
      res.status(201).json(borrower);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid borrower data", errors: error.errors });
      }
      logger.error("Failed to create borrower:", error);
      res.status(500).json({ message: "Failed to create borrower" });
    }
  });

  // Loan Applications
  app.get("/api/loan-applications", async (req, res) => {
    try {
      const applications = await loanStorage.getAllLoanApplications();
      res.json(applications);
    } catch (error) {
      logger.error("Failed to fetch loan applications:", error);
      res.status(500).json({ message: "Failed to fetch loan applications" });
    }
  });

  app.post("/api/loan-applications", async (req, res) => {
    try {
      const data = insertLoanApplicationSchema.parse(req.body);
      const application = await loanStorage.createLoanApplication(data);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      logger.error("Failed to create loan application:", error);
      res.status(500).json({ message: "Failed to create loan application" });
    }
  });

  app.post("/api/loan-applications/:id/approve", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { approvedAmount, approvedRate, approvedTermMonths } = req.body;
      
      const result = await loanStorage.approveLoanApplication(applicationId, {
        approvedAmount,
        approvedRate,
        approvedTermMonths
      });
      
      res.json(result);
    } catch (error) {
      logger.error("Failed to approve loan application:", error);
      res.status(500).json({ message: "Failed to approve loan application" });
    }
  });

  // Loans
  app.get("/api/loans", async (req, res) => {
    try {
      const loans = await loanStorage.getAllLoans();
      res.json(loans);
    } catch (error) {
      logger.error("Failed to fetch loans:", error);
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  });

  app.get("/api/loans/:id", async (req, res) => {
    try {
      const loan = await loanStorage.getLoanById(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      logger.error("Failed to fetch loan:", error);
      res.status(500).json({ message: "Failed to fetch loan" });
    }
  });

  app.get("/api/loans/school/:schoolId", async (req, res) => {
    try {
      const loans = await loanStorage.getLoansBySchoolId(req.params.schoolId);
      res.json(loans);
    } catch (error) {
      logger.error("Failed to fetch school loans:", error);
      res.status(500).json({ message: "Failed to fetch school loans" });
    }
  });

  app.get("/api/loans/origination-pipeline", async (req, res) => {
    try {
      const pipeline = await loanStorage.getOriginationPipeline();
      res.json(pipeline);
    } catch (error) {
      logger.error("Failed to fetch origination pipeline:", error);
      res.status(500).json({ message: "Failed to fetch origination pipeline" });
    }
  });

  // ACH Payment Setup (Stripe integration)
  app.post("/api/loans/:id/ach-setup", async (req, res) => {
    if (!stripe) {
      return res.status(501).json({ message: "ACH setup is not configured on this deployment" });
    }

    try {
      const loanId = req.params.id;
      const { paymentMethodId } = req.body;

      const loan = await loanStorage.getLoanById(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      // Create or retrieve Stripe customer
      let customerId = loan.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          name: loan.borrowerName,
          email: loan.borrowerEmail,
          metadata: {
            loanId: loan.id,
            schoolId: loan.schoolId || '',
          }
        });
        customerId = customer.id;
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Create ACH mandate
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method: paymentMethodId,
        payment_method_types: ['us_bank_account'],
        confirm: true,
      });

      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Failed to set up ACH mandate" });
      }

      // Update loan with Stripe details
      const updatedLoan = await loanStorage.completeLoanACHSetup(loanId, {
        stripeCustomerId: customerId,
        stripePaymentMethodId: paymentMethodId,
        achMandateActive: true,
      });

      res.json({
        message: "ACH setup completed successfully",
        loan: updatedLoan,
      });
    } catch (error) {
      logger.error("ACH setup failed:", error);
      res.status(500).json({ message: "Failed to set up ACH payments" });
    }
  });

  // Process ACH Payment
  app.post("/api/loans/:loanId/payments/ach", async (req, res) => {
    if (!stripe) {
      return res.status(501).json({ message: "ACH payments are not configured on this deployment" });
    }

    try {
      const { loanId } = req.params;
      const { amount, description } = req.body;

      const loan = await loanStorage.getLoanById(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }

      if (!loan.stripeCustomerId || !loan.stripePaymentMethodId) {
        return res.status(400).json({ message: "ACH is not set up for this loan" });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: loan.stripeCustomerId,
        payment_method: loan.stripePaymentMethodId,
        payment_method_types: ['us_bank_account'],
        confirm: true,
        description: description || `Loan payment for ${loan.loanNumber}`,
        metadata: {
          loanId: loan.id,
          loanNumber: loan.loanNumber,
          schoolId: loan.schoolId || '',
        }
      });

      // Record payment in database
      const payment = await loanStorage.createLoanPayment({
        loanId: loan.id,
        amount,
        paymentDate: new Date().toISOString(),
        paymentMethod: 'ACH',
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      });

      res.json({
        message: "Payment processed successfully",
        payment,
        stripeStatus: paymentIntent.status,
      });
    } catch (error) {
      logger.error("ACH payment failed:", error);
      res.status(500).json({ message: "Failed to process ACH payment" });
    }
  });

  // Loan Payments
  app.get("/api/loans/:loanId/payments", async (req, res) => {
    try {
      const payments = await loanStorage.getLoanPaymentsByLoanId(req.params.loanId);
      res.json(payments);
    } catch (error) {
      logger.error("Failed to fetch loan payments:", error);
      res.status(500).json({ message: "Failed to fetch loan payments" });
    }
  });

  app.post("/api/loans/:loanId/payments", async (req, res) => {
    try {
      const data = insertLoanPaymentSchema.parse({
        ...req.body,
        loanId: req.params.loanId,
      });
      const payment = await loanStorage.createLoanPayment(data);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      }
      logger.error("Failed to create loan payment:", error);
      res.status(500).json({ message: "Failed to create loan payment" });
    }
  });

  // Quarterly Reports
  app.get("/api/reports/quarterly/:year/:quarter", async (req, res) => {
    try {
      const { year, quarter } = req.params;
      const reports = await loanStorage.getQuarterlyReports(parseInt(year), parseInt(quarter));
      res.json(reports);
    } catch (error) {
      logger.error("Failed to fetch quarterly reports:", error);
      res.status(500).json({ message: "Failed to fetch quarterly reports" });
    }
  });

  app.post("/api/reports/quarterly", async (req, res) => {
    try {
      const data = insertQuarterlyReportSchema.parse(req.body);
      const report = await loanStorage.createQuarterlyReport(data);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      logger.error("Failed to create quarterly report:", error);
      res.status(500).json({ message: "Failed to create quarterly report" });
    }
  });

  // ============================================
  // BULK OPERATIONS
  // ============================================

  app.post("/api/schools/bulk-update", async (req, res) => {
    try {
      const { ids, updates } = req.body;
      const results = await storage.bulkUpdateSchools(ids, updates);
      cache.invalidate('schools');
      res.json(results);
    } catch (error) {
      logger.error("Bulk update failed:", error);
      res.status(500).json({ message: "Bulk update failed" });
    }
  });

  app.post("/api/educators/bulk-import", async (req, res) => {
    try {
      const { educators } = req.body;
      const results = await storage.bulkImportEducators(educators);
      cache.invalidate('educators');
      res.json(results);
    } catch (error) {
      logger.error("Bulk import failed:", error);
      res.status(500).json({ message: "Bulk import failed" });
    }
  });

  // ============================================
  // REPORTING & ANALYTICS
  // ============================================

  app.get("/api/analytics/enrollment-trends", async (req, res) => {
    try {
      const trends = await storage.getEnrollmentTrends();
      res.json(trends);
    } catch (error) {
      logger.error("Failed to fetch enrollment trends:", error);
      res.status(500).json({ message: "Failed to fetch enrollment trends" });
    }
  });

  app.get("/api/analytics/school-metrics/:schoolId", async (req, res) => {
    try {
      const metrics = await storage.getSchoolMetrics(req.params.schoolId);
      res.json(metrics);
    } catch (error) {
      logger.error("Failed to fetch school metrics:", error);
      res.status(500).json({ message: "Failed to fetch school metrics" });
    }
  });

  console.log('✅ Custom business logic routes registered successfully');
}