import { EDUCATORS_X_SCHOOLS_FIELDS as EXSF } from "@shared/airtable-schema";
import type { EducatorSchoolAssociation } from "@shared/schema";
import { firstId } from "./util";

export function transformEXSRecord(
  record: any,
  opts?: { schoolMap?: Map<string, string>; educatorMap?: Map<string, string> }
): EducatorSchoolAssociation {
  const f = record.fields;
  const educatorId = firstId(f[EXSF.educator_id]) || '';
  const schoolId = firstId(f[EXSF.school_id]) || '';
  const role = f[EXSF.Roles] ? [String(f[EXSF.Roles])] : [];
  return {
    id: record.id,
    educatorId,
    schoolId,
    schoolShortName: opts?.schoolMap?.get(schoolId) || '',
    educatorName: opts?.educatorMap?.get(educatorId) || '',
    role,
    status: String(f[EXSF.Stage_Status] || ''),
    startDate: String(f[EXSF.Start_Date] || ''),
    endDate: String(f[EXSF.End_Date] || ''),
    emailAtSchool: String(f[EXSF.Email_at_School] || ''),
    isActive: f[EXSF.Currently_Active] === true || f[EXSF.Currently_Active] === 'true',
    created: String(f[EXSF.Created] || new Date().toISOString()),
    lastModified: String(f[EXSF.Created] || new Date().toISOString()),
  };
}

