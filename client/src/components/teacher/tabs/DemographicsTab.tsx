
/**
 * Educator “Demographics” tab. Groups demographic information into several
 * `InfoCard` sections within a `DetailGrid`. Sections cover gender identity,
 * pronouns, racial/ethnic background (including LGBTQIA flag), and language &
 * education. Array fields are joined with commas for readability. All fields are
 * editable via the `InfoCard` component which handles saving changes back to
 * the teacher record.
 */
import { DetailGrid } from "@/components/shared/DetailGrid";
import { InfoCard } from "@/components/shared/InfoCard";
import type { Teacher } from "@shared/schema.generated";

export function DemographicsTab({ teacher, onSave }: { teacher: Teacher; onSave?: (vals: any) => void }) {
  const normalizeArray = (v: any): string[] => Array.isArray(v) ? v : (v ? String(v).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  return (
    <DetailGrid>
      <InfoCard
        title="Gender"
        columns={2}
        fields={[
          { key: 'gender', label: 'Gender', type: 'text', value: (teacher as any)?.gender ?? '' },
          { key: 'genderOther', label: 'Gender (Other)', type: 'text', value: (teacher as any)?.genderOther ?? '' },
          { key: 'pronouns', label: 'Pronouns', type: 'text', value: teacher?.pronouns ?? '' },
          { key: 'pronounsOther', label: 'Pronouns (Other)', type: 'text', value: teacher?.pronounsOther ?? '' },
          { key: 'lgbtqia', label: 'LGBTQIA+', type: 'toggle', value: !!(teacher as any)?.lgbtqia },
        ]}
        onSave={(vals) => onSave?.(vals)}
      />
      <InfoCard
        title="Race/Ethnicity"
        columns={2}
        fields={[
          { key: 'raceEthnicity', label: 'Race/Ethnicity', type: 'multiselect', value: Array.isArray(teacher?.raceEthnicity) ? teacher?.raceEthnicity : (teacher?.raceEthnicity ? [teacher.raceEthnicity as unknown as string] : []) },
          { key: 'raceEthnicityOther', label: 'Race/Ethnicity (Other)', type: 'text', value: teacher?.raceEthnicityOther ?? '' },
        ]}
        onSave={(vals) => onSave?.({
          ...vals,
          ...(vals.raceEthnicity !== undefined ? { raceEthnicity: normalizeArray(vals.raceEthnicity) } : {}),
        })}
      />

      <InfoCard
        title="Income"
        columns={2}
        fields={[
          { key: 'householdIncome', label: 'Household Income', type: 'text', value: teacher?.householdIncome ?? '' },
          { key: 'incomeBackground', label: 'Income Background', type: 'text', value: teacher?.incomeBackground ?? '' },
        ]}
        onSave={(vals) => onSave?.(vals)}
      />

      <InfoCard
        title="Languages"
        columns={2}
        fields={[
          { key: 'primaryLanguage', label: 'Primary Language', type: 'multiselect', value: Array.isArray(teacher?.primaryLanguage) ? teacher?.primaryLanguage : (teacher?.primaryLanguage ? [teacher.primaryLanguage as unknown as string] : []) },
          { key: 'otherLanguages', label: 'Other Languages', type: 'multiselect', value: Array.isArray(teacher?.otherLanguages) ? teacher?.otherLanguages : (teacher?.otherLanguages ? [teacher.otherLanguages as unknown as string] : []) },
        ]}
        onSave={(vals) => onSave?.({
          ...vals,
          ...(vals.primaryLanguage !== undefined ? { primaryLanguage: normalizeArray(vals.primaryLanguage) } : {}),
          ...(vals.otherLanguages !== undefined ? { otherLanguages: normalizeArray(vals.otherLanguages) } : {}),
        })}
      />

      <InfoCard
        title="Educational Attainment"
        columns={1}
        fields={[
          { key: 'educationalAttainment', label: 'Educational Attainment', type: 'text', value: teacher?.educationalAttainment ?? '' },
        ]}
        onSave={(vals) => onSave?.(vals)}
      />

      <InfoCard
        title="Misc."
        columns={2}
        fields={[
          { key: 'excludeFromEmailLogging', label: 'Exclude From Email Logging', type: 'toggle', value: !!(teacher as any)?.excludeFromEmailLogging },
          { key: 'pronunciation', label: 'Pronunciation', type: 'text', value: (teacher as any)?.pronunciation ?? '' },
          { key: 'selfReflection', label: 'Self Reflection', type: 'textarea', value: (teacher as any)?.selfReflection ?? '' },
          { key: 'inactiveFlag', label: 'Inactive', type: 'toggle', value: !!(teacher as any)?.inactiveFlag },
        ]}
        onSave={(vals) => onSave?.(vals)}
      />
    </DetailGrid>
  );
}
