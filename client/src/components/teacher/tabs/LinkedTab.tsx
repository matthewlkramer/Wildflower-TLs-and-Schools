/**
 * Educator “Linked” tab. Summarizes connections to external systems. Current
 * fields include a boolean for whether the educator has an active Holaspirit
 * account, the Holaspirit member id, and the Teacher Credentials (TC) user id.
 * The tab renders these values in a simple two‑column layout and does not allow
 * editing; it is purely informational for cross‑system audits.
 */
import type { Teacher } from "@shared/schema.generated";

export function LinkedTab({ teacher }: { teacher: Teacher }) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-slate-900">Linked Email & Meetings</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 text-sm">
          <p><span className="text-slate-600">Active Holaspirit:</span> {(teacher as any).activeHolaspirit ? 'Yes' : 'No'}</p>
          <p><span className="text-slate-600">Holaspirit Member ID:</span> {(teacher as any).holaspiritMemberID || '-'}</p>
          <p><span className="text-slate-600">TC User ID:</span> {(teacher as any).tcUserID || '-'}</p>
        </div>
      </div>
    </div>
  );
}

