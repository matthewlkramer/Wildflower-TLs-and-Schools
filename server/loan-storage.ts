import { db } from "./db";
import { eq, and, gte, lte, isNull, sql } from "drizzle-orm";
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
  type InsertBorrower,
  type InsertLoanApplication,
  type InsertLoanRecord,
  type InsertLoanPayment,
  type InsertLoanDocument,
  type InsertLoanCovenant,
  type InsertLoanCommitteeReview,
  type InsertCapitalSource,
  type InsertQuarterlyReport,
  type Borrower,
  type LoanApplication,
  type LoanRecord,
  type LoanPayment,
  type LoanDocument,
  type LoanCovenant,
  type LoanCommitteeReview,
  type CapitalSource,
  type QuarterlyReport
} from "@shared/schema";

// Loan Storage Interface
export interface ILoanStorage {
  // Borrower methods
  getBorrowers(): Promise<Borrower[]>;
  getBorrowerById(id: number): Promise<Borrower | undefined>;
  createBorrower(borrower: InsertBorrower): Promise<Borrower>;
  updateBorrower(id: number, borrower: Partial<InsertBorrower>): Promise<Borrower | undefined>;
  deleteBorrower(id: number): Promise<boolean>;

  // Loan Application methods
  getLoanApplications(): Promise<LoanApplication[]>;
  getLoanApplicationById(id: number): Promise<LoanApplication | undefined>;
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  updateLoanApplication(id: number, application: Partial<InsertLoanApplication>): Promise<LoanApplication | undefined>;
  deleteLoanApplication(id: number): Promise<boolean>;

  // Loan methods
  getLoans(): Promise<LoanRecord[]>;
  getLoanById(id: number): Promise<LoanRecord | undefined>;
  createLoan(loan: InsertLoanRecord): Promise<LoanRecord>;
  updateLoan(id: number, loan: Partial<InsertLoanRecord>): Promise<LoanRecord | undefined>;
  deleteLoan(id: number): Promise<boolean>;
  
  // Loan origination workflow methods
  getLoansInOrigination(): Promise<LoanRecord[]>;
  updateLoanOriginationStatus(id: number, status: string, updates?: Partial<InsertLoanRecord>): Promise<LoanRecord>;
  completeLoanACHSetup(id: number, stripeData: {
    connectAccountId?: string;
    customerId?: string;
    bankAccountId?: string;
  }): Promise<LoanRecord>;

  // Loan Payment methods
  getLoanPayments(): Promise<LoanPayment[]>;
  getLoanPaymentsByLoanId(loanId: number): Promise<LoanPayment[]>;
  createLoanPayment(payment: InsertLoanPayment): Promise<LoanPayment>;
  updateLoanPayment(id: number, payment: Partial<InsertLoanPayment>): Promise<LoanPayment | undefined>;

  // Loan Document methods
  getLoanDocumentsByLoanId(loanId: number): Promise<LoanDocument[]>;
  createLoanDocument(document: InsertLoanDocument): Promise<LoanDocument>;
  updateLoanDocument(id: number, document: Partial<InsertLoanDocument>): Promise<LoanDocument | undefined>;
  deleteLoanDocument(id: number): Promise<boolean>;

  // Loan Covenant methods
  getLoanCovenantsByLoanId(loanId: number): Promise<LoanCovenant[]>;
  createLoanCovenant(covenant: InsertLoanCovenant): Promise<LoanCovenant>;
  updateLoanCovenant(id: number, covenant: Partial<InsertLoanCovenant>): Promise<LoanCovenant | undefined>;

  // Loan Committee Review methods
  getLoanCommitteeReviewsByApplicationId(applicationId: number): Promise<LoanCommitteeReview[]>;
  createLoanCommitteeReview(review: InsertLoanCommitteeReview): Promise<LoanCommitteeReview>;

  // Capital Source methods
  getCapitalSources(): Promise<CapitalSource[]>;
  createCapitalSource(source: InsertCapitalSource): Promise<CapitalSource>;

  // Quarterly Report methods
  getQuarterlyReports(): Promise<QuarterlyReport[]>;
  createQuarterlyReport(report: InsertQuarterlyReport): Promise<QuarterlyReport>;

  // Dashboard and analytics methods
  getDashboardSummary(): Promise<{
    totalLoans: number;
    activeLoans: number;
    totalOutstanding: number;
    pendingApplications: number;
  }>;
  getUpcomingPayments(days: number): Promise<LoanPayment[]>;
  getOverduePayments(): Promise<LoanPayment[]>;
  getCovenantViolations(): Promise<LoanCovenant[]>;
}

// Database implementation of the loan storage interface
export class DatabaseLoanStorage implements ILoanStorage {
  // Borrower methods
  async getBorrowers(): Promise<Borrower[]> {
    return await db.select().from(borrowers);
  }

