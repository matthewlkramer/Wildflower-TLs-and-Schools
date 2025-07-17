import { pgTable, serial, text, decimal, boolean, timestamp, integer, uuid, jsonb } from "drizzle-orm/pg-core";
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

// Note: Borrowers table removed - loans now reference schools directly via Airtable school IDs

// Loans - Originated loans
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  loanNumber: text("loan_number").unique().notNull(),
  applicationId: integer("application_id").references(() => loanApplications.id),
  schoolId: text("school_id").notNull(), // References Airtable school ID
  
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

// Report Schedule Configuration
export const reportSchedules = pgTable("report_schedules", {
  id: serial("id").primaryKey(),
  quarter: integer("quarter").notNull(), // 1, 2, 3, 4
  dueMonth: integer("due_month").notNull(), // 1-12 
  dueDay: integer("due_day").notNull(), // 1-31
  reminderWeeksBefore: integer("reminder_weeks_before").notNull().default(4), // weeks before due date to send reminder
  isActive: boolean("is_active").notNull().default(true),
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
  
  // Risk Assessment
  riskRating: text("risk_rating"), // 1-Moderate, 2-Substantial Risk, 3-High Risk, 4-Work-out
  previousRiskRating: text("previous_risk_rating"),
  
  // Compliance and Tracking
  status: text("status").notNull().default("pending"), // pending, submitted, under_review, approved, rejected, overdue
  reviewedBy: text("reviewed_by"),
  reviewDate: timestamp("review_date"),
  reviewNotes: text("review_notes"),
  
  // Reminder tracking
  remindersSent: integer("reminders_sent").notNull().default(0),
  lastReminderSent: timestamp("last_reminder_sent"),
  reminderNotes: text("reminder_notes"),
  
  attachmentPath: text("attachment_path"), // Path to uploaded financial statements
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reminder Log for tracking outreach
export const quarterlyReportReminders = pgTable("quarterly_report_reminders", {
  id: serial("id").primaryKey(),
  quarterlyReportId: integer("quarterly_report_id").references(() => quarterlyReports.id).notNull(),
  reminderType: text("reminder_type").notNull(), // initial, follow_up, final, custom
  sentDate: timestamp("sent_date").notNull(),
  method: text("method").notNull(), // email, phone, in_person
  recipientEmail: text("recipient_email"),
  subject: text("subject"),
  message: text("message"),
  sentBy: text("sent_by").notNull(),
  response: text("response"), // borrower response if any
  responseDate: timestamp("response_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Promissory Note Templates
export const promissoryNoteTemplates = pgTable("promissory_note_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Sunlight Promissory Note", "Founder's Promissory Note"
  templateType: text("template_type").notNull(), // "standard", "founders", "bridge", etc.
  version: integer("version").notNull(), // version number for template history
  content: text("content").notNull(), // full template content with placeholder fields
  variableFields: jsonb("variable_fields"), // array of field definitions
  isActive: boolean("is_active").notNull().default(true),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Template Field Definitions
export const templateFields = pgTable("template_fields", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => promissoryNoteTemplates.id).notNull(),
  fieldName: text("field_name").notNull(), // e.g., "SCHOOL_NAME", "LOAN_AMOUNT"
  fieldLabel: text("field_label").notNull(), // e.g., "School Name", "Loan Amount"
  fieldType: text("field_type").notNull(), // "text", "number", "date", "currency", "address"
  placeholder: text("placeholder").notNull(), // e.g., "[SCHOOL NAME]", "$[ ]"
  isRequired: boolean("is_required").notNull().default(true),
  defaultValue: text("default_value"),
  validationRules: jsonb("validation_rules"), // regex, min/max values, etc.
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated Documents (when templates are filled out)
export const generatedDocuments = pgTable("generated_documents", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id).notNull(),
  templateId: integer("template_id").references(() => promissoryNoteTemplates.id).notNull(),
  documentType: text("document_type").notNull(), // "promissory_note", "security_agreement", etc.
  generatedContent: text("generated_content").notNull(), // filled template
  fieldValues: jsonb("field_values").notNull(), // values used to fill the template
  generatedBy: text("generated_by").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  status: text("status").notNull().default("draft"), // draft, reviewed, signed, executed
  filePath: text("file_path"), // path to generated PDF/DOCX file
});

// Define relationships
export const loanApplicationsRelations = relations(loanApplications, ({ many, one }) => ({
  loans: many(loans),
  documents: many(loanDocuments),
  committeeReviews: many(loanCommitteeReviews),
}));

export const loansRelations = relations(loans, ({ many, one }) => ({
  application: one(loanApplications, { fields: [loans.applicationId], references: [loanApplications.id] }),
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

// Note: Borrower schemas removed - using school data directly from Airtable

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

// Report Schedule schemas
export const insertReportScheduleSchema = createInsertSchema(reportSchedules);
export const selectReportScheduleSchema = createSelectSchema(reportSchedules);
export type InsertReportSchedule = z.infer<typeof insertReportScheduleSchema>;
export type ReportSchedule = z.infer<typeof selectReportScheduleSchema>;

// Quarterly Report schemas
export const insertQuarterlyReportSchema = createInsertSchema(quarterlyReports);
export const selectQuarterlyReportSchema = createSelectSchema(quarterlyReports);
export type InsertQuarterlyReport = z.infer<typeof insertQuarterlyReportSchema>;
export type QuarterlyReport = z.infer<typeof selectQuarterlyReportSchema>;

// Reminder schemas
export const insertQuarterlyReportReminderSchema = createInsertSchema(quarterlyReportReminders);
export const selectQuarterlyReportReminderSchema = createSelectSchema(quarterlyReportReminders);
export type InsertQuarterlyReportReminder = z.infer<typeof insertQuarterlyReportReminderSchema>;
export type QuarterlyReportReminder = z.infer<typeof selectQuarterlyReportReminderSchema>;

// Promissory Note Template schemas
export const insertPromissoryNoteTemplateSchema = createInsertSchema(promissoryNoteTemplates);
export const selectPromissoryNoteTemplateSchema = createSelectSchema(promissoryNoteTemplates);
export type InsertPromissoryNoteTemplate = z.infer<typeof insertPromissoryNoteTemplateSchema>;
export type PromissoryNoteTemplate = z.infer<typeof selectPromissoryNoteTemplateSchema>;

export const insertTemplateFieldSchema = createInsertSchema(templateFields);
export const selectTemplateFieldSchema = createSelectSchema(templateFields);
export type InsertTemplateField = z.infer<typeof insertTemplateFieldSchema>;
export type TemplateField = z.infer<typeof selectTemplateFieldSchema>;

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments);
export const selectGeneratedDocumentSchema = createSelectSchema(generatedDocuments);
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
export type GeneratedDocument = z.infer<typeof selectGeneratedDocumentSchema>;