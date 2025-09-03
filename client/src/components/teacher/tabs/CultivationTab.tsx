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
import type { SSJFilloutForm, Teacher } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { DetailGrid } from "@/components/shared/DetailGrid";
import { InfoCard } from "@/components/shared/InfoCard";

function mostRecentFilloutDate(ssjForms: SSJFilloutForm[]) {
  const dates = (ssjForms || [])
    .map((f) => f.dateSubmitted)
    .filter(Boolean)
    .map((d) => new Date(d as string))
    .filter((d) => !isNaN(d.getTime()));
  if (!dates.length) return null;
  const most = new Date(Math.max(...dates.map((d) => d.getTime())));
  return most.toLocaleDateString();
}

export function CultivationTab({ teacher, onSave }: { teacher: Teacher; onSave?: (vals: any)=>void }) {
  const educatorId = teacher.id;
  const { data: ssjForms = [] } = useQuery<SSJFilloutForm[]>({
    queryKey: ["/api/ssj-fillout-forms/educator", educatorId],
    queryFn: async () => {
      const response = await fetch(`/api/ssj-fillout-forms/educator/${educatorId}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch SSJ fillout forms');
      return response.json();
    },
    enabled: !!educatorId,
  });
  return (
    <DetailGrid>
      <InfoCard
        title="Early Cultivation"
        description={`Most recent fillout: ${mostRecentFilloutDate(ssjForms) || '-'}`}
        columns={2}
        fields={[
          { key: 'sendGridTemplateSelected', label: 'SendGrid Template Selected', type: 'text', value: (teacher as any)?.sendGridTemplateSelected || (teacher as any)?.sendgridTemplateSelected || '' },
          { key: 'sendGridSendDate', label: 'SendGrid Send Date', type: 'date', value: (teacher as any)?.sendGridSendDate || '' },
          { key: 'routedTo', label: 'Routed To', type: 'text', value: (teacher as any)?.routedTo || '' },
          { key: 'assignedPartnerOverride', label: 'Assigned Partner Override', type: 'text', value: (teacher as any)?.assignedPartnerOverride || '' },
          { key: 'personResponsibleForFollowUp', label: 'Person Responsible for Follow Up', type: 'text', value: (teacher as any)?.personResponsibleForFollowUp || '' },
          { key: 'oneOnOneSchedulingStatus', label: 'One-on-One Scheduling Status', type: 'text', value: (teacher as any)?.oneOnOneSchedulingStatus || '' },
          { key: 'personalEmailSent', label: 'Personal Email Sent', type: 'toggle', value: !!(teacher as any)?.personalEmailSent },
          { key: 'personalEmailSentDate', label: 'Personal Email Sent Date', type: 'date', value: (teacher as any)?.personalEmailSentDate || '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="First Contact Interests"
        columns={2}
        fields={[
          { key: 'firstContactNotesOnPreWildflowerEmployment', label: 'Notes on Pre-Wildflower Employment', type: 'textarea', value: (teacher as any)?.firstContactNotesOnPreWildflowerEmployment || '' },
          { key: 'firstContactWFSchoolEmploymentStatus', label: 'WF School Employment Status', type: 'text', value: (teacher as any)?.firstContactWFSchoolEmploymentStatus || '' },
          { key: 'firstContactRelocate', label: 'Willingness to Relocate', type: 'text', value: (teacher as any)?.firstContactRelocate || '' },
          { key: 'firstContactGovernance', label: 'Interest in Governance Model', type: 'multiselect', value: Array.isArray((teacher as any)?.firstContactGovernance) ? (teacher as any).firstContactGovernance : ((teacher as any)?.firstContactGovernance ? String((teacher as any).firstContactGovernance).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'firstContactAges', label: 'Ages of Interest', type: 'multiselect', value: Array.isArray((teacher as any)?.firstContactAges) ? (teacher as any).firstContactAges : ((teacher as any)?.firstContactAges ? String((teacher as any).firstContactAges).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'firstContactInterests', label: 'Interests', type: 'textarea', value: (teacher as any)?.firstContactInterests || '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Ops Guide"
        columns={2}
        fields={[
          { key: 'opsGuideMeetingPrefTime', label: 'Meeting Preference Time', type: 'text', value: (teacher as any)?.opsGuideMeetingPrefTime || '' },
          { key: 'opsGuideSpecificsChecklist', label: 'Specifics Checklist', type: 'multiselect', value: Array.isArray((teacher as any)?.opsGuideSpecificsChecklist) ? (teacher as any).opsGuideSpecificsChecklist : ((teacher as any)?.opsGuideSpecificsChecklist ? String((teacher as any).opsGuideSpecificsChecklist).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'opsGuideReqPertinentInfo', label: 'Request Pertinent Info', type: 'multiselect', value: Array.isArray((teacher as any)?.opsGuideReqPertinentInfo) ? (teacher as any).opsGuideReqPertinentInfo : ((teacher as any)?.opsGuideReqPertinentInfo ? String((teacher as any).opsGuideReqPertinentInfo).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'opsGuideSupportTypeNeeded', label: 'Support Type Needed', type: 'multiselect', value: Array.isArray((teacher as any)?.opsGuideSupportTypeNeeded) ? (teacher as any).opsGuideSupportTypeNeeded : ((teacher as any)?.opsGuideSupportTypeNeeded ? String((teacher as any).opsGuideSupportTypeNeeded).split(',').map((s:string)=>s.trim()) : []) },
          { key: 'opsGuideFundraisingOps', label: 'Fundraising Opportunities', type: 'text', value: (teacher as any)?.opsGuideFundraisingOps || (teacher as any)?.opsGuideFundrasingOps || '' },
        ]}
        onSave={onSave}
      />
    </DetailGrid>
  );
}

