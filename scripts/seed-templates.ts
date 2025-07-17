import { loanStorage } from "../server/loan-storage";

// Sunlight Promissory Note Template Content
const sunlightTemplate = `PROMISSORY NOTE

$[LOAN_AMOUNT]	[DATE], 2024

FOR VALUE RECEIVED, [SCHOOL_NAME], a [SCHOOL_STATE] nonprofit corporation, (the "School"), promises to pay to the order of The Sunlight Loan Fund, LLC (the "Lender"), the principal sum of [LOAN_AMOUNT_WORDS] DOLLARS ($[LOAN_AMOUNT]) (the "Loan").  This Promissory Note shall be binding upon, and shall inure to the benefit of, the School and the Lender and their respective successors and assigns.

1. Maturity Date: All unpaid principal, together with any unpaid amounts payable hereunder, shall be due and payable on the earlier of (i) [MATURITY_DATE] (the "Maturity Date") and (ii) at the Lender's option, if the School defaults on the Loan as described in Section 6 below.

2. Fees, Interest and Principal.  The School shall pay the Lender an underwriting fee of 1% of the principal sum of the Loan to be accounted for in the net proceeds as calculated in Exhibit A. The unpaid principal balance of the Loan from time to time shall bear interest at a rate equal to five percent (5%) per annum starting upon issuance of the Loan and through the Maturity Date. Interest hereon shall be computed on the basis of a 360-day year consisting of twelve 30-day months.

Payment Due Date | Payment Amount
[PAYMENT_1_DATE] and monthly thereafter until [PAYMENT_1_END] | $[PAYMENT_1_AMOUNT] per month
[PAYMENT_2_DATE] and monthly thereafter until [PAYMENT_2_END] | $[PAYMENT_2_AMOUNT] per month
[PAYMENT_3_DATE] and monthly thereafter until [PAYMENT_3_END] | $[PAYMENT_3_AMOUNT] per month
[PAYMENT_4_DATE] and monthly thereafter until [PAYMENT_4_END] | $[PAYMENT_4_AMOUNT] per month

3. Grant of Security Interest.  In consideration of the financial accommodations given or to be given to the School by the Lender and as security for the payment and performance of all of the School's obligations hereunder, including the payment of the principal balance and all accrued and unpaid interest (if any) of this Promissory Note and all expenses of collection, the School hereby grants to the Lender a security interest in all of the School's right, title, and interest in and to all assets of the School...

4. Covenants.  So long as any amounts remain outstanding hereunder, the School hereby covenants and agrees as follows:

The School shall provide to the Lender (a) within 45 days after the end of each fiscal quarter of the School, the unaudited financial statements of the School for such quarter, including a profit and loss statement and balance sheet and (b) as requested and at least annually detailed information on student and teacher demographics, the enrollment and tuition schedule and the number of qualified low income students for such year.

The School shall provide to Lender any information relating to the operations of the School or its assets or business that the Lender may reasonably request from time to time.

The School will not create, incur, assume, or be liable for any indebtedness for borrowed money without approval of Lender, other than any indebtedness owing in favor of Lender, other than any indebtedness owing in favor of Lender or trade debt (including without limitation credit card debt) incurred in the ordinary course of business in aggregate outstanding amount in excess of $10,000.

The School shall not pledge, mortgage or create, or suffer to exist a lien, encumbrance, charge, or security interest in any of its assets or properties in favor of any person other than the Lender without approval of the Lender, or agree with another person not to pledge, mortgage, create or suffer to exist a lien, encumbrance, charge, or security interest, in each case, other than any of the foregoing existing as of the date hereof.

The School will not sell or otherwise dispose, or offer to sell or otherwise dispose, of any of its assets or properties outside of its ordinary course of business, unless it immediately uses all net proceeds thereof to repay outstanding amounts hereunder.

5. Representations.  The School hereby represents and warrants to the Lender as follows: This Promissory Note and the consummation of the transactions contemplated hereby, have been duly authorized by the School and constitute the legal, valid, and binding obligations of the School, enforceable against the School in accordance with its terms.

6. Events of Default and Remedies.  The occurrence of any of the following events or conditions shall constitute an event of default hereunder (an "Event of Default"): The School shall fail to pay any amounts owing hereby as and when due and payable; A representation or warranty made by the School in this Promissory Note is incorrect in any material respect when made; The School shall fail to perform or observe any term, covenant or agreement contained in this Promissory Note other than any requirement to pay any amounts due and owing hereunder...

7. Governing Law; Waiver of Right to Jury Trial.  This Promissory Note and the rights and obligations of the School and the Lender shall be governed by and interpreted and enforced in accordance with the laws of the State of Minnesota without reference to any conflict of law or choice of law principles of such state...

8. Miscellaneous.  The provisions of this Promissory Note are intended to be severable.  If for any reason any provisions of this Promissory Note shall be held invalid or unenforceable in whole or in part in any jurisdiction...

It is understood that the School has signed and is bound by the terms of The Wildflower Foundation Membership Agreement the ("Agreement").  If, for any reason, the Agreement terminates, the School agrees the interest rate referred to in Section 3 of this Promissory Note will increase from five percent (5%) per annum to ten percent (10%) per annum.

IN WITNESS WHEREOF, the School has executed and delivered this instrument as of the day and year first above written.

[SCHOOL_NAME]

________________________________
By: [SIGNATORY_NAME]
Name: [SIGNATORY_TITLE]
Title: [SIGNATORY_TITLE]

Address: [SCHOOL_ADDRESS]

EXHIBIT A: FEES AND NET PROCEEDS

Principal sum of the loan: [LOAN_AMOUNT]
Underwriting fee (1%): [UNDERWRITING_FEE]
Net proceeds to be wired: [NET_PROCEEDS]

Annual interest rate: 5%
Annual percentage rate (APR): [APR_RATE]`;

