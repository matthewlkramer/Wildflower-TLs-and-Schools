import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MButton, TextField, FormControlLabel, Checkbox, MenuItem, FormControl, Select, ListItemText } from '@mui/material';
import { supabase } from '@/lib/supabase/client';
import { getBufferedLogsText } from '@/lib/log-buffer';

type Props = { open: boolean; onClose: () => void };

type EnumOption = string;

export function DeveloperNoteModal({ open, onClose }: Props) {
  const [noteTypes, setNoteTypes] = React.useState<EnumOption[]>([]);
  const [availableTypes, setAvailableTypes] = React.useState<EnumOption[]>([]);
  const [comment, setComment] = React.useState('');
  const [priority, setPriority] = React.useState<'High' | 'Medium' | 'Low'>('Medium');
  const [picking, setPicking] = React.useState(false);
  const [focusSelector, setFocusSelector] = React.useState('');
  const [focusBox, setFocusBox] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [screenshotUrl, setScreenshotUrl] = React.useState<string>('');
  const [saving, setSaving] = React.useState(false);
  const [typesOpen, setTypesOpen] = React.useState(false);
  const [hideWhilePicking, setHideWhilePicking] = React.useState(false);

  // Load enum options for dev_note_type (enum array)
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Prefer singular enum name per schema: dev_note_type
        let { data, error } = await (supabase as any).rpc('enum_values', { enum_type: 'dev_note_type' });
        if (error) {
          // Fallback to legacy name if present
          const res = await (supabase as any).rpc('enum_values', { enum_type: 'dev_notes_type' });
          data = res.data; error = res.error;
        }
        if (!cancelled && !error) {
          const opts = Array.isArray(data) ? data.map((r: any) => String(r?.value ?? r)).filter(Boolean) : [];
          setAvailableTypes(opts);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (!picking) return;
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = e.target as Element;
      const sel = cssPath(el);
      const label = describeElement(el);
      const rect = (el as HTMLElement).getBoundingClientRect();
      setFocusSelector(`${label}  (${sel})`);
      setFocusBox({ x: Math.round(rect.left), y: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) });
      setPicking(false);
      setHideWhilePicking(false);
    };
    document.addEventListener('click', onClick, true);
    document.body.style.cursor = 'crosshair';
    return () => { document.removeEventListener('click', onClick, true); document.body.style.cursor = 'auto'; };
  }, [picking]);

  async function captureScreenshot(): Promise<string | null> {
    try {
      // Temporarily hide the modal to avoid capturing it
      setHideWhilePicking(true);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      // Try to capture tab via getDisplayMedia (user will be prompted)
      // Fallback: return null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav: any = navigator;
      if (!nav?.mediaDevices?.getDisplayMedia) {
        alert('Screen capture API is not available in this browser.');
        return null;
      }
      const stream: MediaStream = await nav.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const IC = (window as any).ImageCapture;
      const imageCapture = IC ? new IC(track) : null;
      let blob: Blob | null = null;
      if (imageCapture && imageCapture.grabFrame) {
        const bitmap = await imageCapture.grabFrame();
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width; canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(bitmap, 0, 0);
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
      } else {
        // Fallback via video element
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(video, 0, 0);
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
        video.pause();
      }
      track.stop();
      if (!blob) return null;
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id || 'anon';
      const key = `${uid}/${Date.now()}.png`;
      try { await supabase.storage.createBucket('developer-notes', { public: false }); } catch {}
      const { error: upErr } = await supabase.storage.from('developer-notes').upload(key, blob, { upsert: true, contentType: 'image/png' });
      if (upErr) { alert(`Upload failed: ${upErr.message}`); return null; }
      const { data: signed } = await supabase.storage.from('developer-notes').createSignedUrl(key, 7 * 24 * 3600);
      return signed?.signedUrl || null;
    } catch {
      alert('Screenshot capture was cancelled or failed.');
      return null;
    } finally {
      setHideWhilePicking(false);
    }
  }

  const reset = () => {
    setNoteTypes([]);
    setComment('');
    setPriority('Medium');
    setPicking(false);
    setFocusSelector('');
    setFocusBox(null);
    setScreenshotUrl('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalComment = comment;
      // Capture recent client logs for dedicated column
      const logs = getBufferedLogsText(200);
      let link: string | null = screenshotUrl || null;
      if (!link) link = await captureScreenshot();

      const payload: any = {
        notes_type: noteTypes,
        comment: finalComment,
        user_priority: priority,
        focus_area: focusSelector || (focusBox ? JSON.stringify(focusBox) : null),
        screenshot_link: link || null,
        logs: logs || null,
      };
      const { error } = await (supabase as any).from('developer_notes').insert(payload);
      if (error) throw error;
      reset();
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => { if (!saving) onClose(); }} maxWidth="md" fullWidth sx={{ display: hideWhilePicking ? 'none' : 'block' }}>
      <DialogTitle>Developer Note</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 1.5, pt: 4 }}>
        <div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>Note Types</div>
          <FormControl size="small" fullWidth>
            <Select
              multiple
              value={noteTypes}
              open={typesOpen}
              onOpen={() => setTypesOpen(true)}
              onClose={() => setTypesOpen(false)}
              onChange={(e) => {
                const val = e.target.value as string[];
                setNoteTypes(val);
              }}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            >
              {availableTypes.map((t) => (
                <MenuItem
                  key={t}
                  value={t}
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    setNoteTypes((prev) => {
                      const set = new Set(prev);
                      if (set.has(t)) set.delete(t); else set.add(t);
                      return Array.from(set);
                    });
                  }}
                >
                  <Checkbox checked={noteTypes.indexOf(t) > -1} />
                  <ListItemText primary={t} />
                </MenuItem>
              ))}
              <MenuItem onClick={() => setTypesOpen(false)}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <MButton variant="outlined" size="small">Done</MButton>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <TextField
          label="Priority"
          select size="small"
          value={priority}
          onChange={(e) => setPriority((e.target.value as any) || 'Medium')}
        >
          {['High','Medium','Low'].map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
        </TextField>
        <TextField
          label="Comment"
          multiline minRows={12}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div style={{ display: 'grid', gap: 4 }}>
          <div style={{ fontSize: 12, color: '#475569' }}>
            To set a focus area: first click <strong>Pick Focus Area</strong>, then click the element in the interface to highlight. The modal will temporarily disappear while you pick and reappear after selection.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <MButton
              variant="outlined"
              size="small"
              onClick={() => { setPicking(true); setHideWhilePicking(true); }}
            >
              {picking ? 'Click any element…' : 'Pick Focus Area'}
            </MButton>
            <TextField label="Focus Area" size="small" value={focusSelector} fullWidth InputProps={{ readOnly: true }} />
          </div>
        </div>
        {focusBox ? (
          <div style={{ fontSize: 12, color: '#334155' }}>Focus Box: {focusBox.width}×{focusBox.height} at ({focusBox.x},{focusBox.y})</div>
        ) : null}
        <div style={{ display: 'grid', gap: 4 }}>
          <div style={{ fontSize: 12, color: '#475569' }}>
            To capture a screenshot (without the modal), click <strong>Capture Screenshot</strong> and choose the app tab/screen in the browser prompt. The modal will temporarily disappear during capture and then return.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <MButton variant="outlined" size="small" onClick={async () => { const url = await captureScreenshot(); if (url) setScreenshotUrl(url || ''); }}>Capture Screenshot</MButton>
            <TextField label="Screenshot URL" size="small" value={screenshotUrl} fullWidth InputProps={{ readOnly: true }} />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <MButton onClick={onClose} disabled={saving}>Cancel</MButton>
        <MButton variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</MButton>
      </DialogActions>
    </Dialog>
  );
}

