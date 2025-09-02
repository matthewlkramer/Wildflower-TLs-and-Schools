import { DetailGrid } from "@/components/shared/DetailGrid";
import { EntityCard } from "@/components/shared/EntityCard";
import type { Teacher } from "@shared/schema";

export function DemographicsTab({ teacher }: { teacher: Teacher }) {
  return (
    <DetailGrid>
      <EntityCard
        title="Gender"
        columns={2}
        fields={[
          { key: 'gender', label: 'Gender', type: 'text', value: (teacher as any)?.gender ?? '' },
          { key: 'genderOther', label: 'Gender (Other)', type: 'text', value: (teacher as any)?.genderOther ?? '' },
        ]}
      />
      <EntityCard
        title="Pronouns"
        columns={2}
        fields={[
          { key: 'pronouns', label: 'Pronouns', type: 'text', value: (teacher as any)?.pronouns ?? '' },
          { key: 'pronounsOther', label: 'Pronouns (Other)', type: 'text', value: (teacher as any)?.pronounsOther ?? '' },
        ]}
      />
      <EntityCard
        title="Background"
        columns={2}
        fields={[
          { key: 'raceEthnicity', label: 'Race/Ethnicity', type: 'text', value: Array.isArray((teacher as any)?.raceEthnicity) ? (teacher as any)?.raceEthnicity.join(', ') : (teacher as any)?.raceEthnicity ?? '' },
          { key: 'raceEthnicityOther', label: 'Race/Ethnicity (Other)', type: 'text', value: (teacher as any)?.raceEthnicityOther ?? '' },
          { key: 'lgbtqia', label: 'LGBTQIA+', type: 'text', value: (teacher as any)?.lgbtqia ? 'Yes' : 'No' },
        ]}
      />
      <EntityCard
        title="Languages & Education"
        columns={2}
        fields={[
          { key: 'primaryLanguage', label: 'Primary Language(s)', type: 'text', value: Array.isArray((teacher as any)?.primaryLanguage) ? (teacher as any)?.primaryLanguage.join(', ') : (teacher as any)?.primaryLanguage ?? '' },
          { key: 'otherLanguages', label: 'Other Languages', type: 'text', value: Array.isArray((teacher as any)?.otherLanguages) ? (teacher as any)?.otherLanguages.join(', ') : (teacher as any)?.otherLanguages ?? '' },
          { key: 'educationalAttainment', label: 'Educational Attainment', type: 'text', value: (teacher as any)?.educationalAttainment ?? '' },
        ]}
      />
    </DetailGrid>
  );
}

