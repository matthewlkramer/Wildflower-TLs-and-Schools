import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type PromptRow = {
  id: string;
  school_id?: string | null;
  status?: string | null; // 'pending' | 'applied' | 'dismissed'
  old_value?: string | null;
  proposed_value?: string | null;
  target_column?: string | null;
  date_column?: string | null;
  user_id?: string | null;
  people_id?: string | null;
  email?: string | null;
  created_at?: string | null;
};

export function SchoolStatusPromptListener() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<PromptRow[]>([]);
  const [open, setOpen] = useState(false);

  const scopeFilters = useMemo(() => {
    if (!user) return '';
    const parts: string[] = [];
    // Try common scope columns
    parts.push(`user_id.eq.${user.id}`);
    parts.push(`people_id.eq.${user.id}`);
    if (user.email) parts.push(`email.eq.${user.email}`);
    return parts.join(',');
  }, [user]);

  // Fetch existing pending prompts on mount/auth
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      try {
        let q = supabase
          .from('school_status_prompts')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: true });
        if (scopeFilters) {
          q = q.or(scopeFilters);
        }
        const { data, error } = await q;
        if (error) throw error;
        if (!cancelled) {
          setQueue((data as PromptRow[]) || []);
          if ((data || []).length > 0) setOpen(true);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [user, scopeFilters]);

  // Subscribe for new pending prompts
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('school_status_prompts_listener')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'school_status_prompts',
      }, (payload: any) => {
        const row = (payload?.new || payload?.record) as PromptRow | undefined;
        if (!row) return;
        if (row.status !== 'pending') return;
        // Scope check client-side
        if (row.user_id && user.id && row.user_id !== user.id) return;
        if (row.people_id && user.id && row.people_id !== user.id) return;
        if (row.email && user.email && row.email.toLowerCase() !== user.email.toLowerCase()) return;
        setQueue(prev => {
          // Avoid duplicates
          if (prev.some(p => p.id === row.id)) return prev;
          const next = [...prev, row].sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
          return next;
        });
        setOpen(true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const current = queue[0];

  const applyPrompt = async (accept: boolean) => {
    if (!current) return;
    try {
      // If confirming, attempt to update the school date/status based on prompt payload
      if (accept && current.school_id && current.proposed_value) {
        const col = current.target_column || current.date_column || '';
        if (col) {
          const patch: Record<string, any> = {};
          patch[col] = current.proposed_value;
          await supabase.from('schools').update(patch).eq('id', current.school_id);
        }
      }
      // Update prompt row status
      const newStatus = accept ? 'applied' : 'dismissed';
      await supabase
        .from('school_status_prompts')
        .update({ status: newStatus, resolved_at: new Date().toISOString() })
        .eq('id', current.id);
    } catch (e) {
      // Best-effort: even if school update fails, still try to mark resolved
      try {
        await supabase
          .from('school_status_prompts')
          .update({ status: accept ? 'applied' : 'dismissed', resolved_at: new Date().toISOString() })
          .eq('id', current.id);
      } catch {}
    } finally {
      setQueue(prev => prev.filter(p => p.id !== current.id));
      if (queue.length <= 1) setOpen(false);
    }
  };

  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={(o)=> setOpen(o)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm School Status Change</DialogTitle>
        </DialogHeader>
        <div className="text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Old value</span>
            <span className="font-medium">{current.old_value ?? '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Proposed value</span>
            <span className="font-medium">{current.proposed_value ?? '-'}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => applyPrompt(false)}>Dismiss</Button>
          <Button onClick={() => applyPrompt(true)}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
