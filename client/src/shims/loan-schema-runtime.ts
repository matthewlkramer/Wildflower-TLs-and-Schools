// Runtime shim for shared/loan-schema in the browser. Export dummies for tables
// and type-only re-exports for TS. This prevents executing drizzle builders.

// Table dummies (shape irrelevant for client; they are not used at runtime)
export const borrowers = {} as any;
export const loanApplications = {} as any;
export const loans = {} as any;
export const loanPayments = {} as any;
export const loanDocuments = {} as any;
export const loanCovenants = {} as any;
export const loanCommitteeReviews = {} as any;
export const capitalSources = {} as any;
export const quarterlyReports = {} as any;
export const reportSchedules = {} as any;
export const quarterlyReportReminders = {} as any;
export const promissoryNoteTemplates = {} as any;
export const templateFields = {} as any;
export const generatedDocuments = {} as any;

// No type re-exports here to avoid module resolution errors in client build.
