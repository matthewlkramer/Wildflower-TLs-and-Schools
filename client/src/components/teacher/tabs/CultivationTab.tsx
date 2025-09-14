/**
 * Educator “Cultivation” tab. Used primarily for prospects, it aggregates data
 * from initial interest forms and partner outreach. The tab shows the date of the
 * most recent SSJ Fillout form submission by scanning all provided `ssjForms`.
 * Additional fields pulled from the teacher record include source of contact,
 * stated interests, assigned partner, meeting preferences, support types needed,
 * routing information, one‑on‑one scheduling status, and whether a personal email
 * was sent. All content is read‑only, organized in three responsive columns so
 * staff can quickly gauge the prospect’s current state.
 */
// Types handled inline to avoid import issues
import { useQuery } from "@tanstack/react-query";
import { DetailGrid } from "@/components/shared/DetailGrid";
import { InfoCard } from "@/components/shared/InfoCard";
import { supabase } from "@/integrations/supabase/client";

function mostRecentFilloutDate(ssjForms: any[]) {
  const dates = (ssjForms || [])
    .map((f) => (f.dateSubmitted ?? f.entry_date ?? f.entryDate))
    .filter(Boolean)
    .map((d) => new Date(d as string))
    .filter((d) => !isNaN(d.getTime()));
  if (!dates.length) return null;
  const most = new Date(Math.max(...dates.map((d) => d.getTime())));
  return most.toLocaleDateString();
}

export function CultivationTab({ teacher, onSave }: { teacher: any; onSave?: (vals: any)=>void }) {
  const normalizeArray = (v: any): string[] => Array.isArray(v) ? v : (v ? String(v).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  const educatorId = teacher.id;
  const { data: ssjForms = [] } = useQuery<any[]>({
    queryKey: ["supabase/ssj_fillout_forms/educator", educatorId],
    enabled: !!educatorId,
    queryFn: async () => {
      const base = () => supabase
        .from('ssj_fillout_forms')
        .select('id, entry_date, date_submitted, created_at')
        .eq('people_id', educatorId);
      try {
        const { data } = await base().order('entry_date', { ascending: false });
        return data || [];
      } catch {
        try {
          const { data } = await base().order('date_submitted', { ascending: false });
          return data || [];
        } catch {
          const { data } = await base().order('created_at', { ascending: false });
          return data || [];
        }
      }
    },
  });
  return (
    <DetailGrid>
      <InfoCard
        title="Early Cultivation"
        description={`Most recent fillout: ${mostRecentFilloutDate(ssjForms) || '-'}`}
        columns={2}
        fields={[
          { key: 'sendGridTemplateSelected', label: 'SendGrid Template Selected', type: 'text', value: teacher?.sendGridTemplateSelected || teacher?.sendgridTemplateSelected || '' },
          { key: 'sendGridSendDate', label: 'SendGrid Send Date', type: 'date', value: teacher?.sendGridSendDate || '' },
          { key: 'routedTo', label: 'Routed To', type: 'text', value: teacher?.routedTo || '' },
          { key: 'assignedPartnerOverride', label: 'Assigned Partner Override', type: 'text', value: teacher?.assignedPartnerOverride || '' },
          { key: 'personResponsibleForFollowUp', label: 'Person Responsible for Follow Up', type: 'text', value: teacher?.personResponsibleForFollowUp || '' },
          { key: 'oneOnOneSchedulingStatus', label: 'One-on-One Scheduling Status', type: 'text', value: teacher?.oneOnOneSchedulingStatus || '' },
          { key: 'personalEmailSent', label: 'Personal Email Sent', type: 'toggle', value: !!teacher?.personalEmailSent },
          { key: 'personalEmailSentDate', label: 'Personal Email Sent Date', type: 'date', value: teacher?.personalEmailSentDate || '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="First Contact Interests"
        columns={2}
        fields={[
          { key: 'firstContactNotesOnPreWildflowerEmployment', label: 'Notes on Pre-Wildflower Employment', type: 'textarea', value: teacher?.firstContactNotesOnPreWildflowerEmployment || '' },
          { key: 'firstContactWfSchoolEmploymentStatus', label: 'WF School Employment Status', type: 'text', value: teacher?.firstContactWfSchoolEmploymentStatus || '' },
          { key: 'firstContactRelocate', label: 'Willingness to Relocate', type: 'text', value: teacher?.firstContactRelocate || '' },
          { key: 'firstContactGovernance', label: 'Interest in Governance Model', type: 'multiselect', value: Array.isArray(teacher?.firstContactGovernance) ? teacher.firstContactGovernance : (teacher?.firstContactGovernance ? String(teacher.firstContactGovernance).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'firstContactAges', label: 'Ages of Interest', type: 'multiselect', value: Array.isArray(teacher?.firstContactAges) ? teacher.firstContactAges : (teacher?.firstContactAges ? String(teacher.firstContactAges).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'firstContactInterests', label: 'Interests', type: 'textarea', value: teacher?.firstContactInterests || '' },
        ]}
        onSave={(vals) => onSave?.({
          ...vals,
          ...(vals.firstContactGovernance !== undefined ? { firstContactGovernance: normalizeArray(vals.firstContactGovernance) } : {}),
          ...(vals.firstContactAges !== undefined ? { firstContactAges: normalizeArray(vals.firstContactAges) } : {}),
        })}
      />

      <InfoCard
        title="Ops Guide"
        columns={2}
        fields={[
          { key: 'opsGuideMeetingPrefTime', label: 'Meeting Preference Time', type: 'text', value: teacher?.opsGuideMeetingPrefTime || '' },
          { key: 'opsGuideSpecificsChecklist', label: 'Specifics Checklist', type: 'multiselect', value: Array.isArray(teacher?.opsGuideSpecificsChecklist) ? teacher.opsGuideSpecificsChecklist : (teacher?.opsGuideSpecificsChecklist ? String(teacher.opsGuideSpecificsChecklist).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'opsGuideReqPertinentInfo', label: 'Request Pertinent Info', type: 'multiselect', value: Array.isArray(teacher?.opsGuideReqPertinentInfo) ? teacher.opsGuideReqPertinentInfo : (teacher?.opsGuideReqPertinentInfo ? String(teacher.opsGuideReqPertinentInfo).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'opsGuideSupportTypeNeeded', label: 'Support Type Needed', type: 'multiselect', value: Array.isArray(teacher?.opsGuideSupportTypeNeeded) ? teacher.opsGuideSupportTypeNeeded : (teacher?.opsGuideSupportTypeNeeded ? String(teacher.opsGuideSupportTypeNeeded).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'opsGuideFundraisingOps', label: 'Fundraising Opportunities', type: 'text', value: teacher?.opsGuideFundraisingOps || teacher?.opsGuideFundrasingOps || '' },
        ]}
        onSave={(vals) => onSave?.({
          ...vals,
          ...(vals.opsGuideSpecificsChecklist !== undefined ? { opsGuideSpecificsChecklist: normalizeArray(vals.opsGuideSpecificsChecklist) } : {}),
          ...(vals.opsGuideReqPertinentInfo !== undefined ? { opsGuideReqPertinentInfo: normalizeArray(vals.opsGuideReqPertinentInfo) } : {}),
          ...(vals.opsGuideSupportTypeNeeded !== undefined ? { opsGuideSupportTypeNeeded: normalizeArray(vals.opsGuideSupportTypeNeeded) } : {}),
        })}
      />
    </DetailGrid>
  );
}