// Founder's Promissory Note Template Content
const foundersTemplate = `FOUNDER'S PROMISSORY NOTE

$[LOAN_AMOUNT]	[DATE], 2024

FOR VALUE RECEIVED, [SCHOOL_NAME], a [SCHOOL_STATE] nonprofit corporation, (the "School"), promises to pay to the order of [FOUNDER_NAME] (the "Founder"), the principal sum of [LOAN_AMOUNT_WORDS] DOLLARS ($[LOAN_AMOUNT]) (the "Founder's Promissory Note").  

The unpaid principal balance of the Founder's Promissory Note shall bear interest at a rate equal to zero percent (0%) per annum. The principal balance of the Founder's Promissory Note shall be paid in installments as outlined below.  The School may prepay the Founder's Promissory Note, in part or in full, at any time. 

Payment Due Date | Payment Amount
[PAYMENT_1_DATE] | $[PAYMENT_1_AMOUNT]
[PAYMENT_2_DATE] | $[PAYMENT_2_AMOUNT]
[PAYMENT_3_DATE] | $[PAYMENT_3_AMOUNT]
[PAYMENT_4_DATE] | $[PAYMENT_4_AMOUNT]

IN WITNESS WHEREOF, the School has executed and delivered this instrument as of the day and year first above written.

[SCHOOL_NAME]

________________________________
By: [SIGNATORY_NAME]
Name: [SIGNATORY_TITLE]
Title: [SIGNATORY_TITLE]

Address: [SCHOOL_ADDRESS]`;

