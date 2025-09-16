// Type-only shim for shared/loan-schema when compiling the client.
// These types are used for UI typing only; they are not executed at runtime.
declare module "../../../shared/loan-schema" {
  export type Loan = any;
  export type Borrower = any;
  export type LoanApplication = any;
  export type LoanPayment = any;
  export type LoanDocument = any;
  export type LoanCovenant = any;
  export type LoanCommitteeReview = any;
  export type CapitalSource = any;
  export type QuarterlyReport = any;
  export type ReportSchedule = any;
  export type QuarterlyReportReminder = any;
  export type PromissoryNoteTemplate = any;
  export type TemplateField = any;
  export type GeneratedDocument = any;
  export type InsertBorrower = any;
  export type InsertLoanApplication = any;
  export type InsertLoan = any;
  export type InsertLoanPayment = any;
  export type InsertLoanDocument = any;
  export type InsertLoanCovenant = any;
  export type InsertLoanCommitteeReview = any;
  export type InsertCapitalSource = any;
  export type InsertQuarterlyReport = any;
  export type InsertReportSchedule = any;
  export type InsertQuarterlyReportReminder = any;
  export type InsertPromissoryNoteTemplate = any;
  export type InsertTemplateField = any;
  export type InsertGeneratedDocument = any;
}

