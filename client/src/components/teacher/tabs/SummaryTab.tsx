import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import type { Teacher } from "@shared/schema";

export function SummaryTab({ teacher }: { teacher: Teacher }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">Basic Info</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-600">Name:</span> {teacher.fullName}</p>
            <p><span className="text-slate-600">Current Role:</span> {teacher.currentRole ? (Array.isArray(teacher.currentRole) ? teacher.currentRole.join(', ') : (teacher.currentRole as any)) : '-'}</p>
            <div><span className="text-slate-600">Discovery Status:</span> <Badge className={getStatusColor(teacher.discoveryStatus || '')}>{teacher.discoveryStatus || '-'}</Badge></div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">Education & Certs</h4>
          <div className="space-y-1 text-sm">
            <div><span className="text-slate-600">Montessori Certified:</span> <Badge className={teacher.montessoriCertified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{teacher.montessoriCertified ? 'Yes' : 'No'}</Badge></div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">School Connection</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-600">Currently Active:</span> {(teacher as any).currentlyActiveAtSchool ? 'Yes' : 'No'}</p>
            <p><span className="text-slate-600">Current School:</span> {teacher.activeSchool ? (Array.isArray(teacher.activeSchool) ? teacher.activeSchool.join(', ') : (teacher.activeSchool as any)) : '-'}</p>
            <div><span className="text-slate-600">Stage/Status:</span> <Badge className={getStatusColor(teacher.activeSchoolStageStatus ? (Array.isArray(teacher.activeSchoolStageStatus) ? teacher.activeSchoolStageStatus[0] : (teacher.activeSchoolStageStatus as any)) : '')}>{teacher.activeSchoolStageStatus ? (Array.isArray(teacher.activeSchoolStageStatus) ? teacher.activeSchoolStageStatus.join(', ') : (teacher.activeSchoolStageStatus as any)) : '-'}</Badge></div>
          </div>
        </div>
      </div>
    </div>
  );
}

