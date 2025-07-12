import { pgTable, serial, text, decimal, boolean, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Loan Applications - Initial loan requests
export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").unique().notNull(),
  borrowerName: text("borrower_name").notNull(),
  schoolId: text("school_id"), // Optional link to existing school
  requestedAmount: decimal("requested_amount", { precision: 12, scale: 2 }).notNull(),
  purpose: text("purpose").notNull(),
  applicationDate: timestamp("application_date").defaultNow(),
  status: text("status").notNull().default("submitted"), // submitted, under_review, approved, denied
  assignedUnderwriter: text("assigned_underwriter"),
  
  // Contact Information
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  businessAddress: text("business_address"),
  
  // Basic Financial Info
  annualRevenue: decimal("annual_revenue", { precision: 12, scale: 2 }),
  existingDebt: decimal("existing_debt", { precision: 12, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Borrowers - Can be schools or other entities
export const borrowers = pgTable("borrowers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // school, organization, individual
  schoolId: text("school_id"), // Link to existing school if applicable
  
  // Contact Information
  primaryContactName: text("primary_contact_name"),
  primaryContactEmail: text("primary_contact_email"),
  primaryContactPhone: text("primary_contact_phone"),
  businessAddress: text("business_address"),
  
  // Business Information
  taxId: text("tax_id"),
  incorporationState: text("incorporation_state"),
  businessType: text("business_type"), // LLC, Corporation, Non-profit
  yearEstablished: integer("year_established"),
  
  // Financial Information
  annualRevenue: decimal("annual_revenue", { precision: 12, scale: 2 }),
  totalAssets: decimal("total_assets", { precision: 12, scale: 2 }),
  totalLiabilities: decimal("total_liabilities", { precision: 12, scale: 2 }),
  
  creditScore: integer("credit_score"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loans - Originated loans
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  loanNumber: text("loan_number").unique().notNull(),
  applicationId: integer("application_id").references(() => loanApplications.id),
  borrowerId: integer("borrower_id").references(() => borrowers.id).notNull(),
  
  // Loan Terms
  principalAmount: decimal("principal_amount", { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 4 }).notNull(), // e.g., 0.0750 for 7.5%
  termMonths: integer("term_months").notNull(),
  
  // Interest-only and repayment periods
  interestOnlyMonths: integer("interest_only_months").default(0),
  repaymentStartDate: timestamp("repayment_start_date"),
  
  // Payment Information
  monthlyPayment: decimal("monthly_payment", { precision: 12, scale: 2 }),
  paymentDueDay: integer("payment_due_day").default(1), // Day of month payment is due
  
  // Loan Status
  status: text("status").notNull().default("pending"), // pending, active, paid_off, default, charged_off
  originationDate: timestamp("origination_date"),
  maturityDate: timestamp("maturity_date"),
  
  // Current Balances
  currentPrincipalBalance: decimal("current_principal_balance", { precision: 12, scale: 2 }),
  totalInterestPaid: decimal("total_interest_paid", { precision: 12, scale: 2 }).default("0"),
  totalFeesPaid: decimal("total_fees_paid", { precision: 12, scale: 2 }).default("0"),
  
  // Loan Officer/Servicer
  loanOfficer: text("loan_officer"),
  servicer: text("servicer"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loan Payments - Payment history and schedules
export const loanPayments = pgTable("loan_payments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id).notNull(),
  
  // Payment Details
  paymentNumber: integer("payment_number").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  paymentDate: timestamp("payment_date"),
  
  // Amounts
  scheduledAmount: decimal("scheduled_amount", { precision: 12, scale: 2 }).notNull(),
  actualAmount: decimal("actual_amount", { precision: 12, scale: 2 }),
  principalAmount: decimal("principal_amount", { precision: 12, scale: 2 }),
  interestAmount: decimal("interest_amount", { precision: 12, scale: 2 }),
  feesAmount: decimal("fees_amount", { precision: 12, scale: 2 }).default("0"),
  
  // Status
  status: text("status").notNull().default("scheduled"), // scheduled, paid, late, missed
  paymentMethod: text("payment_method"), // ach, wire, check, online
  
  // Late payment tracking
  daysLate: integer("days_late").default(0),
  lateFee: decimal("late_fee", { precision: 12, scale: 2 }).default("0"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loan Documents - All documentation
export const loanDocuments = pgTable("loan_documents", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id),
  applicationId: integer("application_id").references(() => loanApplications.id),
  
  documentType: text("document_type").notNull(), // application, financial_statement, credit_report, loan_agreement, etc.
  documentName: text("document_name").notNull(),
  documentPath: text("document_path"), // File path or URL
  documentSize: integer("document_size"), // File size in bytes
  
  uploadedBy: text("uploaded_by"),
  uploadDate: timestamp("upload_date").defaultNow(),
  
  // Document status
  status: text("status").notNull().default("pending"), // pending, approved, rejected, requires_update
  reviewedBy: text("reviewed_by"),
  reviewDate: timestamp("review_date"),
  reviewNotes: text("review_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loan Covenants - Compliance tracking
export const loanCovenants = pgTable("loan_covenants", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id).notNull(),
  
  covenantType: text("covenant_type").notNull(), // financial, operational, reporting
  description: text("description").notNull(),
  
  // Financial covenant specifics
  metricType: text("metric_type"), // debt_to_equity, current_ratio, debt_service_coverage, etc.
  thresholdValue: decimal("threshold_value", { precision: 12, scale: 4 }),
  comparisonOperator: text("comparison_operator"), // >=, <=, =, >, <
  
  // Reporting requirements
  reportingFrequency: text("reporting_frequency"), // monthly, quarterly, annually
  nextReportingDate: timestamp("next_reporting_date"),
  
  // Compliance status
  status: text("status").notNull().default("compliant"), // compliant, violation, waived, cured
  lastTestDate: timestamp("last_test_date"),
  lastTestValue: decimal("last_test_value", { precision: 12, scale: 4 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loan Committee Reviews - Approval workflow
export const loanCommitteeReviews = pgTable("loan_committee_reviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => loanApplications.id).notNull(),
  
  // Review Details
  reviewDate: timestamp("review_date").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  reviewerRole: text("reviewer_role"), // committee_chair, member, credit_analyst
  
  // Recommendation
  recommendation: text("recommendation").notNull(), // approve, deny, conditional_approval, request_more_info
  recommendedAmount: decimal("recommended_amount", { precision: 12, scale: 2 }),
  recommendedRate: decimal("recommended_rate", { precision: 5, scale: 4 }),
  recommendedTermMonths: integer("recommended_term_months"),
  
  // Comments and conditions
  comments: text("comments"),
  conditions: text("conditions"), // Approval conditions if any
  
  // Final committee decision
  finalDecision: text("final_decision"), // approved, denied, deferred
  decisionDate: timestamp("decision_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Capital Sources - Available funding
export const capitalSources = pgTable("capital_sources", {
  id: serial("id").primaryKey(),
  sourceName: text("source_name").notNull(),
  sourceType: text("source_type").notNull(), // investor, bank_line, internal_funds
  
  // Available amounts
  totalCommitment: decimal("total_commitment", { precision: 12, scale: 2 }).notNull(),
  availableAmount: decimal("available_amount", { precision: 12, scale: 2 }).notNull(),
  utilizedAmount: decimal("utilized_amount", { precision: 12, scale: 2 }).default("0"),
  
  // Terms
  costOfCapital: decimal("cost_of_capital", { precision: 5, scale: 4 }), // Interest rate we pay
  
  // Contact Information
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  
  // Status
  status: text("status").notNull().default("active"), // active, expired, suspended
  expirationDate: timestamp("expiration_date"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quarterly Reports - From borrowers
export const quarterlyReports = pgTable("quarterly_reports", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id).notNull(),
  
  // Report Period
  reportYear: integer("report_year").notNull(),
  reportQuarter: integer("report_quarter").notNull(), // 1, 2, 3, 4
  dueDate: timestamp("due_date").notNull(),
  submissionDate: timestamp("submission_date"),
  
  // Financial Data
  revenue: decimal("revenue", { precision: 12, scale: 2 }),
  expenses: decimal("expenses", { precision: 12, scale: 2 }),
  netIncome: decimal("net_income", { precision: 12, scale: 2 }),
  
  totalAssets: decimal("total_assets", { precision: 12, scale: 2 }),
  totalLiabilities: decimal("total_liabilities", { precision: 12, scale: 2 }),
  equity: decimal("equity", { precision: 12, scale: 2 }),
  
  cashFlow: decimal("cash_flow", { precision: 12, scale: 2 }),
  
  // Operational Metrics (for schools)
  enrollment: integer("enrollment"),
  teacherCount: integer("teacher_count"),
  
  // Compliance
  status: text("status").notNull().default("pending"), // pending, submitted, under_review, approved, rejected
  reviewedBy: text("reviewed_by"),
  reviewDate: timestamp("review_date"),
  reviewNotes: text("review_notes"),
  
  attachmentPath: text("attachment_path"), // Path to uploaded financial statements
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relationships
export const loanApplicationsRelations = relations(loanApplications, ({ many, one }) => ({
  loans: many(loans),
  documents: many(loanDocuments),
  committeeReviews: many(loanCommitteeReviews),
}));

export const borrowersRelations = relations(borrowers, ({ many }) => ({
  loans: many(loans),
}));

export const loansRelations = relations(loans, ({ many, one }) => ({
  application: one(loanApplications, { fields: [loans.applicationId], references: [loanApplications.id] }),
  borrower: one(borrowers, { fields: [loans.borrowerId], references: [borrowers.id] }),
  payments: many(loanPayments),
  documents: many(loanDocuments),
  covenants: many(loanCovenants),
  quarterlyReports: many(quarterlyReports),
}));

export const loanPaymentsRelations = relations(loanPayments, ({ one }) => ({
  loan: one(loans, { fields: [loanPayments.loanId], references: [loans.id] }),
}));

export const loanDocumentsRelations = relations(loanDocuments, ({ one }) => ({
  loan: one(loans, { fields: [loanDocuments.loanId], references: [loans.id] }),
  application: one(loanApplications, { fields: [loanDocuments.applicationId], references: [loanApplications.id] }),
}));

export const loanCovenantsRelations = relations(loanCovenants, ({ one }) => ({
  loan: one(loans, { fields: [loanCovenants.loanId], references: [loans.id] }),
}));

export const loanCommitteeReviewsRelations = relations(loanCommitteeReviews, ({ one }) => ({
  application: one(loanApplications, { fields: [loanCommitteeReviews.applicationId], references: [loanApplications.id] }),
}));

export const quarterlyReportsRelations = relations(quarterlyReports, ({ one }) => ({
  loan: one(loans, { fields: [quarterlyReports.loanId], references: [loans.id] }),
}));

// Zod schemas for validation
export const insertLoanApplicationSchema = createInsertSchema(loanApplications);
export const selectLoanApplicationSchema = createSelectSchema(loanApplications);
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type LoanApplication = z.infer<typeof selectLoanApplicationSchema>;

export const insertBorrowerSchema = createInsertSchema(borrowers);
export const selectBorrowerSchema = createSelectSchema(borrowers);
export type InsertBorrower = z.infer<typeof insertBorrowerSchema>;
export type Borrower = z.infer<typeof selectBorrowerSchema>;

export const insertLoanSchema = createInsertSchema(loans);
export const selectLoanSchema = createSelectSchema(loans);
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = z.infer<typeof selectLoanSchema>;

export const insertLoanPaymentSchema = createInsertSchema(loanPayments);
export const selectLoanPaymentSchema = createSelectSchema(loanPayments);
export type InsertLoanPayment = z.infer<typeof insertLoanPaymentSchema>;
export type LoanPayment = z.infer<typeof selectLoanPaymentSchema>;

export const insertLoanDocumentSchema = createInsertSchema(loanDocuments);
export const selectLoanDocumentSchema = createSelectSchema(loanDocuments);
export type InsertLoanDocument = z.infer<typeof insertLoanDocumentSchema>;
export type LoanDocument = z.infer<typeof selectLoanDocumentSchema>;

export const insertLoanCovenantSchema = createInsertSchema(loanCovenants);
export const selectLoanCovenantSchema = createSelectSchema(loanCovenants);
export type InsertLoanCovenant = z.infer<typeof insertLoanCovenantSchema>;
export type LoanCovenant = z.infer<typeof selectLoanCovenantSchema>;

export const insertLoanCommitteeReviewSchema = createInsertSchema(loanCommitteeReviews);
export const selectLoanCommitteeReviewSchema = createSelectSchema(loanCommitteeReviews);
export type InsertLoanCommitteeReview = z.infer<typeof insertLoanCommitteeReviewSchema>;
export type LoanCommitteeReview = z.infer<typeof selectLoanCommitteeReviewSchema>;

export const insertCapitalSourceSchema = createInsertSchema(capitalSources);
export const selectCapitalSourceSchema = createSelectSchema(capitalSources);
export type InsertCapitalSource = z.infer<typeof insertCapitalSourceSchema>;
export type CapitalSource = z.infer<typeof selectCapitalSourceSchema>;

export const insertQuarterlyReportSchema = createInsertSchema(quarterlyReports);
export const selectQuarterlyReportSchema = createSelectSchema(quarterlyReports);
export type InsertQuarterlyReport = z.infer<typeof insertQuarterlyReportSchema>;
export type QuarterlyReport = z.infer<typeof selectQuarterlyReportSchema>;