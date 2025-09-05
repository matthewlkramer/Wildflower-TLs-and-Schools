import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function parseEmailsParam(param: string | null): string[] {
  if (!param) return [];
  try {
    return decodeURIComponent(param).split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
  } catch { return []; }
}

export default function ComposeEmailPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const qs = new URLSearchParams(window.location.search);
  const initialTo = parseEmailsParam(qs.get('to'));
  const [to, setTo] = useState<string[]>(initialTo);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const from = user?.email || '';

  const toText = useMemo(()=>to.join(', '), [to]);
  const ccText = useMemo(()=>cc.join(', '), [cc]);
  const bccText = useMemo(()=>bcc.join(', '), [bcc]);

  const saveDraft = async () => {
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) throw new Error('Not signed in');
      await supabase.from('email_drafts').insert({
        user_id: u.id,
        to_emails: to,
        cc_emails: cc,
        bcc_emails: bcc,
        subject,
        body,
      });
      alert('Draft saved.');
    } catch (e: any) {
      alert(e?.message || String(e));
    }
  };
  const discardDraft = async () => {
    navigate(-1 as any);
  };
  useEffect(() => {
    (async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) return;
        const { data } = await supabase.from('email_drafts').select('*').eq('user_id', u.id).order('updated_at', { ascending: false }).limit(1);
        const d = data?.[0];
        if (d) {
          setTo(d.to_emails || []); setCc(d.cc_emails || []); setBcc(d.bcc_emails || []); setSubject(d.subject || ''); setBody(d.body || '');
        }
      } catch {}
    })();
  }, []);

  const send = async () => {
    try {
      // Use supabase.functions.invoke to include auth automatically
      const { data, error } = await supabase.functions.invoke('gmail-sync', {
        body: { action: 'send_email', to, cc, bcc, subject, body }
      });
      if (error) throw new Error(error.message || 'Failed to send');
      alert('Email sent');
      try { localStorage.removeItem('compose_draft'); } catch {}
      navigate(-1 as any);
    } catch (e:any) {
      alert(e?.message || String(e));
    }
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border p-4 space-y-3">
          <div className="text-sm text-slate-600">From: {from || '(unknown user)'}</div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">To</label>
            <Input value={toText} onChange={e=>setTo(e.target.value.split(/[,;\s]+/).filter(Boolean))} placeholder="alice@example.org, bob@example.org" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Cc</label>
              <Input value={ccText} onChange={e=>setCc(e.target.value.split(/[,;\s]+/).filter(Boolean))} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Bcc</label>
              <Input value={bccText} onChange={e=>setBcc(e.target.value.split(/[,;\s]+/).filter(Boolean))} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Subject</label>
            <Input value={subject} onChange={e=>setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Body</label>
            <Textarea value={body} onChange={e=>setBody(e.target.value)} className="min-h-[240px]" />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={send}>Send</Button>
            <Button variant="secondary" onClick={saveDraft}>Save Draft</Button>
            <Button variant="outline" onClick={discardDraft}>Discard</Button>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="font-semibold mb-2">Templates</div>
          <div className="text-sm text-slate-600">Template selection isn’t implemented yet.</div>
        </div>
      </div>
    </main>
  );
}
