/**
 * Educator “Online Forms” tab. Uses React Query to fetch all SSJ Fillout form
 * submissions for the given educator id. Before rendering the table it computes
 * the most recent submission date for quick reference. The tab shows that date
 * above an `SSJFilloutFormsTable` which presents each submission and supports
 * viewing form details. Loading state is handled by React Query’s `isLoading`.
 */
import { useQuery } from "@tanstack/react-query";
import type { SSJFilloutForm } from "@shared/schema.generated";
import { useEffect, useMemo, useState } from "react";
import { DetailGrid } from "@/components/shared/DetailGrid";
import { InfoCard } from "@/components/shared/InfoCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export function OnlineFormsTab({ educatorId }: { educatorId: string }) {
  const { data: forms = [], isLoading } = useQuery<any[]>({
    queryKey: ["supabase/ssj_fillout_forms/educator", educatorId],
    enabled: !!educatorId,
    queryFn: async () => {
      const base = () => supabase.from('ssj_fillout_forms').select('*').eq('people_id', educatorId);
      let data: any[] | null = null;
      try {
        const r = await base().order('entry_date', { ascending: false });
        data = r.data as any[];
      } catch {
        try {
          const r1 = await base().order('date_submitted', { ascending: false });
          data = r1.data as any[];
        } catch {
          const r2 = await base().order('created_at', { ascending: false });
          data = r2.data as any[];
        }
      }
      // normalize keys expected by renderer (camelCase)
      return ((data || []) as any[]).map((r: any) => ({
        id: r.id,
        formVersion: r.form_version ?? r.formVersion,
        dateSubmitted: r.entry_date ?? r.date_submitted ?? r.dateSubmitted,
        contactTypeStandardized: r.contact_type_standardized ?? r.contactTypeStandardized,
        firstName: r.first_name ?? r.firstName,
        lastName: r.last_name ?? r.lastName,
        email: r.email,
        city: r.city,
        cityStandardized: r.city_standardized ?? r.cityStandardized,
        state: r.state,
        stateStandardized: r.state_standardized ?? r.stateStandardized,
        country: r.country,
        targetGeo: r.target_geo ?? r.targetGeo,
        raceEthnicity: r.socioeconomic_race_ethnicity ?? r.race_ethnicity ?? r.raceEthnicity,
        raceEthnicityOther: r.socioeconomic_race_ethnicity_other ?? r.raceEthnicityOther,
        lgbtqia: r.socioeconomic_lgbtqia_identifying ?? r.lgbtqia,
        pronouns: r.socioeconomic_pronouns ?? r.pronouns,
        pronounsOther: r.socioeconomic_pronouns_other ?? r.pronounsOther,
        gender: r.socioeconomic_gender ?? r.gender,
        genderStandardized: r.gender_standardized ?? r.genderStandardized,
        // add any other fields as needed
      }));
    },
  });

  // Sort submissions newest first and store selection
  const sorted = useMemo(() => {
    return [...(forms || [])].sort((a, b) => {
      const da = a?.dateSubmitted ? new Date(a.dateSubmitted).getTime() : 0;
      const db = b?.dateSubmitted ? new Date(b.dateSubmitted).getTime() : 0;
      return db - da;
    });
  }, [forms]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (!sorted || sorted.length === 0) { setSelectedId(null); return; }
    setSelectedId(sorted[0].id);
  }, [sorted]);

  const selected = useMemo(() => sorted.find(f => f.id === selectedId) || null, [sorted, selectedId]);

  const yesNo = (v: any) => v === true ? 'Yes' : (v === false ? 'No' : '');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="text-sm text-slate-600 font-medium">Select submission:</div>
        <Select value={selectedId ?? ''} onValueChange={(val) => setSelectedId(val)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder={isLoading ? 'Loading…' : (sorted.length ? 'Choose submission' : 'No submissions')} />
          </SelectTrigger>
          <SelectContent>
            {sorted.map((f) => {
              const dateLabel = f.dateSubmitted ? new Date(f.dateSubmitted).toLocaleString() : '(no date)';
              const version = f.formVersion ? ` • ${f.formVersion}` : '';
              const label = `${dateLabel}${version}`;
              return (
                <SelectItem key={f.id} value={f.id}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {!selected && !isLoading && (
        <div className="text-sm text-slate-500">No submission selected.</div>
      )}

      {selected && (
        <DetailGrid>
          <InfoCard title="Details" editable={false} columns={2}
            fields={[
              { key: 'formVersion', label: 'Form Version', value: selected.formVersion },
              { key: 'dateSubmitted', label: 'Date Submitted', value: selected.dateSubmitted },
              { key: 'contactTypeStandardized', label: 'Contact Type (Std)', value: selected.contactTypeStandardized },
            ]}
          />

          <InfoCard title="Name & Contact" editable={false} columns={3}
            fields={[
              { key: 'firstName', label: 'First Name', value: selected.firstName },
              { key: 'lastName', label: 'Last Name', value: selected.lastName },
              { key: 'email', label: 'Email', value: selected.email },
              { key: 'city', label: 'City', value: selected.city },
              { key: 'cityStandardized', label: 'City (Std)', value: selected.cityStandardized },
              { key: 'state', label: 'State', value: selected.state },
              { key: 'stateStandardized', label: 'State (Std)', value: selected.stateStandardized },
              { key: 'country', label: 'Country', value: selected.country },
              { key: 'targetGeo', label: 'Target Geo', value: selected.targetGeo },
            ]}
          />

          <InfoCard title="Demographics" editable={false} columns={3}
            fields={[
              { key: 'raceEthnicity', label: 'Race/Ethnicity', value: selected.raceEthnicity },
              { key: 'raceEthnicityOther', label: 'Race/Ethnicity (Other)', value: selected.raceEthnicityOther },
              { key: 'lgbtqia', label: 'LGBTQIA+', value: yesNo(selected.lgbtqia) },
              { key: 'pronouns', label: 'Pronouns', value: selected.pronouns },
              { key: 'pronounsOther', label: 'Pronouns (Other)', value: selected.pronounsOther },
              { key: 'gender', label: 'Gender', value: selected.gender },
              { key: 'genderStandardized', label: 'Gender (Std)', value: selected.genderStandardized },
              { key: 'genderOther', label: 'Gender (Other)', value: selected.genderOther },
              { key: 'hhIncome', label: 'Household Income', value: selected.hhIncome },
              { key: 'primaryLanguage', label: 'Primary Language', value: selected.primaryLanguage },
              { key: 'primaryLanguageOther', label: 'Primary Language (Other)', value: selected.primaryLanguageOther },
            ]}
          />

          <InfoCard title="Message" editable={false} columns={1}
            fields={[{ key: 'message', label: 'Message', value: selected.message, type: 'readonly' }]}
          />

          {(selected.contactTypeStandardized === 'Educator') && (
            <InfoCard title="Initial Interests (Educator)" editable={false} columns={2}
              fields={[
                { key: 'isInterestedinCharter', label: 'Interested in Charter', value: yesNo(selected.isInterestedinCharter ?? (selected as any).initialEdInterestCharter) },
                { key: 'initialEdInterestsAge', label: 'Initial Interests Age', value: selected.initialEdInterestsAge },
                { key: 'initialEdInterestsEducators', label: 'Initial Interests Educators', value: selected.initialEdInterestsEducators },
                { key: 'initialEdInterestsEducatorsOther', label: 'Initial Interests Educators (Other)', value: selected.initialEdInterestsEducatorsOther },
              ]}
            />
          )}

          {(selected.contactTypeStandardized === 'Community member') && (
            <InfoCard title="Initial Interests (Community Member)" editable={false} columns={2}
              fields={[
                { key: 'commMemInterests', label: 'Interests', value: selected.commMemInterests },
                { key: 'commMemInterestsOther', label: 'Interests (Other)', value: selected.commMemInterestsOther },
                { key: 'commMemSupportFindingTeachers', label: 'Support Finding Teachers', value: yesNo(selected.commMemSupportFindingTeachers) },
                { key: 'commMemCommunityInfo', label: 'Community Info', value: selected.commMemCommunityInfo },
                { key: 'commMemSelfInfo', label: 'Self Info', value: selected.commMemSelfInfo },
              ]}
            />
          )}

          <InfoCard title="Montessori Certification (Overall)" editable={false} columns={2}
            fields={[
              { key: 'montessoriCertQuestion', label: 'Question', value: selected.montessoriCertQuestion },
              { key: 'certProcessingStatus', label: 'Processing Status', value: selected.certProcessingStatus },
              { key: 'isMontessoriCertified', label: 'Montessori Certified', value: yesNo(selected.isMontessoriCertified) },
              { key: 'isSeekingMontessoriCertification', label: 'Seeking Certification', value: yesNo(selected.isSeekingMontessoriCertification) },
            ]}
          />

          <InfoCard title="Montessori Certification (Temp Fields)" editable={false} columns={3}
            fields={[
              { key: 'temp1Cert', label: 'Temp 1 Cert', value: selected.temp1Cert },
              { key: 'temp2Cert', label: 'Temp 2 Cert', value: selected.temp2Cert },
              { key: 'temp3Cert', label: 'Temp 3 Cert', value: selected.temp3Cert },
              { key: 'temp4Cert', label: 'Temp 4 Cert', value: selected.temp4Cert },
              { key: 'temp1Level', label: 'Temp 1 Level', value: selected.temp1Level },
              { key: 'temp2Level', label: 'Temp 2 Level', value: selected.temp2Level },
              { key: 'temp3Level', label: 'Temp 3 Level', value: selected.temp3Level },
              { key: 'temp4Level', label: 'Temp 4 Level', value: selected.temp4Level },
              { key: 'temp1Year', label: 'Temp 1 Year', value: selected.temp1Year },
              { key: 'temp2Year', label: 'Temp 2 Year', value: selected.temp2Year },
              { key: 'temp3Year', label: 'Temp 3 Year', value: selected.temp3Year },
              { key: 'temp4Year', label: 'Temp 4 Year', value: selected.temp4Year },
            ]}
          />

          <InfoCard title="Montessori Certification (Processed Fields)" editable={false} columns={3}
            fields={[
              { key: 'montCert1Cert', label: 'Cert 1', value: selected.montCert1Cert },
              { key: 'montCert2Cert', label: 'Cert 2', value: selected.montCert2Cert },
              { key: 'montCert3Cert', label: 'Cert 3', value: selected.montCert3Cert },
              { key: 'montCert4Cert', label: 'Cert 4', value: selected.montCert4Cert },
              { key: 'montCert1Level', label: 'Level 1', value: selected.montCert1Level },
              { key: 'montCert2Level', label: 'Level 2', value: selected.montCert2Level },
              { key: 'montCert3Level', label: 'Level 3', value: selected.montCert3Level },
              { key: 'montCert4Level', label: 'Level 4', value: selected.montCert4Level },
              { key: 'montCert1Year', label: 'Year 1', value: selected.montCert1Year },
              { key: 'montCert2Year', label: 'Year 2', value: selected.montCert2Year },
              { key: 'montCert3Year', label: 'Year 3', value: selected.montCert3Year },
              { key: 'montCert4Year', label: 'Year 4', value: selected.montCert4Year },
            ]}
          />

          <InfoCard title="Marketing" editable={false} columns={2}
            fields={[
              { key: 'receiveComms', label: 'Receive Comms', value: yesNo(selected.receiveComms) },
              { key: 'source', label: 'Source', value: selected.source },
              { key: 'sourceOther', label: 'Source (Other)', value: selected.sourceOther },
              { key: 'mktgSource', label: 'Marketing Source', value: selected.mktgSource },
              { key: 'mktgSourceCampaign', label: 'Campaign', value: selected.mktgSourceCampaign },
            ]}
          />
        </DetailGrid>
      )}
    </div>
  );
}