  async getBorrowerById(id: number): Promise<Borrower | undefined> {
    const result = await db.select().from(borrowers).where(eq(borrowers.id, id));
    return result[0];
  }

  async createBorrower(borrower: InsertBorrower): Promise<Borrower> {
    const result = await db.insert(borrowers).values(borrower).returning();
    return result[0];
  }

  async updateBorrower(id: number, borrower: Partial<InsertBorrower>): Promise<Borrower | undefined> {
    const result = await db.update(borrowers)
      .set({ ...borrower, updatedAt: new Date() })
      .where(eq(borrowers.id, id))
      .returning();
    return result[0];
  }

  async deleteBorrower(id: number): Promise<boolean> {
    const result = await db.delete(borrowers).where(eq(borrowers.id, id));
    return result.rowCount > 0;
  }

  // Loan Application methods
  async getLoanApplications(): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications);
  }

  async getLoanApplicationById(id: number): Promise<LoanApplication | undefined> {
    const result = await db.select().from(loanApplications).where(eq(loanApplications.id, id));
    return result[0];
  }

  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    const result = await db.insert(loanApplications).values(application).returning();
    return result[0];
  }

  async updateLoanApplication(id: number, application: Partial<InsertLoanApplication>): Promise<LoanApplication | undefined> {
    const result = await db.update(loanApplications)
      .set({ ...application, updatedAt: new Date() })
      .where(eq(loanApplications.id, id))
      .returning();
    return result[0];
  }

  async deleteLoanApplication(id: number): Promise<boolean> {
    const result = await db.delete(loanApplications).where(eq(loanApplications.id, id));
    return result.rowCount > 0;
  }

  // Loan methods
  async getLoans(): Promise<LoanRecord[]> {
    return await db.select().from(loans);
  }

  async getLoanById(id: number): Promise<LoanRecord | undefined> {
    const result = await db.select().from(loans).where(eq(loans.id, id));
    return result[0];
  }

  async createLoan(loan: InsertLoanRecord): Promise<LoanRecord> {
    const result = await db.insert(loans).values(loan).returning();
    return result[0];
  }

  async updateLoan(id: number, loan: Partial<InsertLoanRecord>): Promise<LoanRecord | undefined> {
    const result = await db.update(loans)
      .set({ ...loan, updatedAt: new Date() })
      .where(eq(loans.id, id))
      .returning();
    return result[0];
  }

  async deleteLoan(id: number): Promise<boolean> {
    const result = await db.delete(loans).where(eq(loans.id, id));
    return result.rowCount > 0;
  }

  // Loan origination workflow methods
  async getLoansInOrigination(): Promise<LoanRecord[]> {
    const result = await db.select({
      loan: loans,
      borrower: borrowers
    })
      .from(loans)
      .leftJoin(borrowers, eq(loans.borrowerId, borrowers.id))
      .where(sql`${loans.originationStatus} != 'funded'`);
    
    return result.map(row => ({
      ...row.loan,
      borrower: row.borrower ? {
        ...row.borrower,
        entityName: row.borrower.name // Map 'name' to 'entityName' for frontend
      } : null
    }));
  }

  async updateLoanOriginationStatus(id: number, status: string, updates?: Partial<InsertLoanRecord>): Promise<LoanRecord> {
    const updateData = {
      originationStatus: status,
      updatedAt: new Date(),
      ...updates
    };

    const result = await db.update(loans)
      .set(updateData)
      .where(eq(loans.id, id))
      .returning();
    
    return result[0];
  }

  async completeLoanACHSetup(id: number, stripeData: {
    connectAccountId?: string;
    customerId?: string;
    bankAccountId?: string;
  }): Promise<LoanRecord> {
    const updateData = {
      stripeConnectAccountId: stripeData.connectAccountId,
      stripeCustomerId: stripeData.customerId,
      stripeBankAccountId: stripeData.bankAccountId,
      achSetupCompleted: true,
      achSetupCompletedDate: new Date(),
      achMandateAccepted: true,
      achMandateAcceptedDate: new Date(),
      updatedAt: new Date(),
      originationStatus: 'ready_to_fund'
    };

    const result = await db.update(loans)
      .set(updateData)
      .where(eq(loans.id, id))
      .returning();
    
    return result[0];
  }

  // Loan Payment methods
  async getLoanPayments(): Promise<LoanPayment[]> {
    return await db.select().from(loanPayments);
  }

  async getLoanPaymentsByLoanId(loanId: number): Promise<LoanPayment[]> {
    return await db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId));
  }

  async createLoanPayment(payment: InsertLoanPayment): Promise<LoanPayment> {
    const result = await db.insert(loanPayments).values(payment).returning();
    return result[0];
  }

  async updateLoanPayment(id: number, payment: Partial<InsertLoanPayment>): Promise<LoanPayment | undefined> {
    const result = await db.update(loanPayments)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(loanPayments.id, id))
      .returning();
    return result[0];
  }

  // Loan Document methods
  async getLoanDocumentsByLoanId(loanId: number): Promise<LoanDocument[]> {
    return await db.select().from(loanDocuments).where(eq(loanDocuments.loanId, loanId));
  }

  async createLoanDocument(document: InsertLoanDocument): Promise<LoanDocument> {
    const result = await db.insert(loanDocuments).values(document).returning();
    return result[0];
  }

  async updateLoanDocument(id: number, document: Partial<InsertLoanDocument>): Promise<LoanDocument | undefined> {
    const result = await db.update(loanDocuments)
      .set({ ...document, updatedAt: new Date() })
      .where(eq(loanDocuments.id, id))
      .returning();
    return result[0];
  }

  async deleteLoanDocument(id: number): Promise<boolean> {
    const result = await db.delete(loanDocuments).where(eq(loanDocuments.id, id));
    return result.rowCount > 0;
  }

  // Loan Covenant methods
  async getLoanCovenantsByLoanId(loanId: number): Promise<LoanCovenant[]> {
    return await db.select().from(loanCovenants).where(eq(loanCovenants.loanId, loanId));
  }

  async createLoanCovenant(covenant: InsertLoanCovenant): Promise<LoanCovenant> {
    const result = await db.insert(loanCovenants).values(covenant).returning();
    return result[0];
  }

  async updateLoanCovenant(id: number, covenant: Partial<InsertLoanCovenant>): Promise<LoanCovenant | undefined> {
    const result = await db.update(loanCovenants)
      .set({ ...covenant, updatedAt: new Date() })
      .where(eq(loanCovenants.id, id))
      .returning();
    return result[0];
  }

  // Loan Committee Review methods
  async getLoanCommitteeReviewsByApplicationId(applicationId: number): Promise<LoanCommitteeReview[]> {
    return await db.select().from(loanCommitteeReviews).where(eq(loanCommitteeReviews.applicationId, applicationId));
  }

  async createLoanCommitteeReview(review: InsertLoanCommitteeReview): Promise<LoanCommitteeReview> {
    const result = await db.insert(loanCommitteeReviews).values(review).returning();
    return result[0];
  }

  // Capital Source methods
  async getCapitalSources(): Promise<CapitalSource[]> {
    return await db.select().from(capitalSources);
  }

  async createCapitalSource(source: InsertCapitalSource): Promise<CapitalSource> {
    const result = await db.insert(capitalSources).values(source).returning();
    return result[0];
  }

  // Quarterly Report methods
  async getQuarterlyReports(): Promise<QuarterlyReport[]> {
    return await db.select().from(quarterlyReports);
  }

  async createQuarterlyReport(report: InsertQuarterlyReport): Promise<QuarterlyReport> {
    const result = await db.insert(quarterlyReports).values(report).returning();
    return result[0];
  }

  // Dashboard and analytics methods
  async getDashboardSummary(): Promise<{
    totalLoans: number;
    activeLoans: number;
    totalOutstanding: number;
    pendingApplications: number;
  }> {
    // Use sql function for proper count queries
    const [totalLoansResult] = await db.select({ count: sql<number>`count(*)` }).from(loans);
    const [activeLoansResult] = await db.select({ count: sql<number>`count(*)` }).from(loans).where(eq(loans.status, 'active'));
    const [pendingApplicationsResult] = await db.select({ count: sql<number>`count(*)` }).from(loanApplications).where(eq(loanApplications.status, 'submitted'));
    
    // Calculate total outstanding by summing current principal balances
    const activeLoansData = await db.select({ balance: loans.currentPrincipalBalance }).from(loans).where(eq(loans.status, 'active'));
    const totalOutstanding = activeLoansData.reduce((sum, loan) => sum + parseFloat(loan.balance?.toString() || '0'), 0);

    return {
      totalLoans: totalLoansResult.count || 0,
      activeLoans: activeLoansResult.count || 0,
      totalOutstanding,
      pendingApplications: pendingApplicationsResult.count || 0
    };
  }

  async getUpcomingPayments(days: number = 30): Promise<LoanPayment[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db.select().from(loanPayments)
      .where(
        and(
          gte(loanPayments.scheduledDate, new Date()),
          lte(loanPayments.scheduledDate, futureDate),
          eq(loanPayments.status, 'scheduled')
        )
      );
  }

  async getOverduePayments(): Promise<LoanPayment[]> {
    return await db.select().from(loanPayments)
      .where(
        and(
          lte(loanPayments.scheduledDate, new Date()),
          eq(loanPayments.status, 'overdue')
        )
      );
  }

  async getCovenantViolations(): Promise<LoanCovenant[]> {
    return await db.select().from(loanCovenants)
      .where(eq(loanCovenants.complianceStatus, 'violation'));
  }
}

// Export the singleton instance
export const loanStorage = new DatabaseLoanStorage();