import React from 'react';
import type { School } from '@shared/schema';
import { DetailGrid } from '@/components/shared/DetailGrid';
import { InfoCard } from '@/components/shared/InfoCard';

export function DetailsTab({ school }: { school: School }) {
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
        { key: 'shortName', label: 'Short Name', type: 'text', value: (school as any).shortName || '' },
        { key: 'priorNames', label: 'Prior Names', type: 'text', value: (school as any).priorNames || '' },
      ]} />

      <InfoCard title="Program Details" columns={2} fields={[
        { key: 'governanceModel', label: 'Governance', type: 'text', value: (school as any).governanceModel || '' },
        { key: 'agesServed', label: 'Ages Served', type: 'text', value: Array.isArray((school as any).agesServed) ? (school as any).agesServed.join(', ') : ((school as any).agesServed || '') },
        { key: 'programFocus', label: 'Program Focus', type: 'text', value: Array.isArray((school as any).programFocus) ? (school as any).programFocus.join(', ') : ((school as any).programFocus || '') },
        { key: 'numberOfClassrooms', label: 'Number of Classrooms', type: 'text', value: (school as any).numberOfClassrooms ?? '' },
        { key: 'enrollmentCap', label: 'Enrollment Capacity', type: 'text', value: (school as any).enrollmentCap ?? '' },
        { key: 'schoolCalendar', label: 'School Calendar', type: 'text', value: (school as any).schoolCalendar ?? '' },
        { key: 'schoolSchedule', label: 'School Schedule', type: 'text', value: (school as any).schoolSchedule ?? '' },
      ]} />

      <PublicFundingCard schoolId={school.id} linkedIds={Array.isArray((school as any).publicFundingSources) ? (school as any).publicFundingSources : []} />

      <InfoCard title="Legal Entity Structure" columns={2} fields={[
        { key: 'legalStructure', label: 'Legal Structure', type: 'text', value: (school as any).legalStructure || '' },
        { key: 'legalName', label: 'Legal Name', type: 'text', value: (school as any).legalName || '' },
        { key: 'EIN', label: 'EIN', type: 'text', value: (school as any).EIN || '' },
        { key: 'incorporationDate', label: 'Incorporation Date', type: 'text', value: (school as any).incorporationDate || '' },
        { key: 'currentFYEnd', label: 'Current FY End', type: 'text', value: (school as any).currentFYEnd || '' },
        { key: 'institutionalPartner', label: 'Institutional Partner', type: 'text', value: (school as any).institutionalPartner || '' },
      ]} />

      <InfoCard title="Nonprofit Status" columns={2} fields={[
        { key: 'nonprofitStatus', label: 'Nonprofit Status', type: 'text', value: (school as any).nonprofitStatus || '' },
        { key: 'groupExemptionStatus', label: 'Group Exemption Status', type: 'text', value: (school as any).groupExemptionStatus || '' },
        { key: 'dateReceivedGroupExemption', label: 'Date Granted', type: 'text', value: (school as any).dateReceivedGroupExemption || '' },
        { key: 'dateWithdrawnGroupExemption', label: 'Date Withdrawn', type: 'text', value: (school as any).dateWithdrawnGroupExemption || '' },
      ]} />

      <InfoCard title="School Contact Information" columns={2} fields={[
        { key: 'phone', label: 'School Phone', type: 'text', value: (school as any).phone || '' },
        { key: 'email', label: 'School Email', type: 'text', value: (school as any).email || '' },
      ]} />

      <InfoCard title="Membership" columns={2} fields={[
        { key: 'membershipStatus', label: 'Membership Status', type: 'text', value: (school as any).membershipStatus || '' },
        { key: 'membershipAgreementDate', label: 'Agreement Date', type: 'date', value: (school as any).membershipAgreementDate || '' },
        { key: 'agreementVersion', label: 'Agreement Version', type: 'text', value: (school as any).agreementVersion || '' },
        { key: 'signedMembershipAgreement', label: 'Signed Membership Agreement', type: 'text', value: (school as any).signedMembershipAgreement || '' },
        { key: 'leftNetworkDate', label: 'Left Network Date', type: 'date', value: (school as any).leftNetworkDate || '' },
        { key: 'leftNetworkReason', label: 'Left Network Reason', type: 'text', value: (school as any).leftNetworkReason || '' },
        { key: 'membershipTerminationLetter', label: 'Termination Letter', type: 'text', value: (school as any).membershipTerminationLetter || '' },
      ]} />

      <InfoCard title="Online Presence" columns={1} editable={true} fields={[
        { key: 'website', label: 'Website', type: 'text', value: (school as any).website || '', render: (url: string) => url ? (<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>) : (<span className="text-slate-400">-</span>) },
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
        // Try to fetch by school link first
        const res = await fetch(`/api/subtable/Public%20funding?school_id=${encodeURIComponent(schoolId)}`, { credentials: 'include' });
        if (res.ok) {
          const items = await res.json();
          const list = Array.isArray(items) ? items.map((r: any) => r?.name || r?.Name || r?.title || '').filter(Boolean) : [];
          if (!cancelled) setNames(list);
          return;
        }
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
