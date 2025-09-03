
// ======================================
// LOAN MANAGEMENT SYSTEM TABLES
// ======================================

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
  
  // Geographic and school tracking
  schoolNumber: integer("school_number"),
  state: text("state"),
  censusTract: text("census_tract"),
  
  // CDFI eligibility tracking
  cdfiTract2015: boolean("cdfi_tract_2015"),
  cdfiTract2020: boolean("cdfi_tract_2020"),
  schoolCdfiTract: boolean("school_cdfi_tract"),
  disadvantagedCommunity: boolean("disadvantaged_community"),
  climateDisadvantaged: boolean("climate_disadvantaged"),
  
  // Charter and school characteristics
  isCharter: boolean("is_charter"),
  currentTeacherMentoring: boolean("current_teacher_mentoring"),
  anyTeacherMentoring: boolean("any_teacher_mentoring"),
  childcareDesert: boolean("childcare_desert"),
  
  // Demographics (percentages)
  percentLowIncomeTransition: decimal("percent_low_income_transition", { precision: 5, scale: 2 }),
  percentAfricanAmerican: decimal("percent_african_american", { precision: 5, scale: 2 }),
  percentLatino: decimal("percent_latino", { precision: 5, scale: 2 }),
  
  // School characteristics
  schoolHighPoverty: boolean("school_high_poverty"),
  schoolHighPotential: boolean("school_high_potential"),
  bipocTeacherLeader: boolean("bipoc_teacher_leader"),
  lowIncomeTeacherLeader: boolean("low_income_teacher_leader"),
  womanTeacherLeader: boolean("woman_teacher_leader"),
  
  // Contact information
  email1: text("email_1"),
  email2: text("email_2"),
  email3: text("email_3"),
  
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
  
  // CSV tracking fields
  fiscalYear: integer("fiscal_year"),
  calendarYear: integer("calendar_year"),
  issueDate: timestamp("issue_date"),
  useOfProceeds: text("use_of_proceeds"),
  notes: text("notes"),
  
  // Current Balances
  currentPrincipalBalance: decimal("current_principal_balance", { precision: 12, scale: 2 }),
  totalInterestPaid: decimal("total_interest_paid", { precision: 12, scale: 2 }).default("0"),
  totalFeesPaid: decimal("total_fees_paid", { precision: 12, scale: 2 }).default("0"),
  
  // Loan Officer/Servicer
  loanOfficer: text("loan_officer"),
  servicer: text("servicer"),
  
  // Origination Workflow Tracking
  originationStatus: text("origination_status").default("pending_approval"), // pending_approval, approved, documents_pending, ach_pending, ready_to_fund, funded
  promissoryNoteSigned: boolean("promissory_note_signed").default(false),
  promissoryNoteSignedDate: timestamp("promissory_note_signed_date"),
  achSetupCompleted: boolean("ach_setup_completed").default(false),
  achSetupCompletedDate: timestamp("ach_setup_completed_date"),
  fundsDistributed: boolean("funds_distributed").default(false),
  fundsDistributedDate: timestamp("funds_distributed_date"),
  
  // Stripe Integration
  stripeConnectAccountId: text("stripe_connect_account_id"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeBankAccountId: text("stripe_bank_account_id"),
  achMandateAccepted: boolean("ach_mandate_accepted").default(false),
  achMandateAcceptedDate: timestamp("ach_mandate_accepted_date"),
  
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
  status: text("status").notNull().default("active"), // active, inactive, expired
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quarterly Reports - For investors and regulators
export const quarterlyReports = pgTable("quarterly_reports", {
  id: serial("id").primaryKey(),
  
  // Report Period
  reportYear: integer("report_year").notNull(),
  reportQuarter: integer("report_quarter").notNull(), // 1, 2, 3, 4
  
  // Portfolio Summary
  totalLoansOriginated: integer("total_loans_originated").notNull(),
  totalPrincipalOriginated: decimal("total_principal_originated", { precision: 12, scale: 2 }).notNull(),
  totalActiveLoans: integer("total_active_loans").notNull(),
  totalOutstandingPrincipal: decimal("total_outstanding_principal", { precision: 12, scale: 2 }).notNull(),
  
  // Performance Metrics
  defaultRate: decimal("default_rate", { precision: 5, scale: 4 }),
  averageInterestRate: decimal("average_interest_rate", { precision: 5, scale: 4 }),
  netChargeOffs: decimal("net_charge_offs", { precision: 12, scale: 2 }).default("0"),
  
  // Capital Deployment
  capitalDeployed: decimal("capital_deployed", { precision: 12, scale: 2 }).notNull(),
  capitalAvailable: decimal("capital_available", { precision: 12, scale: 2 }).notNull(),
  
  // Generated Financial Statements
  balanceSheetPath: text("balance_sheet_path"),
  incomeStatementPath: text("income_statement_path"),
  cashFlowStatementPath: text("cash_flow_statement_path"),
  
  // Report generation
  generatedBy: text("generated_by").notNull(),
  generatedDate: timestamp("generated_date").defaultNow(),
  approvedBy: text("approved_by"),
  approvedDate: timestamp("approved_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loan Management Relations
export const loanApplicationsRelations = relations(loanApplications, ({ many, one }) => ({
  loans: many(loans),
  documents: many(loanDocuments),
  committeeReviews: many(loanCommitteeReviews),
}));

export const borrowersRelations = relations(borrowers, ({ many }) => ({
  loans: many(loans),
}));

export const loansRelations = relations(loans, ({ one, many }) => ({
  application: one(loanApplications, {
    fields: [loans.applicationId],
    references: [loanApplications.id],
  }),
  borrower: one(borrowers, {
    fields: [loans.borrowerId],
    references: [borrowers.id],
  }),
  payments: many(loanPayments),
  documents: many(loanDocuments),
  covenants: many(loanCovenants),
}));

export const loanPaymentsRelations = relations(loanPayments, ({ one }) => ({
  loan: one(loans, {
    fields: [loanPayments.loanId],
    references: [loans.id],
  }),
}));

export const loanDocumentsRelations = relations(loanDocuments, ({ one }) => ({
  loan: one(loans, {
    fields: [loanDocuments.loanId],
    references: [loans.id],
  }),
  application: one(loanApplications, {
    fields: [loanDocuments.applicationId],
    references: [loanApplications.id],
  }),
}));

export const loanCovenantsRelations = relations(loanCovenants, ({ one }) => ({
  loan: one(loans, {
    fields: [loanCovenants.loanId],
    references: [loans.id],
  }),
}));

export const loanCommitteeReviewsRelations = relations(loanCommitteeReviews, ({ one }) => ({
  application: one(loanApplications, {
    fields: [loanCommitteeReviews.applicationId],
    references: [loanApplications.id],
  }),
}));

// Loan Management Type Exports (using LoanRecord to avoid conflict with Airtable Loan interface)
export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = typeof loanApplications.$inferInsert;
export type Borrower = typeof borrowers.$inferSelect;
export type InsertBorrower = typeof borrowers.$inferInsert;
export type LoanRecord = typeof loans.$inferSelect;
export type InsertLoanRecord = typeof loans.$inferInsert;
export type LoanPayment = typeof loanPayments.$inferSelect;
export type InsertLoanPayment = typeof loanPayments.$inferInsert;
export type LoanDocument = typeof loanDocuments.$inferSelect;
export type InsertLoanDocument = typeof loanDocuments.$inferInsert;
export type LoanCovenant = typeof loanCovenants.$inferSelect;
export type InsertLoanCovenant = typeof loanCovenants.$inferInsert;
export type LoanCommitteeReview = typeof loanCommitteeReviews.$inferSelect;
export type InsertLoanCommitteeReview = typeof loanCommitteeReviews.$inferInsert;
export type CapitalSource = typeof capitalSources.$inferSelect;
export type InsertCapitalSource = typeof capitalSources.$inferInsert;
export type QuarterlyReport = typeof quarterlyReports.$inferSelect;
export type InsertQuarterlyReport = typeof quarterlyReports.$inferInsert;

// Origination Workflow Types
export type OriginationStatus = 
  | "pending_approval"
  | "approved" 
  | "documents_pending"
  | "ach_pending"
  | "ready_to_fund"
  | "funded";

// Promissory Note Templates for loan documentation
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

// Template Field Definitions for dynamic form generation
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

// Generated Documents (when templates are filled out for specific loans)
export const generatedDocuments = pgTable("generated_documents", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").notNull(), // references loan from loan-schema
  templateId: integer("template_id").references(() => promissoryNoteTemplates.id).notNull(),
  documentType: text("document_type").notNull(), // "promissory_note", "security_agreement", etc.
  generatedContent: text("generated_content").notNull(), // filled template
  fieldValues: jsonb("field_values").notNull(), // values used to fill the template
  generatedBy: text("generated_by").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  status: text("status").notNull().default("draft"), // draft, reviewed, signed, executed
  filePath: text("file_path"), // path to generated PDF/DOCX file
});

// Promissory Note Template Relations
export const promissoryNoteTemplatesRelations = relations(promissoryNoteTemplates, ({ many }) => ({
  fields: many(templateFields),
  generatedDocuments: many(generatedDocuments),
}));

export const templateFieldsRelations = relations(templateFields, ({ one }) => ({
  template: one(promissoryNoteTemplates, {
    fields: [templateFields.templateId],
    references: [promissoryNoteTemplates.id],
  }),
}));

export const generatedDocumentsRelations = relations(generatedDocuments, ({ one }) => ({
  template: one(promissoryNoteTemplates, {
    fields: [generatedDocuments.templateId],
    references: [promissoryNoteTemplates.id],
  }),
}));

// Promissory Note Type Exports
export type PromissoryNoteTemplate = typeof promissoryNoteTemplates.$inferSelect;
export type InsertPromissoryNoteTemplate = typeof promissoryNoteTemplates.$inferInsert;
export type TemplateField = typeof templateFields.$inferSelect;
export type InsertTemplateField = typeof templateFields.$inferInsert;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = typeof generatedDocuments.$inferInsert;