function cssPath(el: Element): string {
  if (!(el instanceof Element)) return '';
  const path: string[] = [];
  while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
    let selector = el.nodeName.toLowerCase();
    if ((el as Element).id) {
      selector += `#${(el as Element).id}`;
      path.unshift(selector);
      break;
    } else {
      const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((e) => e.nodeName === el.nodeName) : [];
      if (sibs.length > 1 && el.parentElement) {
        const idx = Array.from(el.parentElement.children).indexOf(el) + 1;
        selector += `:nth-child(${idx})`;
      }
    }
    path.unshift(selector);
    el = el.parentElement as Element;
  }
  return path.join(' > ');
}

function describeElement(el: Element): string {
  try {
    const tag = el.tagName.toLowerCase();
    const id = (el as HTMLElement).id ? `#${(el as HTMLElement).id}` : '';
    const clsRaw = (el as HTMLElement).className || '';
    const cls = typeof clsRaw === 'string' && clsRaw.trim() ? '.' + clsRaw.trim().split(/\s+/).slice(0, 2).join('.') : '';
    const aria = (el as HTMLElement).getAttribute('aria-label') || '';
    const title = (el as HTMLElement).getAttribute('title') || '';
    const pl = (el as HTMLElement).getAttribute('placeholder') || '';
    let text = (el as HTMLElement).textContent || '';
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > 60) text = text.slice(0, 57) + '…';
    const label = aria || title || pl || text;
    return `${tag}${id}${cls}${label ? ` “${label}”` : ''}`;
  } catch {
    return 'element';
  }
}
