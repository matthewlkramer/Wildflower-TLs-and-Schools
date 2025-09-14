import React from 'react';
// Types handled inline to avoid import issues
import { DetailGrid } from '@/components/shared/DetailGrid';
import { InfoCard } from '@/components/shared/InfoCard';

export function DetailsTab({ school, onSave }: { school: any; onSave?: (vals: any) => void }) {
  const normalizeArray = (v: any): string[] => Array.isArray(v) ? v : (v ? String(v).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  return (
    <DetailGrid>
      <InfoCard title="Logos" columns={2} editable={true} fields={[
        { key: 'logo', label: 'Logo (Main URL)', type: 'text', value: (school as any).logo || '', render: (url: string) => url ? (<img src={url} alt="Logo" className="h-16 w-auto rounded border" />) : (<span className="text-slate-400">-</span>) },
        { key: 'logoMainSquare', label: 'Logo - Main Square', type: 'text', value: (school as any).logoMainSquare || '', render: (url: string) => url ? (<img src={url} alt="Logo Square" className="h-16 w-16 object-contain rounded border" />) : (<span className="text-slate-400">-</span>) },
        { key: 'logoFlowerOnly', label: 'Logo - Flower Only', type: 'text', value: (school as any).logoFlowerOnly || '', render: (url: string) => url ? (<img src={url} alt="Logo Flower" className="h-16 w-16 object-contain rounded border" />) : (<span className="text-slate-400">-</span>) },
        { key: 'logoMainRectangle', label: 'Logo - Main Rectangle', type: 'text', value: (school as any).logoMainRectangle || '', render: (url: string) => url ? (<img src={url} alt="Logo Rectangle" className="h-16 w-auto object-contain rounded border" />) : (<span className="text-slate-400">-</span>) },
        { key: 'logoUrl', label: 'Logo URL (alt)', type: 'text', value: (school as any).logoUrl || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{url}</a>) : (<span className="text-slate-400">-</span>) },
      ]} />
      <InfoCard title="Name" columns={2} fields={[
        { key: 'name', label: 'School Name', type: 'text', value: school.name },
        { key: 'shortName', label: 'Short Name', type: 'text', value: school.shortName || '' },
        { key: 'priorNames', label: 'Prior Names', type: 'text', value: school.priorNames || '' },
      ]} />

      <InfoCard title="Program Details" columns={2} fields={[
        { key: 'governanceModel', label: 'Governance', type: 'text', value: school.governanceModel || '' },
        { key: 'agesServed', label: 'Ages Served', type: 'multiselect', value: Array.isArray(school.agesServed) ? school.agesServed : (school.agesServed ? [school.agesServed as unknown as string] : []) },
        { key: 'programFocus', label: 'Program Focus', type: 'multiselect', value: Array.isArray(school.programFocus) ? school.programFocus : (school.programFocus ? [school.programFocus as unknown as string] : []) },
        { key: 'numberOfClassrooms', label: 'Number of Classrooms', type: 'text', value: school.numberOfClassrooms ?? '' },
        { key: 'enrollmentCap', label: 'Enrollment Capacity', type: 'text', value: school.enrollmentCap ?? '' },
        { key: 'schoolCalendar', label: 'School Calendar', type: 'text', value: (school as any).schoolCalendar ?? '' },
        { key: 'schoolSchedule', label: 'School Schedule', type: 'text', value: (school as any).schoolSchedule ?? '' },
      ]}
      onSave={(vals) => onSave?.({
        ...vals,
        ...(vals.agesServed !== undefined ? { agesServed: normalizeArray(vals.agesServed) } : {}),
        ...(vals.programFocus !== undefined ? { programFocus: normalizeArray(vals.programFocus) } : {}),
      })}
      />

      <PublicFundingCard schoolId={school.id} linkedIds={Array.isArray(school.publicFundingSources) ? school.publicFundingSources : []} />

      <InfoCard title="Legal Entity Structure" columns={2} fields={[
        { key: 'legalStructure', label: 'Legal Structure', type: 'text', value: school.legalStructure || '' },
        { key: 'legalName', label: 'Legal Name', type: 'text', value: school.legalName || '' },
        { key: 'ein', label: 'EIN', type: 'text', value: (school as any).ein || '' },
        { key: 'incorporationDate', label: 'Incorporation Date', type: 'text', value: (school as any).incorporationDate || '' },
        { key: 'currentFyEnd', label: 'Current FY End', type: 'text', value: (school as any).currentFyEnd || '' },
        { key: 'institutionalPartner', label: 'Institutional Partner', type: 'text', value: (school as any).institutionalPartner || '' },
      ]} />

      <InfoCard title="Nonprofit Status" columns={2} fields={[
        { key: 'nonprofitStatus', label: 'Nonprofit Status', type: 'text', value: (school as any).nonprofitStatus || '' },
        { key: 'groupExemptionStatus', label: 'Group Exemption Status', type: 'text', value: (school as any).groupExemptionStatus || '' },
        { key: 'dateReceivedGroupExemption', label: 'Date Granted', type: 'text', value: (school as any).dateReceivedGroupExemption || '' },
        { key: 'dateWithdrawnGroupExemption', label: 'Date Withdrawn', type: 'text', value: (school as any).dateWithdrawnGroupExemption || '' },
      ]} />

      <InfoCard title="School Contact Information" columns={2} fields={[
        { key: 'schoolPhone', label: 'School Phone', type: 'text', value: (school as any).schoolPhone || '' },
        { key: 'schoolEmail', label: 'School Email', type: 'text', value: (school as any).schoolEmail || '' },
      ]} />

      <InfoCard title="Membership" columns={2} fields={[
        { key: 'membershipStatus', label: 'Membership Status', type: 'text', value: school.membershipStatus || '' },
        { key: 'membershipAgreementDate', label: 'Agreement Date', type: 'date', value: (school as any).membershipAgreementDate || '' },
        { key: 'agreementVersion', label: 'Agreement Version', type: 'text', value: (school as any).agreementVersion || '' },
        { key: 'signedMembershipAgreement', label: 'Signed Membership Agreement', type: 'text', value: (school as any).signedMembershipAgreement || '' },
        { key: 'leftNetworkDate', label: 'Left Network Date', type: 'date', value: (school as any).leftNetworkDate || '' },
        { key: 'leftNetworkReason', label: 'Left Network Reason', type: 'text', value: (school as any).leftNetworkReason || '' },
        { key: 'membershipTerminationLetter', label: 'Termination Letter', type: 'text', value: (school as any).membershipTerminationLetter || '' },
      ]} />

      <InfoCard title="Online Presence" columns={1} editable={true} fields={[
        { key: 'website', label: 'Website', type: 'text', value: school.website || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
        { key: 'instagram', label: 'Instagram', type: 'text', value: (school as any).instagram || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
        { key: 'facebook', label: 'Facebook', type: 'text', value: (school as any).facebook || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
      ]} />
    </DetailGrid>
  );
}

function PublicFundingCard({ schoolId, linkedIds }: { schoolId: string; linkedIds: string[] }) {
  const [names, setNames] = React.useState<string[] | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Supabase: public funding by school_id
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase
          .from('public_funding')
          .select('*')
          .eq('school_id', schoolId)
          .order('name', { ascending: true });
        if (error) throw error;
        const list = Array.isArray(data) ? data.map((r: any) => r?.name || r?.title || '').filter(Boolean) : [];
        if (!cancelled) setNames(list);
        return;
      } catch {}
      // Fallback: just show IDs if we can't resolve
      if (!cancelled) setNames(linkedIds);
    };
    load();
    return () => { cancelled = true; };
  }, [schoolId, JSON.stringify(linkedIds)]);

  return (
    <InfoCard title="Public Sources of Funding" columns={2} fields={[
      { key: 'publicFundingSources', label: 'Public Funding Sources', type: 'readonly', value: names ?? [] },
    ]} />
  );
}
