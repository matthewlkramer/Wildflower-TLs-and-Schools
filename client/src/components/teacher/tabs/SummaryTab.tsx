/**
 * Educator “Summary” tab. A snapshot view composed of three cards: basic info
 * (name, current role, discovery status), education & certification (currently
 * only a Montessori certified yes/no badge), and school connection (whether the
 * educator is active at a school, the name of the school, and the
 * stage/status). Badges are colored via `getStatusColor` for quick visual cues.
 * All data is read from the `teacher` object and displayed read‑only.
 */
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
// Types handled inline to avoid import issues
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SummaryTab({ teacher }: { teacher: any }) {
  const educatorId = (teacher as any)?.id;
  const { data: activeAssoc } = useQuery<any | null>({
    queryKey: ["supabase/details_associations/active/byEducator", educatorId],
    enabled: !!educatorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('details_associations')
        .select('*')
        .eq('people_id', educatorId)
        .eq('currently_active', true)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return data as any;
    }
  });
  const currentRole = (Array.isArray(activeAssoc?.role) ? activeAssoc?.role.join(', ') : (activeAssoc?.role || '')) || (Array.isArray((teacher as any)?.currentRole) ? (teacher as any)?.currentRole.join(', ') : ((teacher as any)?.currentRole || ''));
  const currentSchool = activeAssoc?.school_name || (Array.isArray((teacher as any)?.activeSchool) ? (teacher as any)?.activeSchool.join(', ') : ((teacher as any)?.activeSchool || ''));
  const stageStatus = activeAssoc?.stage_status || (Array.isArray((teacher as any)?.activeSchoolStageStatus) ? (teacher as any)?.activeSchoolStageStatus.join(', ') : ((teacher as any)?.activeSchoolStageStatus || ''));
  const montessoriCertified = (teacher as any)?.montessoriCertified ?? (teacher as any)?.has_montessori_cert ?? false;
  const currentlyActiveAtSchool = (teacher as any)?.currentlyActiveAtSchool ?? (teacher as any)?.currently_active_at_school ?? !!activeAssoc;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">Basic Info</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-600">Name:</span> {(teacher as any).full_name}</p>
            <p><span className="text-slate-600">Current Role:</span> {currentRole || '-'}</p>
            <div><span className="text-slate-600">Discovery Status:</span> <Badge className={getStatusColor(((teacher as any).discovery_status || '') as any)}>{(teacher as any).discovery_status || '-'}</Badge></div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">Education & Certs</h4>
          <div className="space-y-1 text-sm">
            <div><span className="text-slate-600">Montessori Certified:</span> <Badge className={montessoriCertified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{montessoriCertified ? 'Yes' : 'No'}</Badge></div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">School Connection</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-600">Currently Active:</span> {currentlyActiveAtSchool ? 'Yes' : 'No'}</p>
            <p><span className="text-slate-600">Current School:</span> {currentSchool || '-'}</p>
            <div><span className="text-slate-600">Stage/Status:</span> <Badge className={getStatusColor(stageStatus || '')}>{stageStatus || '-'}</Badge></div>
          </div>
        </div>
      </div>
    </div>
  );
}
