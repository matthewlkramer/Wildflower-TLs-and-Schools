// Client-side shim: re-export only types from shared/loan-schema without
// importing any runtime drizzle constructs. This compiles to no JS.
export type {
  Loan,
  Borrower,
  LoanApplication,
  LoanPayment,
} from "../../../shared/loan-schema";

