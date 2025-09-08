import { GOVERNANCE_DOCS_FIELDS as GDF, _990S_FIELDS as N9F, SCHOOL_NOTES_FIELDS as SNF } from "@shared/unified-schema";
import type { GovernanceDocument, CharterGovernanceDocument, Charter990, CharterNote, Tax990 } from "@shared/schema";
import { 
  createBaseTransformer, 
  firstId, 
  firstAttachment, 
  createdAt, 
  updatedAt 
} from "@shared/unified-schema";

export function transformGovernanceDocument(record: any): GovernanceDocument {
  const f = record.fields;
  const att = firstAttachment(f[GDF.Document_PDF]);
  const link = f[GDF.Doc_Link];
  return createBaseTransformer(record, {
    schoolId: firstId(f[GDF.School]) || '',
    docType: String(f[GDF.Document_type] || ''),
    doc: String(att?.filename || ''),
    docUrl: String(att?.url || link || ''),
    docNote: String(f[GDF.Doc_notes] || ''),
    dateEntered: String(f[GDF.Date] || ''),
  });
}

export function transformCharterGovernanceDocument(record: any): CharterGovernanceDocument {
  const f = record.fields;
  const att = firstAttachment(f[GDF.Document_PDF]);
  return createBaseTransformer(record, {
    charterId: String(f[GDF.charter_id] || ''),
    docType: String(f[GDF.Document_type] || ''),
    doc: String(att?.filename || ''),
    docUrl: String(att?.url || ''),
    dateEntered: String(f[GDF.Date] || ''),
  });
}

export function transformCharter990(record: any): Charter990 {
  const f = record.fields;
  const att = firstAttachment(f[N9F.PDF]);
  return createBaseTransformer(record, {
    charterId: String(f[N9F.charter_id] || f["charter_id"] || ''),
    year: String(f["Year"] || ''),
    docUrl: String(att?.url || ''),
    notes: String(f[N9F.Notes] || ''),
    shortName: String(f[N9F.short_name] || ''),
    dateEntered: String(f["Date Entered"] || ''),
  });
}

export function transformTax990(record: any): Tax990 {
  const f = record.fields;
  const att = firstAttachment(f[N9F.PDF]);
  return createBaseTransformer(record, {
    schoolId: f[N9F.school_id] || undefined,
    year: f[N9F._990_Reporting_Year] || undefined,
    attachment: att?.filename || undefined,
    attachmentUrl: att?.url || undefined,
  });
}

export function transformCharterNote(record: any): CharterNote {
  const f = record.fields;
  return createBaseTransformer(record, {
    charterId: String(f[SNF.charter_id] || ''),
    headline: String(f[SNF.Headline__Notes_] || ''),
    notes: String(f[SNF.Notes] || ''),
    createdBy: String(f[SNF.Created_by] || ''),
    dateEntered: String(f[SNF.Date_created] || ''),
    private: Boolean(f[SNF.Private]),
  });
}
