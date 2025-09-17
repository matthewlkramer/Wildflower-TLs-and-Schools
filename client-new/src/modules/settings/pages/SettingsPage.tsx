import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '../../auth/auth-context';
import { GoogleSyncSection, type GoogleSyncNotification, type GoogleSyncSummary } from '../components/GoogleSyncSection';

type EducatorProfile = {
  full_name: string | null;
  current_role: string | null;
  current_role_at_active_school: string | null;
  primary_email: string | null;
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  maxWidth: 960,
  margin: '0 auto',
};

const sectionStyle: React.CSSProperties = {
  border: '1px solid #d1d5db',
  borderRadius: 6,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#4b5563',
};

const valueStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 4,
  border: '1px solid #cbd5f5',
  background: '#f8fafc',
  fontSize: 13,
};

function disabledStyle(base: React.CSSProperties, disabled: boolean) {
  if (!disabled) return base;
  return { ...base, opacity: 0.6, cursor: 'not-allowed' };
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function SettingsPage() {
  const { user } = useAuth();
  const [syncStart, setSyncStart] = useState('');
  const [savingSync, setSavingSync] = useState(false);
  const [banner, setBanner] = useState<GoogleSyncNotification | null>(null);
  const [syncSummary, setSyncSummary] = useState<GoogleSyncSummary>({
    gmailSyncedThrough: '',
    gmailMostRecent: '',
    calendarSyncedThrough: '',
    calendarMostRecent: '',
  });

  const showBanner = useCallback((note: GoogleSyncNotification) => {
    setBanner(note);
  }, []);

  const profileQuery = useQuery<EducatorProfile | null>({
    queryKey: ['settings-profile', user?.email],
    enabled: Boolean(user?.email),
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase
        .from('details_educators')
        .select('full_name,current_role,current_role_at_active_school,primary_email')
        .eq('primary_email', user.email)
        .maybeSingle();
      if (error) throw error;
      return data as EducatorProfile | null;
    },
  });

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await (supabase.from as any)('google_sync_settings')
          .select('sync_start_date')
          .eq('user_id', user.id)
          .maybeSingle();
        if (cancelled) return;
        const iso: string | null = data?.sync_start_date ?? null;
        setSyncStart(iso ? iso.slice(0, 10) : todayInputValue());
      } catch {
        if (!cancelled) setSyncStart(todayInputValue());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const saveSyncStart = async () => {
    if (!user?.id || !syncStart) return;
    try {
      setSavingSync(true);
      const iso = new Date(`${syncStart}T00:00:00Z`).toISOString();
      const { data: current } = await (supabase.from as any)('google_sync_settings')
        .select('sync_start_date')
        .eq('user_id', user.id)
        .maybeSingle();
      const previousIso: string | null = current?.sync_start_date ?? null;
      const movedEarlier = !previousIso || new Date(iso) < new Date(previousIso);
      const { error } = await (supabase.from as any)('google_sync_settings')
        .upsert({ user_id: user.id, sync_start_date: iso });
      if (error) throw error;
      showBanner({ type: 'info', text: 'Sync start date saved.' });
      if (movedEarlier) {
        try {
          await (supabase.from as any)('sync_catchup_requests').upsert({ user_id: user.id, status: 'queued' });
          showBanner({ type: 'info', text: 'Catch-up queued. Historical ingest will run automatically.' });
        } catch (err: any) {
          showBanner({ type: 'error', text: err?.message || 'Failed to queue catch-up request.' });
        }
      }
    } catch (e: any) {
      showBanner({ type: 'error', text: e?.message || 'Unable to save sync start date.' });
    } finally {
      setSavingSync(false);
    }
  };

  const accountDetails = useMemo(() => {
    const profile = profileQuery.data;
    const name = profile?.full_name || profile?.primary_email || user?.email || '—';
    const role = profile?.current_role_at_active_school || profile?.current_role || '—';
    return { name, role };
  }, [profileQuery.data, user?.email]);

  const syncSummaryList = [
    { label: 'Gmail synced through', value: syncSummary.gmailSyncedThrough || '—' },
    { label: 'Gmail most recent sync', value: syncSummary.gmailMostRecent || '—' },
    { label: 'Calendar synced through', value: syncSummary.calendarSyncedThrough || '—' },
    { label: 'Calendar most recent sync', value: syncSummary.calendarMostRecent || '—' },
  ];

  return (
    <main style={{ padding: 24 }}>
      <div style={containerStyle}>
        <header>
          <h1 style={{ margin: 0 }}>Settings</h1>
          <p style={{ margin: '8px 0 0', color: '#4b5563', fontSize: 14 }}>
            Review your account details and manage Google sync preferences.
          </p>
        </header>

        {banner && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: banner.type === 'error' ? '#f87171' : '#93c5fd',
              background: banner.type === 'error' ? '#fee2e2' : '#eff6ff',
              color: banner.type === 'error' ? '#b91c1c' : '#1d4ed8',
              fontSize: 14,
            }}
          >
            {banner.text}
          </div>
        )}

        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Account</h2>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div>
              <div style={labelStyle}>Name</div>
              <div style={valueStyle}>{profileQuery.isLoading ? 'Loading…' : accountDetails.name}</div>
            </div>
            <div>
              <div style={labelStyle}>Email</div>
              <div style={valueStyle}>{user?.email || '—'}</div>
            </div>
            <div>
              <div style={labelStyle}>Role</div>
              <div style={valueStyle}>{profileQuery.isLoading ? 'Loading…' : accountDetails.role}</div>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Google Sync Range</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#4b5563' }}>
            Set the earliest date to include when syncing Gmail and Calendar.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <input
              type="date"
              value={syncStart}
              onChange={(e) => setSyncStart(e.target.value)}
              style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #d1d5db' }}
            />
            <button
              type="button"
              style={disabledStyle(buttonStyle, savingSync)}
              onClick={saveSyncStart}
              disabled={savingSync}
            >
              {savingSync ? 'Saving…' : 'Save'}
            </button>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Sync Status</h2>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {syncSummaryList.map((item) => (
              <div key={item.label}>
                <div style={labelStyle}>{item.label}</div>
                <div style={valueStyle}>{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Google Sync Controls</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#4b5563' }}>
            Authorize Google, monitor sync runs, and trigger Gmail or Calendar updates.
          </p>
          <GoogleSyncSection
            onNotify={showBanner}
            onSyncSummary={(summary) => setSyncSummary(summary)}
          />
        </section>
      </div>
    </main>
  );
}

export default SettingsPage;