// Field definitions for Sunlight template
const sunlightFields = [
  { fieldName: "LOAN_AMOUNT", fieldLabel: "Loan Amount", fieldType: "currency", placeholder: "[LOAN_AMOUNT]", sortOrder: 1 },
  { fieldName: "DATE", fieldLabel: "Date", fieldType: "date", placeholder: "[DATE]", sortOrder: 2 },
  { fieldName: "SCHOOL_NAME", fieldLabel: "School Name", fieldType: "text", placeholder: "[SCHOOL_NAME]", sortOrder: 3 },
  { fieldName: "SCHOOL_STATE", fieldLabel: "School State", fieldType: "text", placeholder: "[SCHOOL_STATE]", sortOrder: 4 },
  { fieldName: "LOAN_AMOUNT_WORDS", fieldLabel: "Loan Amount (Words)", fieldType: "text", placeholder: "[LOAN_AMOUNT_WORDS]", sortOrder: 5 },
  { fieldName: "MATURITY_DATE", fieldLabel: "Maturity Date", fieldType: "date", placeholder: "[MATURITY_DATE]", sortOrder: 6 },
  { fieldName: "PAYMENT_1_DATE", fieldLabel: "Payment 1 Start Date", fieldType: "date", placeholder: "[PAYMENT_1_DATE]", sortOrder: 7 },
  { fieldName: "PAYMENT_1_END", fieldLabel: "Payment 1 End Date", fieldType: "date", placeholder: "[PAYMENT_1_END]", sortOrder: 8 },
  { fieldName: "PAYMENT_1_AMOUNT", fieldLabel: "Payment 1 Amount", fieldType: "currency", placeholder: "[PAYMENT_1_AMOUNT]", sortOrder: 9 },
  { fieldName: "PAYMENT_2_DATE", fieldLabel: "Payment 2 Start Date", fieldType: "date", placeholder: "[PAYMENT_2_DATE]", sortOrder: 10 },
  { fieldName: "PAYMENT_2_END", fieldLabel: "Payment 2 End Date", fieldType: "date", placeholder: "[PAYMENT_2_END]", sortOrder: 11 },
  { fieldName: "PAYMENT_2_AMOUNT", fieldLabel: "Payment 2 Amount", fieldType: "currency", placeholder: "[PAYMENT_2_AMOUNT]", sortOrder: 12 },
  { fieldName: "PAYMENT_3_DATE", fieldLabel: "Payment 3 Start Date", fieldType: "date", placeholder: "[PAYMENT_3_DATE]", sortOrder: 13 },
  { fieldName: "PAYMENT_3_END", fieldLabel: "Payment 3 End Date", fieldType: "date", placeholder: "[PAYMENT_3_END]", sortOrder: 14 },
  { fieldName: "PAYMENT_3_AMOUNT", fieldLabel: "Payment 3 Amount", fieldType: "currency", placeholder: "[PAYMENT_3_AMOUNT]", sortOrder: 15 },
  { fieldName: "PAYMENT_4_DATE", fieldLabel: "Payment 4 Start Date", fieldType: "date", placeholder: "[PAYMENT_4_DATE]", sortOrder: 16 },
  { fieldName: "PAYMENT_4_END", fieldLabel: "Payment 4 End Date", fieldType: "date", placeholder: "[PAYMENT_4_END]", sortOrder: 17 },
  { fieldName: "PAYMENT_4_AMOUNT", fieldLabel: "Payment 4 Amount", fieldType: "currency", placeholder: "[PAYMENT_4_AMOUNT]", sortOrder: 18 },
  { fieldName: "SIGNATORY_NAME", fieldLabel: "Signatory Name", fieldType: "text", placeholder: "[SIGNATORY_NAME]", sortOrder: 19 },
  { fieldName: "SIGNATORY_TITLE", fieldLabel: "Signatory Title", fieldType: "text", placeholder: "[SIGNATORY_TITLE]", sortOrder: 20 },
  { fieldName: "SCHOOL_ADDRESS", fieldLabel: "School Address", fieldType: "text", placeholder: "[SCHOOL_ADDRESS]", sortOrder: 21 },
  { fieldName: "UNDERWRITING_FEE", fieldLabel: "Underwriting Fee", fieldType: "currency", placeholder: "[UNDERWRITING_FEE]", sortOrder: 22 },
  { fieldName: "NET_PROCEEDS", fieldLabel: "Net Proceeds", fieldType: "currency", placeholder: "[NET_PROCEEDS]", sortOrder: 23 },
  { fieldName: "APR_RATE", fieldLabel: "APR Rate", fieldType: "text", placeholder: "[APR_RATE]", sortOrder: 24 }
];

