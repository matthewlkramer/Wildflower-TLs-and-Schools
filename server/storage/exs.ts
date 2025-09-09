import { EDUCATORS_X_SCHOOLS_FIELDS as EXSF } from "@shared/schema";
import type { EducatorSchoolAssociation } from "@shared/schema";
import { createBaseTransformer, firstId } from "@shared/schema";

export function transformEXSRecord(
  record: any,
  opts?: { schoolMap?: Map<string, string>; educatorMap?: Map<string, string> }
): EducatorSchoolAssociation {
  const f = record.fields;
  const educatorId = firstId(f[EXSF.educator_id]) || '';
  const schoolId = firstId(f[EXSF.school_id]) || '';
  const role = f[EXSF.Roles] ? [String(f[EXSF.Roles])] : [];
  return createBaseTransformer(record, {
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
  });
}

