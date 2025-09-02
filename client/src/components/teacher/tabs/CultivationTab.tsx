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

export function CultivationTab({ teacher, ssjForms }: { teacher: Teacher; ssjForms: SSJFilloutForm[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-slate-900 mb-4">Early Cultivation Data</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-600">Date of Most Recent Fillout Form:</span> {mostRecentFilloutDate(ssjForms) || '-'}</p>
            <p><span className="text-slate-600">Source:</span> {(teacher as any)?.source || '-'}</p>
            <p><span className="text-slate-600">Interests:</span> {(teacher as any)?.firstContactInterests || '-'}</p>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-600">Partner:</span> {Array.isArray((teacher as any)?.assignedPartner) ? (teacher as any).assignedPartner.join(', ') : (teacher as any)?.assignedPartner || '-'}</p>
            <p><span className="text-slate-600">Meeting Pref:</span> {(teacher as any)?.opsGuideMeetingPrefTime || '-'}</p>
            <p><span className="text-slate-600">Support Types:</span> {Array.isArray((teacher as any)?.opsGuideSupportTypeNeeded) ? (teacher as any).opsGuideSupportTypeNeeded.join(', ') : (teacher as any)?.opsGuideSupportTypeNeeded || '-'}</p>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-600">Routing:</span> {(teacher as any)?.routedTo || '-'}</p>
            <p><span className="text-slate-600">One‑on‑one Scheduling:</span> {(teacher as any)?.oneOnOneSchedulingStatus || '-'}</p>
            <p><span className="text-slate-600">Personal Email Sent:</span> {(teacher as any)?.personalEmailSent ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

