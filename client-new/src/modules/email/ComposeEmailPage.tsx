import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/modules/auth/auth-context';
import { supabase } from '@/lib/supabase/client';

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function ComposeEmailPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const toPreset = parseList(params.get('to'));
  const ccPreset = parseList(params.get('cc'));
  const bccPreset = parseList(params.get('bcc'));

  const [from, setFrom] = React.useState<string>(user?.email ?? '');
  const [to, setTo] = React.useState<string>(toPreset.join(', '));
  const [cc, setCc] = React.useState<string>(ccPreset.join(', '));
  const [bcc, setBcc] = React.useState<string>(bccPreset.join(', '));
  const [subject, setSubject] = React.useState<string>('');
  const [body, setBody] = React.useState<string>('');
  const [files, setFiles] = React.useState<File[]>([]);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState('');
  const [info, setInfo] = React.useState('');

  const collectPayload = () => ({
    from,
    to: parseList(to),
    cc: parseList(cc),
    bcc: parseList(bcc),
    subject,
    body,
    attachments: files,
  });

  async function trySend(orDraft: 'send' | 'draft') {
    setSending(true);
    setError('');
    setInfo('');
    const payload = collectPayload();
    try {
      if (orDraft === 'send') {
        try {
          const { error: fnErr } = await (supabase as any).functions.invoke('gmail-send', {
            body: { ...payload, draft: false },
          });
          if (!fnErr) {
            setInfo('Email sent.'); setSending(false); return;
          }
        } catch {}
      } else {
        try {
          const { error: fnErr } = await (supabase as any).functions.invoke('gmail-send', {
            body: { ...payload, draft: true },
          });
          if (!fnErr) { setInfo('Draft saved.'); setSending(false); return; }
        } catch {}
      }
      // Edge Function not available or failed: fall back to mailto for send only
      if (orDraft === 'send') {
        const mailto = `mailto:${encodeURIComponent(payload.to.join(','))}?subject=${encodeURIComponent(payload.subject || '')}`;
        window.location.href = mailto; setSending(false); return;
      }

      setError('Unable to save draft with current backend.');
    } catch (e: any) {
      setError(e?.message || 'Unexpected error.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>Compose Email</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
                window.history.back();
              } else {
                navigate('/educators');
              }
            }}
          >
            Back
          </Button>
          <Button variant="outline" size="sm" disabled={sending} onClick={() => trySend('draft')}>Save Draft</Button>
          <Button variant="primary" size="sm" disabled={sending} onClick={() => trySend('send')}>{sending ? 'Sending.' : 'Send'}</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <LabeledInput label="From">
          <Input value={from} readOnly disabled aria-readonly />
        </LabeledInput>
        <LabeledInput label="To">
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="comma-separated emails" />
        </LabeledInput>
        <LabeledInput label="Cc">
          <Input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="comma-separated emails" />
        </LabeledInput>
        <LabeledInput label="Bcc">
          <Input value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="comma-separated emails" />
        </LabeledInput>
        <LabeledInput label="Subject">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </LabeledInput>
        <LabeledInput label="Body" alignTop>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={24}
            style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 6, padding: 10, minHeight: 420, height: '60vh', resize: 'vertical' }}
          />
        </LabeledInput>
        <LabeledInput label="Attachments" alignTop>
          <div>
            <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            {files.length > 0 ? (
              <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{files.length} file(s) selected</div>
            ) : null}
          </div>
        </LabeledInput>

        {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}
        {info ? <div style={{ color: '#065f46', fontSize: 12 }}>{info}</div> : null}
      </div>
    </div>
  );
}

function LabeledInput({ label, children, alignTop }: { label: string; children: React.ReactNode; alignTop?: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: alignTop ? 'flex-start' : 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: '#334155', minWidth: 80, lineHeight: alignTop ? '24px' : undefined }}>{label}</span>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </label>
  );
}
