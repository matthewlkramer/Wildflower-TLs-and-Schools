import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

type PromptRow = {
  id: string;
  location_id?: string | null;
  school_id?: string | null;
  charter_id?: string | null;
  status?: string | null; // 'pending' | 'applied' | 'dismissed'
  old_value?: string | null;
  proposed_value?: string | null;
  created_at?: string | null;
};

export function LocationPromptListener() {
  const [path] = useLocation();
  const [queue, setQueue] = useState<PromptRow[]>([]);
  const [open, setOpen] = useState(false);

  const scope = useMemo(() => {
    // Scope prompts to the current entity context to avoid global popups
    // Supports /school/:id and /charter/:id
    const schoolMatch = path.match(/^\/school\/([^/]+)/);
    if (schoolMatch) return { schoolId: schoolMatch[1] } as const;
    const charterMatch = path.match(/^\/charter\/([^/]+)/);
    if (charterMatch) return { charterId: charterMatch[1] } as const;
    return {} as const;
  }, [path]);

  // Fetch existing pending prompts for scope
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!('schoolId' in scope) && !('charterId' in scope)) return;
        let q = supabase
          .from('location_prompts')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: true });
        if ('schoolId' in scope) q = q.eq('school_id', (scope as any).schoolId);
        if ('charterId' in scope) q = q.eq('charter_id', (scope as any).charterId);
        const { data, error } = await q;
        if (error) throw error;
        if (!cancelled) {
          setQueue((data as PromptRow[]) || []);
          if ((data || []).length > 0) setOpen(true);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [scope]);

  // Subscribe for new pending prompts in scope
  useEffect(() => {
    if (!('schoolId' in scope) && !('charterId' in scope)) return;
    const channel = supabase
      .channel('location_prompts_listener')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'location_prompts' }, (payload: any) => {
        const row = (payload?.new || payload?.record) as PromptRow | undefined;
        if (!row) return;
        if (row.status !== 'pending') return;
        if ('schoolId' in scope && row.school_id && row.school_id !== (scope as any).schoolId) return;
        if ('charterId' in scope && row.charter_id && row.charter_id !== (scope as any).charterId) return;
        setQueue(prev => {
          if (prev.some(p => p.id === row.id)) return prev;
          const next = [...prev, row].sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
          return next;
        });
        setOpen(true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [scope]);

  const current = queue[0];

  const resolvePrompt = async (accept: boolean) => {
    if (!current) return;
    try {
      if (accept && current.location_id && current.proposed_value) {
        await supabase
          .from('locations')
          .update({ end_date: current.proposed_value })
          .eq('id', current.location_id);
      }
      await supabase
        .from('location_prompts')
        .update({ status: accept ? 'applied' : 'dismissed', resolved_at: new Date().toISOString() })
        .eq('id', current.id);
    } catch {}
    finally {
      setQueue(prev => prev.filter(p => p.id !== current.id));
      if (queue.length <= 1) setOpen(false);
    }
  };

  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={(o)=> setOpen(o)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change end date?</DialogTitle>
        </DialogHeader>
        <div className="text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Current</span>
            <span className="font-medium">{current.old_value ?? '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Proposed</span>
            <span className="font-medium">{current.proposed_value ?? '-'}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => resolvePrompt(false)}>Dismiss</Button>
          <Button onClick={() => resolvePrompt(true)}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

