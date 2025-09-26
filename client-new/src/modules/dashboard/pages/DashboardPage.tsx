import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MButton, TextField, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { useAuth } from '../../auth/auth-context';
import { supabase, fromGsync } from '@/lib/supabase/client';
import { GridBase } from '@/components/shared/GridBase';
import type { ColDef } from 'ag-grid-community';
import { DASHBOARD_TABLES } from '../constants';
import { useLocation } from 'wouter';

type AnyRow = Record<string, any>;

function buildCols(specCols: { field: string; headerName: string }[]): ColDef<AnyRow>[] {
  return specCols.map((c) => ({ field: c.field, headerName: c.headerName })) as ColDef<AnyRow>[];
}

export function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const userEmail = user?.email || '';
  const userId = user?.id || '';

  const [educators, setEducators] = useState<AnyRow[]>([]);
  const [schools, setSchools] = useState<AnyRow[]>([]);
  const [charters, setCharters] = useState<AnyRow[]>([]);
  const [steps, setSteps] = useState<AnyRow[]>([]);
  const [emails, setEmails] = useState<AnyRow[]>([]);
  const [events, setEvents] = useState<AnyRow[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);

  // Modal state
  const [editStep, setEditStep] = useState<AnyRow | null>(null);
  const [stepSaving, setStepSaving] = useState(false);
  const [editEmail, setEditEmail] = useState<AnyRow | null>(null);
  const [emailSaving, setEmailSaving] = useState(false);
  const [editEvent, setEditEvent] = useState<AnyRow | null>(null);
  const [eventSaving, setEventSaving] = useState(false);

  const fmtDate = (s?: string | null) => {
    if (!s) return '';
    try {
      // handle ISO or YYYY-MM-DD strings
      const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
      if (m) return `${Number(m[2])}/${Number(m[3])}/${Number(m[1])}`;
      const d = new Date(s);
      const y = d.getUTCFullYear();
      const mo = d.getUTCMonth() + 1;
      const da = d.getUTCDate();
      if (!Number.isNaN(y) && !Number.isNaN(mo) && !Number.isNaN(da)) return `${mo}/${da}/${y}`;
      return String(s);
    } catch { return String(s ?? ''); }
  };

  const fmtDateWithShortTime = (s?: string | null) => {
    if (!s) return '';
    try {
      const d = new Date(s);
      const y = d.getFullYear();
      const mo = d.getMonth() + 1;
      const da = d.getDate();
      let h = d.getHours();
      const m = d.getMinutes();
      const pm = h >= 12;
      h = h % 12;
      if (h === 0) h = 12;
      const mm = String(m).padStart(2, '0');
      const ap = pm ? 'p' : 'a';
      return `${mo}/${da}/${y} ${h}:${mm}${ap}`;
    } catch {
      return fmtDate(s);
    }
  };

  // Inline privacy toggles for dashboard grids
  const toggleEmailPrivacy = React.useCallback(async (row: AnyRow) => {
    if (!row || !userId) return;
    const next = !row.is_private;
    try {
      const { error } = await (fromGsync('g_emails') as any)
        .update({ is_private: next })
        .eq('user_id', userId)
        .eq('gmail_message_id', row.id);
      if (!error) setEmails((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_private: next } : r)));
    } catch {}
  }, [userId]);

  const toggleEventPrivacy = React.useCallback(async (row: AnyRow) => {
    if (!row || !userId) return;
    const next = !row.is_private;
    try {
      const { error } = await (fromGsync('g_events') as any)
        .update({ is_private: next })
        .eq('user_id', userId)
        .eq('google_event_id', row.id);
      if (!error) setEvents((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_private: next } : r)));
    } catch {}
  }, [userId]);

  // When an email is opened, fetch attachments and any missing body fields
  useEffect(() => {
    if (!editEmail || !userId) return;
    let cancelled = false;
    (async () => {
      try {
        const id = String(editEmail.id);
        const results: any[] = await Promise.all([
          (fromGsync('g_email_attachments') as any)
            .select('attachment_id,filename,storage_path')
            .eq('user_id', userId)
            .eq('gmail_message_id', id),
          // Re-read the email to include body fields if present
          (fromGsync('g_emails') as any)
            .select('body_text,body_html')
            .eq('user_id', userId)
            .eq('gmail_message_id', id)
            .maybeSingle(),
        ]);
        let att: any[] = results[0]?.data ?? [];
        const body = results[1]?.data ?? null;
        // Create signed URLs for attachments (gmail-attachments bucket)
        try {
          const enriched: any[] = [];
          for (const a of att) {
            const key = a?.storage_path as string | undefined;
            if (!key) { enriched.push(a); continue; }
            try {
              const { data: signed } = await (supabase.storage.from('gmail-attachments') as any).createSignedUrl(key, 3600);
              enriched.push({ ...a, url: signed?.signedUrl || null });
            } catch { enriched.push(a); }
          }
          att = enriched;
        } catch {}
        if (!cancelled) setEditEmail({ ...editEmail, ...(body || {}), attachments: Array.isArray(att) ? att : [] });
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [editEmail?.id, userId]);

  // When an event is opened, fetch attachments
  useEffect(() => {
    if (!editEvent || !userId) return;
    let cancelled = false;
    (async () => {
      try {
        const id = String(editEvent.id);
        let att: any[] = [];
        try {
          const res = await (fromGsync('g_event_attachments') as any)
            .select('attachment_id,filename,storage_path')
            .eq('user_id', userId)
            .eq('google_event_id', id);
          att = Array.isArray(res?.data) ? res.data : [];
        } catch {}
        if (!Array.isArray(att) || att.length === 0) {
          try {
            const res2 = await (fromGsync('g_event_attachments') as any)
              .select('attachment_id,filename,storage_path')
              .eq('user_id', userId)
              .eq('event_id', id);
            att = Array.isArray(res2?.data) ? res2.data : [];
          } catch {}
        }
        // Create signed URLs for attachments (gcal-attachments bucket)
        try {
          const enriched: any[] = [];
          for (const a of (att as any[])) {
            const key = a?.storage_path as string | undefined;
            if (!key) { enriched.push(a); continue; }
            try {
              const { data: signed } = await (supabase.storage.from('gcal-attachments') as any).createSignedUrl(key, 3600);
              enriched.push({ ...a, url: signed?.signedUrl || null });
            } catch { enriched.push(a); }
          }
          att = enriched as any;
        } catch {}
        if (!cancelled) setEditEvent({ ...editEvent, attachments: Array.isArray(att) ? att : [] });
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [editEvent?.id, userId]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        // My Educators (best-effort filters)
        let schoolIdsByGuide: string[] = [];
        // If grid_school exposes active_guides (text[]), use it to find relevant school ids
        try {
          const { data: sGuide } = await (supabase as any)
            .from('grid_school')
            .select('id,active_guides')
            .filter('active_guides', 'cs', `{${JSON.stringify(userEmail)}}`);
          if (Array.isArray(sGuide)) schoolIdsByGuide = sGuide.map((r: any) => String(r.id));
        } catch {}
        {
          let q = (supabase as any)
            .from('grid_educator')
            .select('id,full_name,current_role_at_active_school,active_school_id,assigned_partner,assigned_partner_override')
            .or(`assigned_partner.eq."${userEmail}",assigned_partner_override.eq."${userEmail}"`)
            .limit(50);
          if (schoolIdsByGuide.length) {
            q = q.in('active_school_id', schoolIdsByGuide);
          }
          const { data } = await q;
          if (!cancelled) setEducators(Array.isArray(data) ? data : []);
        }
        // My Schools
        {
          const { data } = await (supabase as any)
            .from('grid_school')
            .select('id,school_name,stage_status')
            .filter('active_guides', 'cs', `{${JSON.stringify(userEmail)}}`)
            .limit(50);
          if (!cancelled) setSchools(Array.isArray(data) ? data : []);
        }
        // My Charters
        {
          const { data } = await (supabase as any)
            .from('grid_charter')
            .select('id,charter_name,status')
            .filter('active_guides', 'cs', `{${JSON.stringify(userEmail)}}`)
            .limit(50);
          if (!cancelled) setCharters(Array.isArray(data) ? data : []);
        }
        // Educators: union of (assigned to me) and (at schools where I'm an active guide)
        const eduAssignedPromise = (supabase as any)
          .from('grid_educator')
          .select('id,full_name,current_role_at_active_school,active_school_id')
          .or(`assigned_partner.eq."${userEmail}",assigned_partner_override.eq."${userEmail}"`)
          .limit(100);
        const eduBySchoolPromise = schoolIdsByGuide.length
          ? (supabase as any)
              .from('grid_educator')
              .select('id,full_name,current_role_at_active_school,active_school_id')
              .in('active_school_id', schoolIdsByGuide)
              .limit(100)
          : Promise.resolve({ data: [] });
        try {
          const [{ data: a = [] }, { data: b = [] }]: any = await Promise.all([eduAssignedPromise, eduBySchoolPromise]);
          if (!cancelled) {
            const map: Record<string, any> = {};
            [...a, ...b].forEach((r: any) => { if (r && r.id != null) map[String(r.id)] = r; });
            setEducators(Object.values(map));
          }
        } catch {}
        // My Action Steps (incomplete + assignee)
        {
          const { data } = await (supabase as any)
            .from('action_steps')
            .select('id,due_date,item,assignee,item_status')
            .eq('item_status', 'Incomplete')
            .eq('assignee', userEmail)
            .order('due_date', { ascending: true })
            .limit(100);
          if (!cancelled) setSteps(Array.isArray(data) ? data : []);
        }
        // My Emails (gsync)
        if (userId) {
          const { data } = await (fromGsync('g_emails_without_people_ids') as any)
            .select('id:gmail_message_id,sent_at,subject,body_text,from_email,to_emails,cc_emails,bcc_emails,is_private,user_id')
            .eq('user_id', userId)
            .order('sent_at', { ascending: false })
            .limit(100);
          if (!cancelled) setEmails(Array.isArray(data) ? data : []);
        }
        // My Meetings (events)
        if (userId) {
          const { data } = await (fromGsync('g_events_without_people_ids') as any)
            .select('id:google_event_id,start_time,end_time,location,organizer_email,attendees,summary,description,is_private,user_id')
            .eq('user_id', userId)
            .order('start_time', { ascending: false })
            .limit(100);
          if (!cancelled) setEvents(Array.isArray(data) ? data : []);
        }
      } catch (_) {}
    }
    if (userEmail) run();
    return () => { cancelled = true; };
  }, [userEmail, userId, refreshTick]);

  const spec = useMemo(() => {
    const byId: Record<string, any> = {};
    DASHBOARD_TABLES.forEach((t) => (byId[t.id] = t));
    return byId;
  }, []);

  const educatorsCols = useMemo(() => buildCols(spec.my_educators.columns), [spec]);
  const schoolsCols = useMemo(() => buildCols(spec.my_schools.columns), [spec]);
  const chartersCols = useMemo(() => buildCols(spec.my_charters.columns), [spec]);
  const stepsCols = useMemo(() => buildCols(spec.my_action_steps.columns), [spec]);
  const emailsCols = useMemo(() => {
    const cols = buildCols(spec.my_emails.columns);
    return cols.map((c) => {
      if (c.field === 'sent_at') return { ...c, valueFormatter: (p: any) => fmtDate(p.value), width: 100, flex: 0 } as ColDef<any>;
      if (c.field === 'is_private') {
        const Renderer = (p: any) => (
          <input
            type="checkbox"
            checked={!!p.value}
            onChange={() => { /* AG Grid will re-render after state update */ }}
            onClick={(e) => { e.stopPropagation(); toggleEmailPrivacy(p.data); }}
            style={{ cursor: 'pointer' }}
          />
        );
        return { ...c, width: 72, flex: 0, cellRenderer: Renderer as any } as ColDef<any>;
      }
      if (c.field === 'subject') return { ...c, flex: 2, minWidth: 240 } as ColDef<any>;
      return c;
    });
  }, [spec, toggleEmailPrivacy]);
  const eventsCols = useMemo(() => {
    const cols = buildCols(spec.my_meetings.columns);
    return cols.map((c) => {
      if (c.field === 'start_time') return { ...c, valueFormatter: (p: any) => fmtDateWithShortTime(p.value), width: 120, flex: 0 } as ColDef<any>;
      if (c.field === 'end_time') return { ...c, valueFormatter: (p: any) => fmtDate(p.value), width: 100, flex: 0 } as ColDef<any>;
      if (c.field === 'is_private') {
        const Renderer = (p: any) => (
          <input
            type="checkbox"
            checked={!!p.value}
            onChange={() => {}}
            onClick={(e) => { e.stopPropagation(); toggleEventPrivacy(p.data); }}
            style={{ cursor: 'pointer' }}
          />
        );
        return { ...c, width: 72, flex: 0, cellRenderer: Renderer as any } as ColDef<any>;
      }
      if (c.field === 'summary') return { ...c, flex: 2, minWidth: 240 } as ColDef<any>;
      return c;
    });
  }, [spec, toggleEventPrivacy]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
      {/* Row 1: Educators, Action Steps */}
      <DashCard title={spec.my_educators.title}>
        <GridBase columnDefs={educatorsCols} rowData={educators}
          gridOptions={{
            onRowClicked: (e) => e?.data?.id && navigate(`/educators/${e.data.id}`),
            rowSelection: { mode: 'singleRow', enableClickSelection: true, checkboxes: false, headerCheckbox: false } as any,
          }}
        />
      </DashCard>
      <DashCard title={spec.my_action_steps.title}>
        <GridBase columnDefs={stepsCols} rowData={steps}
          gridOptions={{
            onRowClicked: (e) => e?.data && setEditStep(e.data),
            rowSelection: { mode: 'singleRow', enableClickSelection: true, checkboxes: false, headerCheckbox: false } as any,
          }}
        />
      </DashCard>
      {/* Row 2: Schools, Emails */}
      <DashCard title={spec.my_schools.title}>
        <GridBase columnDefs={schoolsCols} rowData={schools}
          gridOptions={{
            onRowClicked: (e) => e?.data?.id && navigate(`/schools/${e.data.id}`),
            rowSelection: { mode: 'singleRow', enableClickSelection: true, checkboxes: false, headerCheckbox: false } as any,
          }}
        />
      </DashCard>
      <DashCard title={spec.my_emails.title}>
        <GridBase columnDefs={emailsCols} rowData={emails}
          gridOptions={{
            onRowClicked: (e) => e?.data && setEditEmail(e.data),
            rowSelection: { mode: 'singleRow', enableClickSelection: true, checkboxes: false, headerCheckbox: false } as any,
          }}
        />
      </DashCard>
      {/* Row 3: Charters, Events */}
      <DashCard title={spec.my_charters.title}>
        <GridBase columnDefs={chartersCols} rowData={charters}
          gridOptions={{
            onRowClicked: (e) => e?.data?.id && navigate(`/charters/${e.data.id}`),
            rowSelection: { mode: 'singleRow', enableClickSelection: true, checkboxes: false, headerCheckbox: false } as any,
          }}
        />
      </DashCard>
      <DashCard title={spec.my_meetings.title}>
        <GridBase columnDefs={eventsCols} rowData={events}
          gridOptions={{
            onRowClicked: (e) => e?.data && setEditEvent(e.data),
            rowSelection: { mode: 'singleRow', enableClickSelection: true, checkboxes: false, headerCheckbox: false } as any,
          }}
        />
      </DashCard>

      {/* Action Step Modal */}
      <Dialog open={!!editStep} onClose={() => setEditStep(null)} maxWidth="md" fullWidth PaperProps={{ sx: { maxWidth: 720 } }}>
        <DialogTitle sx={{ pb: 1 }}>Edit Action Step</DialogTitle>
        {editStep ? (
          <DialogContent sx={{ display: 'grid', gap: 2, pt: 6 }}>
            <TextField
              label="Due Date"
              type="date"
              size="small"
              value={(editStep.due_date || '').slice(0, 10)}
              onChange={(e) => setEditStep({ ...editStep, due_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Item"
              size="small"
              value={editStep.item || ''}
              onChange={(e) => setEditStep({ ...editStep, item: e.target.value })}
              multiline minRows={3}
            />
            <TextField
              label="Assignee"
              size="small"
              value={editStep.assignee || ''}
              onChange={(e) => setEditStep({ ...editStep, assignee: e.target.value })}
            />
            <TextField
              select
              label="Status"
              size="small"
              value={editStep.item_status || ''}
              onChange={(e) => setEditStep({ ...editStep, item_status: e.target.value })}
            >
              {['Incomplete', 'Complete', 'Deferred'].map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
        ) : null}
        <DialogActions>
          <MButton onClick={() => setEditStep(null)} disabled={stepSaving}>Cancel</MButton>
          <MButton
            variant="contained"
            onClick={async () => {
              if (!editStep) return;
              setStepSaving(true);
              try {
                const { error } = await (supabase as any)
                  .from('action_steps')
                  .update({
                    due_date: editStep.due_date || null,
                    item: editStep.item || null,
                    assignee: editStep.assignee || null,
                    item_status: editStep.item_status || null,
                  })
                  .eq('id', editStep.id);
                if (error) throw error;
                setEditStep(null);
                setRefreshTick((x) => x + 1);
              } catch (e) {
                // eslint-disable-next-line no-alert
                alert((e as any)?.message || 'Failed to save action step');
              } finally {
                setStepSaving(false);
              }
            }}
            disabled={stepSaving}
          >
            {stepSaving ? 'Saving…' : 'Save'}
          </MButton>
        </DialogActions>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={!!editEmail} onClose={() => setEditEmail(null)} maxWidth="lg" fullWidth PaperProps={{ sx: { maxWidth: 980 } }}>
        <DialogTitle sx={{ pb: 1 }}>Email</DialogTitle>
        {editEmail ? (
          <DialogContent sx={{ display: 'grid', gap: 2, pt: 6 }}>
            <TextField label="Sent Date" size="small" value={fmtDate(editEmail.sent_at)} InputProps={{ readOnly: true }} />
            <TextField label="From" size="small" value={String(editEmail.from_email || '')} InputProps={{ readOnly: true }} />
            <TextField label="To" size="small" value={Array.isArray(editEmail.to_emails) ? editEmail.to_emails.join(', ') : ''} InputProps={{ readOnly: true }} />
            <TextField label="CC" size="small" value={Array.isArray(editEmail.cc_emails) ? editEmail.cc_emails.join(', ') : ''} InputProps={{ readOnly: true }} />
            <TextField label="BCC" size="small" value={Array.isArray(editEmail.bcc_emails) ? editEmail.bcc_emails.join(', ') : ''} InputProps={{ readOnly: true }} />
            <TextField label="Subject" size="small" value={String(editEmail.subject || '')} InputProps={{ readOnly: true }} />
            {editEmail.body_text || editEmail.body_html ? (
              <TextField
                label="Body"
                size="small"
                value={String(editEmail.body_text || editEmail.body_html || '')}
                InputProps={{ readOnly: true }}
                multiline
                rows={20}
                sx={{
                  '& .MuiInputBase-inputMultiline': {
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.4,
                    overflow: 'auto',
                    maxHeight: 600,
                  },
                }}
              />
            ) : null}
            <FormControlLabel
              control={<Checkbox checked={!!editEmail.is_private} onChange={(e) => setEditEmail({ ...editEmail, is_private: e.target.checked })} />}
              label="Private"
            />
            {Array.isArray((editEmail as any).attachments) && (editEmail as any).attachments.length ? (
              <div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>Attachments</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {((editEmail as any).attachments as any[]).map((a, idx) => {
                    const name = String(a.filename || a.storage_path || a.attachment_id || `Attachment ${idx + 1}`);
                    const href = (a as any).url || '';
                    return (
                      <li key={idx} style={{ fontSize: 12 }}>
                        {href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer">{name}</a>
                        ) : (
                          <span>{name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </DialogContent>
        ) : null}
        <DialogActions>
          <MButton onClick={() => setEditEmail(null)} disabled={emailSaving}>Cancel</MButton>
          <MButton
            variant="contained"
            onClick={async () => {
              if (!editEmail) return;
              setEmailSaving(true);
              try {
                const { error } = await (supabase as any)
                  .schema('gsync')
                  .from('g_emails')
                  .update({ is_private: !!editEmail.is_private })
                  .eq('user_id', userId)
                  .eq('gmail_message_id', editEmail.id);
                if (error) throw error;
                setEditEmail(null);
                setRefreshTick((x) => x + 1);
              } catch (e) {
                alert((e as any)?.message || 'Failed to save email');
              } finally {
                setEmailSaving(false);
              }
            }}
            disabled={emailSaving}
          >
            {emailSaving ? 'Saving…' : 'Save'}
          </MButton>
        </DialogActions>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={!!editEvent} onClose={() => setEditEvent(null)} maxWidth="lg" fullWidth PaperProps={{ sx: { maxWidth: 980 } }}>
        <DialogTitle sx={{ pb: 1 }}>Event</DialogTitle>
        {editEvent ? (
          <DialogContent sx={{ display: 'grid', gap: 2, pt: 6 }}>
            <TextField label="Start Date" size="small" value={fmtDate(editEvent.start_time)} InputProps={{ readOnly: true }} />
            <TextField label="End Date" size="small" value={fmtDate(editEvent.end_time)} InputProps={{ readOnly: true }} />
            <TextField label="Location" size="small" value={String(editEvent.location || '')} InputProps={{ readOnly: true }} />
            <TextField label="Organizer" size="small" value={String(editEvent.organizer_email || '')} InputProps={{ readOnly: true }} />
            <TextField label="Attendees" size="small" value={Array.isArray(editEvent.attendees) ? editEvent.attendees.join(', ') : ''} InputProps={{ readOnly: true }} />
            <TextField label="Summary" size="small" value={String(editEvent.summary || '')} InputProps={{ readOnly: true }} />
            {editEvent.description ? (
              <TextField
                label="Description"
                size="small"
                value={String(editEvent.description || '')}
                InputProps={{ readOnly: true }}
                multiline
                rows={16}
                sx={{
                  '& .MuiInputBase-inputMultiline': {
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.4,
                    overflow: 'auto',
                    maxHeight: 600,
                  },
                }}
              />
            ) : null}
            <FormControlLabel
              control={<Checkbox checked={!!editEvent.is_private} onChange={(e) => setEditEvent({ ...editEvent, is_private: e.target.checked })} />}
              label="Private"
            />
            {Array.isArray((editEvent as any).attachments) && (editEvent as any).attachments.length ? (
              <div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>Attachments</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {((editEvent as any).attachments as any[]).map((a, idx) => {
                    const name = String(a.filename || a.storage_path || a.attachment_id || `Attachment ${idx + 1}`);
                    const href = (a as any).url || '';
                    return (
                      <li key={idx} style={{ fontSize: 12 }}>
                        {href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer">{name}</a>
                        ) : (
                          <span>{name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </DialogContent>
        ) : null}
        <DialogActions>
          <MButton onClick={() => setEditEvent(null)} disabled={eventSaving}>Cancel</MButton>
          <MButton
            variant="contained"
            onClick={async () => {
              if (!editEvent) return;
              setEventSaving(true);
              try {
                const { error } = await (supabase as any)
                  .schema('gsync')
                  .from('g_events')
                  .update({ is_private: !!editEvent.is_private })
                  .eq('user_id', userId)
                  .eq('google_event_id', editEvent.id);
                if (error) throw error;
                setEditEvent(null);
                setRefreshTick((x) => x + 1);
              } catch (e) {
                alert((e as any)?.message || 'Failed to save event');
              } finally {
                setEventSaving(false);
              }
            }}
            disabled={eventSaving}
          >
            {eventSaving ? 'Saving…' : 'Save'}
          </MButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function DashCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(15,23,42,0.06)' }}>
      <header style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{title}</header>
      <div style={{ padding: 8 }}>
        {children}
      </div>
    </section>
  );
}

export default DashboardPage;
