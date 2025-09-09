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
} from "@shared/loan-schema";

import {
  reportSchedules,
  quarterlyReportReminders,
  type InsertReportSchedule,
  type InsertQuarterlyReportReminder,
  type ReportSchedule,
  type QuarterlyReportReminder
} from "../shared/loan-schema";

import {
  promissoryNoteTemplates,
  templateFields,
  generatedDocuments,
  type InsertPromissoryNoteTemplate,
  type InsertTemplateField,
  type InsertGeneratedDocument,
  type PromissoryNoteTemplate,
  type TemplateField,
  type GeneratedDocument
} from "../shared/schema.generated";

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
  getQuarterlyReportsByLoanId(loanId: number): Promise<QuarterlyReport[]>;
  createQuarterlyReport(report: InsertQuarterlyReport): Promise<QuarterlyReport>;
  updateQuarterlyReport(id: number, report: Partial<InsertQuarterlyReport>): Promise<QuarterlyReport | undefined>;
  getQuarterlyReportsForTracking(): Promise<(QuarterlyReport & { borrowerName: string; loanNumber: string })[]>;
  getOverdueQuarterlyReports(): Promise<(QuarterlyReport & { borrowerName: string; loanNumber: string })[]>;
  generateQuarterlyReportsForPeriod(year: number, quarter: number): Promise<void>;
  
  // Report Schedule methods
  getReportSchedules(): Promise<ReportSchedule[]>;
  createReportSchedule(schedule: InsertReportSchedule): Promise<ReportSchedule>;
  updateReportSchedule(id: number, schedule: Partial<InsertReportSchedule>): Promise<ReportSchedule | undefined>;
  deleteReportSchedule(id: number): Promise<boolean>;
  
  // Reminder methods
  getQuarterlyReportReminders(quarterlyReportId: number): Promise<QuarterlyReportReminder[]>;
  createQuarterlyReportReminder(reminder: InsertQuarterlyReportReminder): Promise<QuarterlyReportReminder>;
  sendQuarterlyReportReminder(quarterlyReportId: number, reminderType: string, sentBy: string): Promise<QuarterlyReportReminder>;

  // Promissory Note Template methods
  getPromissoryNoteTemplates(): Promise<PromissoryNoteTemplate[]>;
  getPromissoryNoteTemplateById(id: number): Promise<PromissoryNoteTemplate | undefined>;
  getPromissoryNoteTemplatesByType(templateType: string): Promise<PromissoryNoteTemplate[]>;
  createPromissoryNoteTemplate(template: InsertPromissoryNoteTemplate): Promise<PromissoryNoteTemplate>;
  updatePromissoryNoteTemplate(id: number, template: Partial<InsertPromissoryNoteTemplate>): Promise<PromissoryNoteTemplate | undefined>;
  createNewTemplateVersion(originalId: number, updates: Partial<InsertPromissoryNoteTemplate>, createdBy: string): Promise<PromissoryNoteTemplate>;
  
  // Template Field methods
  getTemplateFields(templateId: number): Promise<TemplateField[]>;
  createTemplateField(field: InsertTemplateField): Promise<TemplateField>;
  updateTemplateField(id: number, field: Partial<InsertTemplateField>): Promise<TemplateField | undefined>;
  deleteTemplateField(id: number): Promise<boolean>;
  
  // Document Generation methods
  generatePromissoryNote(loanId: number, templateId: number, fieldValues: Record<string, any>, generatedBy: string): Promise<GeneratedDocument>;
  getGeneratedDocuments(loanId: number): Promise<GeneratedDocument[]>;
  
  // Template parsing methods
  parseTemplateFields(content: string): string[];
  fillTemplate(template: PromissoryNoteTemplate, fieldValues: Record<string, any>): string;

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

  async getQuarterlyReportsByLoanId(loanId: number): Promise<QuarterlyReport[]> {
    return await db.select().from(quarterlyReports).where(eq(quarterlyReports.loanId, loanId));
  }

  async createQuarterlyReport(report: InsertQuarterlyReport): Promise<QuarterlyReport> {
    const result = await db.insert(quarterlyReports).values(report).returning();
    return result[0];
  }

  async updateQuarterlyReport(id: number, report: Partial<InsertQuarterlyReport>): Promise<QuarterlyReport | undefined> {
    const result = await db.update(quarterlyReports)
      .set({ ...report, updatedAt: new Date() })
      .where(eq(quarterlyReports.id, id))
      .returning();
    return result[0];
  }

  async getQuarterlyReportsForTracking(): Promise<(QuarterlyReport & { borrowerName: string; loanNumber: string })[]> {
    const result = await db.select({
      report: quarterlyReports,
      borrower: borrowers,
      loan: loans
    })
      .from(quarterlyReports)
      .leftJoin(loans, eq(quarterlyReports.loanId, loans.id))
      .leftJoin(borrowers, eq(loans.borrowerId, borrowers.id))
      .orderBy(quarterlyReports.dueDate);
    
    return result.map(row => ({
      ...row.report,
      borrowerName: row.borrower?.name || 'Unknown',
      loanNumber: row.loan?.loanNumber || 'Unknown'
    }));
  }

  async getOverdueQuarterlyReports(): Promise<(QuarterlyReport & { borrowerName: string; loanNumber: string })[]> {
    const result = await db.select({
      report: quarterlyReports,
      borrower: borrowers,
      loan: loans
    })
      .from(quarterlyReports)
      .leftJoin(loans, eq(quarterlyReports.loanId, loans.id))
      .leftJoin(borrowers, eq(loans.borrowerId, borrowers.id))
      .where(
        and(
          lte(quarterlyReports.dueDate, new Date()),
          isNull(quarterlyReports.submissionDate)
        )
      );
    
    return result.map(row => ({
      ...row.report,
      borrowerName: row.borrower?.name || 'Unknown',
      loanNumber: row.loan?.loanNumber || 'Unknown'
    }));
  }

  async generateQuarterlyReportsForPeriod(year: number, quarter: number): Promise<void> {
    // Get report schedule for this quarter
    const [schedule] = await db.select()
      .from(reportSchedules)
      .where(and(eq(reportSchedules.quarter, quarter), eq(reportSchedules.isActive, true)));
    
    if (!schedule) {
      throw new Error(`No active schedule found for Q${quarter}`);
    }

    // Calculate due date
    const dueDate = new Date(year, schedule.dueMonth - 1, schedule.dueDay);
    
    // Get all active loans
    const activeLoans = await db.select().from(loans).where(eq(loans.status, 'active'));
    
    // Create quarterly report records for each active loan
    const reportsToCreate = activeLoans.map(loan => ({
      loanId: loan.id,
      reportYear: year,
      reportQuarter: quarter,
      dueDate,
      status: 'pending' as const
    }));

    if (reportsToCreate.length > 0) {
      await db.insert(quarterlyReports).values(reportsToCreate);
    }
  }

  // Report Schedule methods
  async getReportSchedules(): Promise<ReportSchedule[]> {
    return await db.select().from(reportSchedules).orderBy(reportSchedules.quarter);
  }

  async createReportSchedule(schedule: InsertReportSchedule): Promise<ReportSchedule> {
    const result = await db.insert(reportSchedules).values(schedule).returning();
    return result[0];
  }

  async updateReportSchedule(id: number, schedule: Partial<InsertReportSchedule>): Promise<ReportSchedule | undefined> {
    const result = await db.update(reportSchedules)
      .set({ ...schedule, updatedAt: new Date() })
      .where(eq(reportSchedules.id, id))
      .returning();
    return result[0];
  }

  async deleteReportSchedule(id: number): Promise<boolean> {
    const result = await db.delete(reportSchedules).where(eq(reportSchedules.id, id));
    return result.rowCount > 0;
  }

  // Reminder methods
  async getQuarterlyReportReminders(quarterlyReportId: number): Promise<QuarterlyReportReminder[]> {
    return await db.select().from(quarterlyReportReminders)
      .where(eq(quarterlyReportReminders.quarterlyReportId, quarterlyReportId))
      .orderBy(quarterlyReportReminders.sentDate);
  }

  async createQuarterlyReportReminder(reminder: InsertQuarterlyReportReminder): Promise<QuarterlyReportReminder> {
    const result = await db.insert(quarterlyReportReminders).values(reminder).returning();
    return result[0];
  }

  async sendQuarterlyReportReminder(quarterlyReportId: number, reminderType: string, sentBy: string): Promise<QuarterlyReportReminder> {
    // Get the quarterly report with loan and borrower info
    const [reportData] = await db.select({
      report: quarterlyReports,
      loan: loans,
      borrower: borrowers
    })
      .from(quarterlyReports)
      .leftJoin(loans, eq(quarterlyReports.loanId, loans.id))
      .leftJoin(borrowers, eq(loans.borrowerId, borrowers.id))
      .where(eq(quarterlyReports.id, quarterlyReportId));

    if (!reportData) {
      throw new Error('Quarterly report not found');
    }

    // Create reminder record
    const reminderData: InsertQuarterlyReportReminder = {
      quarterlyReportId,
      reminderType,
      sentDate: new Date(),
      method: 'email',
      recipientEmail: reportData.borrower?.primaryContactEmail || '',
      subject: `Q${reportData.report.reportQuarter} ${reportData.report.reportYear} Quarterly Report Due`,
      message: `Your quarterly report for Q${reportData.report.reportQuarter} ${reportData.report.reportYear} is due on ${reportData.report.dueDate?.toLocaleDateString()}.`,
      sentBy
    };

    const reminder = await this.createQuarterlyReportReminder(reminderData);

    // Update the quarterly report reminder tracking
    await db.update(quarterlyReports)
      .set({
        remindersSent: sql`${quarterlyReports.remindersSent} + 1`,
        lastReminderSent: new Date()
      })
      .where(eq(quarterlyReports.id, quarterlyReportId));

    return reminder;
  }

  // Promissory Note Template methods
  async getPromissoryNoteTemplates(): Promise<PromissoryNoteTemplate[]> {
    return await db.select().from(promissoryNoteTemplates)
      .orderBy(promissoryNoteTemplates.name, promissoryNoteTemplates.version);
  }

  async getPromissoryNoteTemplateById(id: number): Promise<PromissoryNoteTemplate | undefined> {
    const result = await db.select().from(promissoryNoteTemplates)
      .where(eq(promissoryNoteTemplates.id, id));
    return result[0];
  }

  async getPromissoryNoteTemplatesByType(templateType: string): Promise<PromissoryNoteTemplate[]> {
    return await db.select().from(promissoryNoteTemplates)
      .where(eq(promissoryNoteTemplates.templateType, templateType))
      .orderBy(promissoryNoteTemplates.version);
  }

  async createPromissoryNoteTemplate(template: InsertPromissoryNoteTemplate): Promise<PromissoryNoteTemplate> {
    const result = await db.insert(promissoryNoteTemplates).values(template).returning();
    return result[0];
  }

  async updatePromissoryNoteTemplate(id: number, template: Partial<InsertPromissoryNoteTemplate>): Promise<PromissoryNoteTemplate | undefined> {
    const result = await db.update(promissoryNoteTemplates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(promissoryNoteTemplates.id, id))
      .returning();
    return result[0];
  }

  async createNewTemplateVersion(originalId: number, updates: Partial<InsertPromissoryNoteTemplate>, createdBy: string): Promise<PromissoryNoteTemplate> {
    // Get the original template
    const original = await this.getPromissoryNoteTemplateById(originalId);
    if (!original) {
      throw new Error('Original template not found');
    }

    // Find the highest version for this template type
    const existingVersions = await db.select({ version: promissoryNoteTemplates.version })
      .from(promissoryNoteTemplates)
      .where(eq(promissoryNoteTemplates.templateType, original.templateType));
    
    const maxVersion = Math.max(...existingVersions.map(v => v.version || 0));
    const newVersion = maxVersion + 1;

    // Create new version
    const newTemplate: InsertPromissoryNoteTemplate = {
      ...original,
      ...updates,
      version: newVersion,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Remove the id so it creates a new record
    delete (newTemplate as any).id;

    const result = await db.insert(promissoryNoteTemplates).values(newTemplate).returning();
    return result[0];
  }

  // Template Field methods
  async getTemplateFields(templateId: number): Promise<TemplateField[]> {
    return await db.select().from(templateFields)
      .where(eq(templateFields.templateId, templateId))
      .orderBy(templateFields.sortOrder);
  }

  async createTemplateField(field: InsertTemplateField): Promise<TemplateField> {
    const result = await db.insert(templateFields).values(field).returning();
    return result[0];
  }

  async updateTemplateField(id: number, field: Partial<InsertTemplateField>): Promise<TemplateField | undefined> {
    const result = await db.update(templateFields)
      .set(field)
      .where(eq(templateFields.id, id))
      .returning();
    return result[0];
  }

  async deleteTemplateField(id: number): Promise<boolean> {
    const result = await db.delete(templateFields).where(eq(templateFields.id, id));
    return result.rowCount > 0;
  }

  // Document Generation methods
  async generatePromissoryNote(loanId: number, templateId: number, fieldValues: Record<string, any>, generatedBy: string): Promise<GeneratedDocument> {
    const template = await this.getPromissoryNoteTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const generatedContent = this.fillTemplate(template, fieldValues);

    const document: InsertGeneratedDocument = {
      loanId,
      templateId,
      documentType: 'promissory_note',
      generatedContent,
      fieldValues,
      generatedBy,
      generatedAt: new Date(),
      status: 'draft'
    };

    const result = await db.insert(generatedDocuments).values(document).returning();
    return result[0];
  }

  async getGeneratedDocuments(loanId: number): Promise<GeneratedDocument[]> {
    return await db.select().from(generatedDocuments)
      .where(eq(generatedDocuments.loanId, loanId))
      .orderBy(generatedDocuments.generatedAt);
  }

  // Template parsing methods
  parseTemplateFields(content: string): string[] {
    // Find all placeholders in brackets like [FIELD_NAME], $[AMOUNT], etc.
    const fieldRegex = /\[([^\]]+)\]/g;
    const matches = content.match(fieldRegex) || [];
    return [...new Set(matches)]; // remove duplicates
  }

  fillTemplate(template: PromissoryNoteTemplate, fieldValues: Record<string, any>): string {
    let content = template.content;
    
    // Replace each field value in the template
    Object.entries(fieldValues).forEach(([fieldName, value]) => {
      const placeholder = `[${fieldName}]`;
      const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, value?.toString() || '');
    });

    return content;
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