// Field definitions for Founder's template
const foundersFields = [
  { fieldName: "LOAN_AMOUNT", fieldLabel: "Loan Amount", fieldType: "currency", placeholder: "[LOAN_AMOUNT]", sortOrder: 1 },
  { fieldName: "DATE", fieldLabel: "Date", fieldType: "date", placeholder: "[DATE]", sortOrder: 2 },
  { fieldName: "SCHOOL_NAME", fieldLabel: "School Name", fieldType: "text", placeholder: "[SCHOOL_NAME]", sortOrder: 3 },
  { fieldName: "SCHOOL_STATE", fieldLabel: "School State", fieldType: "text", placeholder: "[SCHOOL_STATE]", sortOrder: 4 },
  { fieldName: "FOUNDER_NAME", fieldLabel: "Founder Name", fieldType: "text", placeholder: "[FOUNDER_NAME]", sortOrder: 5 },
  { fieldName: "LOAN_AMOUNT_WORDS", fieldLabel: "Loan Amount (Words)", fieldType: "text", placeholder: "[LOAN_AMOUNT_WORDS]", sortOrder: 6 },
  { fieldName: "PAYMENT_1_DATE", fieldLabel: "Payment 1 Date", fieldType: "date", placeholder: "[PAYMENT_1_DATE]", sortOrder: 7 },
  { fieldName: "PAYMENT_1_AMOUNT", fieldLabel: "Payment 1 Amount", fieldType: "currency", placeholder: "[PAYMENT_1_AMOUNT]", sortOrder: 8 },
  { fieldName: "PAYMENT_2_DATE", fieldLabel: "Payment 2 Date", fieldType: "date", placeholder: "[PAYMENT_2_DATE]", sortOrder: 9 },
  { fieldName: "PAYMENT_2_AMOUNT", fieldLabel: "Payment 2 Amount", fieldType: "currency", placeholder: "[PAYMENT_2_AMOUNT]", sortOrder: 10 },
  { fieldName: "PAYMENT_3_DATE", fieldLabel: "Payment 3 Date", fieldType: "date", placeholder: "[PAYMENT_3_DATE]", sortOrder: 11 },
  { fieldName: "PAYMENT_3_AMOUNT", fieldLabel: "Payment 3 Amount", fieldType: "currency", placeholder: "[PAYMENT_3_AMOUNT]", sortOrder: 12 },
  { fieldName: "PAYMENT_4_DATE", fieldLabel: "Payment 4 Date", fieldType: "date", placeholder: "[PAYMENT_4_DATE]", sortOrder: 13 },
  { fieldName: "PAYMENT_4_AMOUNT", fieldLabel: "Payment 4 Amount", fieldType: "currency", placeholder: "[PAYMENT_4_AMOUNT]", sortOrder: 14 },
  { fieldName: "SIGNATORY_NAME", fieldLabel: "Signatory Name", fieldType: "text", placeholder: "[SIGNATORY_NAME]", sortOrder: 15 },
  { fieldName: "SIGNATORY_TITLE", fieldLabel: "Signatory Title", fieldType: "text", placeholder: "[SIGNATORY_TITLE]", sortOrder: 16 },
  { fieldName: "SCHOOL_ADDRESS", fieldLabel: "School Address", fieldType: "text", placeholder: "[SCHOOL_ADDRESS]", sortOrder: 17 }
];

async function seedPromissoryNoteTemplates() {
  try {
    console.log("Seeding promissory note templates...");

    // Create Sunlight template
    const sunlightTemplateRecord = await loanStorage.createPromissoryNoteTemplate({
      name: "Sunlight Promissory Note",
      templateType: "standard",
      version: 1,
      content: sunlightTemplate,
      variableFields: sunlightFields,
      isActive: true,
      createdBy: "System"
    });

    console.log("Created Sunlight template:", sunlightTemplateRecord.id);

    // Create field records for Sunlight template
    for (const field of sunlightFields) {
      await loanStorage.createTemplateField({
        templateId: sunlightTemplateRecord.id,
        ...field,
        isRequired: true
      });
    }

    // Create Founder's template
    const foundersTemplateRecord = await loanStorage.createPromissoryNoteTemplate({
      name: "Founder's Promissory Note",
      templateType: "founders",
      version: 1,
      content: foundersTemplate,
      variableFields: foundersFields,
      isActive: true,
      createdBy: "System"
    });

    console.log("Created Founder's template:", foundersTemplateRecord.id);

    // Create field records for Founder's template
    for (const field of foundersFields) {
      await loanStorage.createTemplateField({
        templateId: foundersTemplateRecord.id,
        ...field,
        isRequired: true
      });
    }

    console.log("Promissory note templates seeded successfully!");

  } catch (error) {
    console.error("Error seeding templates:", error);
  }
}

// Run the seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPromissoryNoteTemplates().then(() => {
    console.log("Seeding complete");
    process.exit(0);
  }).catch(error => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
}

export { seedPromissoryNoteTemplates };