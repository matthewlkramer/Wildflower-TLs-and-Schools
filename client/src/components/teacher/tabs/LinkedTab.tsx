import type { Teacher } from "@shared/schema";

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

