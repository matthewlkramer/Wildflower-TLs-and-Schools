import { supabase } from '@/lib/supabase/client';
import type { RowActionId } from '../detail-types';

type Ctx = {
  actionId: RowActionId | string;
  row: any;
  index: number;
  effective: any;
  setEditingRow: (i: number | null) => void;
  setEditingValues: (v: any) => void;
  setViewRowIndex: (i: number | null) => void;
  setRefreshToken: (updater: (n: number) => number) => void;
};

export async function handleRowAction(ctx: Ctx) {
  const { actionId, row, index, effective, setEditingRow, setEditingValues, setViewRowIndex, setRefreshToken } = ctx;
  const value = String(actionId);

  if (value === 'inline_edit') {
    setEditingRow(index);
    setEditingValues({ ...(row as any) });
    return;
  }
  if (value === 'view_in_modal') {
    setViewRowIndex(index);
    return;
  }
  if (value === 'email') {
    const emails: string[] = [];
    const push = (v: any) => { if (typeof v === 'string' && v.includes('@')) emails.push(v); };
    const r: any = row;
    ;['email_address','email','primary_email','contact_email','school_email','charter_email'].forEach((k) => push(r[k]));
    ;['to_emails','cc_emails','bcc_emails','attendees'].forEach((k) => { const arr = r[k]; if (Array.isArray(arr)) arr.forEach(push); });
    if (emails.length === 0) {
      const pid = r['people_id'] ?? r['person_id'] ?? r['educator_id'];
      if (pid != null) {
        try {
          const { data, error } = await (supabase as any)
            .from('primary_emails')
            .select('email_address')
            .eq('people_id', pid)
            .maybeSingle();
          if (!error && data?.email_address) push(String(data.email_address));
        } catch {}
      }
    }
    const to = encodeURIComponent(Array.from(new Set(emails)).join(','));
    if (!to) { alert('No email address is available for this record.'); return; }
    window.location.assign(`/email/compose?to=${to}`);
    return;
  }

  // Helpers for write targets
  const wr: any = (effective as any).writeDefaults ?? {};
  const rs: any = (effective as any).readSource ?? (effective as any).source ?? {};
  const schema = wr.schema ?? rs.schema;
  const table = wr.table ?? rs.table;
  const pk = wr.pkColumn ?? 'id';
  const client = schema && schema !== 'public' ? (supabase as any).schema(schema) : (supabase as any);
  const pkValue = (row as any)[pk];

  if (value === 'toggle_private_public') {
    if (!table) { console.warn('No write target for toggle_private_public'); return; }
    const next = !(row as any)?.is_private;
    const { error } = await client.from(table).update({ is_private: next }).eq(pk, pkValue);
    if (!error) setRefreshToken((t) => t + 1);
    return;
  }
  if (value === 'toggle_complete') {
    if (!table) { console.warn('No write target for toggle_complete'); return; }
    const current = String((row as any)?.item_status ?? 'Incomplete');
    const completing = current !== 'Complete';
    const payload: any = { item_status: completing ? 'Complete' : 'Incomplete', completed_date: completing ? new Date().toISOString() : null };
    const { error } = await client.from(table).update(payload).eq(pk, pkValue);
    if (!error) setRefreshToken((t) => t + 1);
    return;
  }
  if (value === 'end_stint') {
    if (!table) { console.warn('No write target for end_stint'); return; }
    const payload: any = { is_active: false, end_date: new Date().toISOString() };
    const { error } = await client.from(table).update(payload).eq(pk, pkValue);
    if (!error) setRefreshToken((t) => t + 1);
    return;
  }
  if (value === 'toggle_valid') {
    if (!table) { console.warn('No write target for toggle_valid'); return; }
    const next = !(row as any)?.is_valid;
    const { error } = await client.from(table).update({ is_valid: next }).eq(pk, pkValue);
    if (!error) setRefreshToken((t) => t + 1);
    return;
  }
  if (value === 'make_primary') {
    if (!table) { console.warn('No write target for make_primary'); return; }
    let personId = (row as any)?.people_id;
    if (personId == null) {
      try {
        const res = await client.from(table).select('people_id').eq(pk, pkValue).maybeSingle();
        if (!res.error) personId = (res.data as any)?.people_id;
      } catch {}
    }
    if (personId == null) { alert('Unable to determine person for this email.'); return; }
    await client.from(table).update({ is_primary: false }).eq('people_id', personId);
    const { error } = await client.from(table).update({ is_primary: true }).eq(pk, pkValue);
    if (!error) setRefreshToken((t) => t + 1);
    return;
  }
  if (value === 'end_occupancy') {
    if (!table) { console.warn('No write target for end_occupancy'); return; }
    const now = new Date().toISOString();
    const payload: any = { end_date: now, current_mail_address: false, current_physical_address: false };
    const { error } = await client.from(table).update(payload).eq(pk, pkValue);
    if (!error) setRefreshToken((t) => t + 1);
    return;
  }
  if (value === 'jump_to_modal') {
    const source: any = (effective as any).readSource ?? (effective as any).source ?? {};
    const fk = source?.fkColumn as string | undefined;
    const r: any = row;
    let targetEntity: 'educators' | 'schools' | 'charters' | null = null;
    let targetId: string | number | null = null;
    if (fk === 'people_id') {
      if (r.school_id != null) { targetEntity = 'schools'; targetId = r.school_id; }
      else if (r.charter_id != null) { targetEntity = 'charters'; targetId = r.charter_id; }
    } else if (fk === 'school_id' || fk === 'charter_id') {
      if (r.people_id != null) { targetEntity = 'educators'; targetId = r.people_id; }
    }
    if (!targetEntity) {
      if (r.people_id != null) { targetEntity = 'educators'; targetId = r.people_id; }
      else if (r.school_id != null) { targetEntity = 'schools'; targetId = r.school_id; }
      else if (r.charter_id != null) { targetEntity = 'charters'; targetId = r.charter_id; }
    }
    if (targetEntity && targetId != null) {
      const id = encodeURIComponent(String(targetId));
      window.location.assign(`/${targetEntity}/${id}?action=view_in_modal`);
    }
    return;
  }
  // Default: no-op
  console.log('Row action selected:', value);
}

