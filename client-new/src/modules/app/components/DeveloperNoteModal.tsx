import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MButton, TextField, Checkbox, MenuItem, FormControl, Select, ListItemText } from '@mui/material';
import { supabase } from '@/lib/supabase/client';
import { getBufferedLogsText } from '@/lib/log-buffer';

type Props = { open: boolean; onClose: () => void; initialBlob?: Blob | null; initialUrl?: string | null };
type EnumOption = string;
type Point = { x: number; y: number };
type Rect = { x: number; y: number; w: number; h: number };

export function DeveloperNoteModal({ open, onClose, initialBlob, initialUrl }: Props) {
  const [noteTypes, setNoteTypes] = React.useState<EnumOption[]>([]);
  const [availableTypes, setAvailableTypes] = React.useState<EnumOption[]>([]);
  const [comment, setComment] = React.useState('');
  const [priority, setPriority] = React.useState<'High' | 'Medium' | 'Low'>('Medium');
  const [screenshotUrl, setScreenshotUrl] = React.useState<string>('');
  const [shotBlob, setShotBlob] = React.useState<Blob | null>(null);
  const [shotPreview, setShotPreview] = React.useState<string>('');
  const [pin, setPin] = React.useState<Point | null>(null);
  const [rect, setRect] = React.useState<Rect | null>(null);
  const [annotate, setAnnotate] = React.useState<boolean>(false);
  const [tool, setTool] = React.useState<'dot' | 'rect'>('dot');
  const [saving, setSaving] = React.useState(false);
  const [typesOpen, setTypesOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let { data, error } = await (supabase as any).rpc('enum_values', { enum_type: 'dev_note_type' });
        if (error) {
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
    if (!open) return;
    try {
      if (initialBlob) {
        setShotBlob(initialBlob);
        const url = URL.createObjectURL(initialBlob);
        setShotPreview(url);
        setScreenshotUrl('');
      } else if (initialUrl) {
        setShotPreview(initialUrl);
        setScreenshotUrl(initialUrl);
      }
    } catch {}
  }, [open, initialBlob, initialUrl]);

  async function uploadAnnotated(): Promise<string | null> {
    try {
      if (!shotBlob) return null;
      let toUpload: Blob = shotBlob;
      if (pin || rect) {
        const img = await blobToImage(shotBlob);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
        ctx.strokeStyle = 'rgba(220, 38, 38, 1)';
        ctx.lineWidth = 2;
        if (pin) {
          const x = Math.round(pin.x * img.width);
          const y = Math.round(pin.y * img.height);
          ctx.beginPath(); ctx.arc(x, y, Math.max(6, Math.floor(img.width * 0.006)), 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, Math.max(10, Math.floor(img.width * 0.01)), 0, Math.PI * 2); ctx.stroke();
        }
        if (rect) {
          const rx = Math.round(rect.x * img.width), ry = Math.round(rect.y * img.height);
          const rw = Math.round(rect.w * img.width), rh = Math.round(rect.h * img.height);
          ctx.strokeRect(rx, ry, rw, rh);
        }
        toUpload = await new Promise<Blob>((resolve, reject) => { canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'); });
      }
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id || 'anon';
      const key = `${uid}/${Date.now()}.png`;
      const bucket = 'dev-notes-screenshots';
      const { error: upErr } = await supabase.storage.from(bucket).upload(key, toUpload, { upsert: true, contentType: 'image/png' });
      if (upErr) { alert(`Upload failed (ensure storage bucket '${bucket}' exists and policy allows uploads): ${upErr.message}`); return null; }
      const { data: signed } = await supabase.storage.from(bucket).createSignedUrl(key, 7 * 24 * 3600);
      const link = signed?.signedUrl || null;
      if (link) setScreenshotUrl(link);
      return link;
    } catch (e: any) { alert(e?.message || 'Upload failed'); return null; }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const logs = getBufferedLogsText(200);
      let link: string | null = screenshotUrl || null;
      if (!link && shotBlob) link = await uploadAnnotated();
      const payload: any = { notes_type: noteTypes, comment, user_priority: priority, focus_area: null, screenshot_link: link || null, logs: logs || null };
      const { error } = await (supabase as any).from('developer_notes').insert(payload);
      if (error) throw error; reset(); onClose();
    } catch (e: any) { alert(e?.message || 'Failed to submit note'); } finally { setSaving(false); }
  };

  const reset = () => { setNoteTypes([]); setComment(''); setPriority('Medium'); setShotBlob(null); setShotPreview(''); setPin(null); setRect(null); setScreenshotUrl(''); setAnnotate(false); setTool('dot'); };

  return (
    <Dialog open={open} onClose={() => { if (!saving) onClose(); }} maxWidth="md" fullWidth>
      <DialogTitle>Developer Note</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 1.5, pt: 4 }}>
        <div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>Note Types</div>
          <FormControl size="small" fullWidth>
            <Select multiple value={noteTypes} open={typesOpen} onOpen={() => setTypesOpen(true)} onClose={() => setTypesOpen(false)} onChange={(e) => setNoteTypes(e.target.value as string[])} renderValue={(selected) => (selected as string[]).join(', ')} MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}>
              {availableTypes.map((t) => (
                <MenuItem key={t} value={t} onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); setNoteTypes((prev) => { const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return Array.from(s); }); }}>
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
        <TextField label="Priority" select size="small" value={priority} onChange={(e) => setPriority((e.target.value as any) || 'Medium')}>
          {['High','Medium','Low'].map((p) => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
        </TextField>
        <TextField label="Comment" multiline minRows={12} value={comment} onChange={(e) => setComment(e.target.value)} />

        <div style={{ display: 'grid', gap: 4 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <MButton variant="outlined" size="small" onClick={() => setAnnotate((v) => !v)}>{annotate ? 'Close Annotate' : 'Annotate'}</MButton>
            <MButton variant="outlined" size="small" onClick={() => { setShotBlob(null); setShotPreview(''); setPin(null); setRect(null); setScreenshotUrl(''); }}>Delete Screenshot</MButton>
            {annotate ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12 }}>Tool:</span>
                <MButton size="small" variant={tool === 'dot' ? 'contained' : 'outlined'} onClick={() => setTool('dot')}>Dot</MButton>
                <MButton size="small" variant={tool === 'rect' ? 'contained' : 'outlined'} onClick={() => setTool('rect')}>Rectangle</MButton>
              </div>
            ) : null}
          </div>
          {shotPreview ? (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'auto', maxHeight: '65vh' }}>
              <CanvasAnnotator imageUrl={shotPreview} enableAnnotate={annotate} tool={tool} pin={pin} rect={rect} onPickDot={setPin} onPickRect={setRect} />
            </div>
          ) : null}
        </div>
      </DialogContent>
      <DialogActions>
        <MButton onClick={onClose} disabled={saving}>Cancel</MButton>
        <MButton variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Submitting.' : 'Submit'}</MButton>
      </DialogActions>
    </Dialog>
  );
}

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function CanvasAnnotator({ imageUrl, enableAnnotate, tool, pin, rect, onPickDot, onPickRect }: { imageUrl: string; enableAnnotate: boolean; tool: 'dot' | 'rect'; pin: Point | null; rect: Rect | null; onPickDot: (p: Point) => void; onPickRect: (r: Rect) => void }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [size, setSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [dragStart, setDragStart] = React.useState<Point | null>(null);
  const [dragRect, setDragRect] = React.useState<Rect | null>(null);

  React.useEffect(() => {
    const i = new Image();
    i.onload = () => {
      setImg(i);
      const maxW = 800;
      const scale = i.width > maxW ? maxW / i.width : 1;
      setSize({ w: Math.round(i.width * scale), h: Math.round(i.height * scale) });
    };
    i.src = imageUrl;
  }, [imageUrl]);

  React.useEffect(() => {
    const canvas = ref.current; if (!canvas || !img) return;
    canvas.width = size.w; canvas.height = size.h;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.drawImage(img, 0, 0, size.w, size.h);
    if (pin) {
      const x = Math.round(pin.x * size.w);
      const y = Math.round(pin.y * size.h);
      ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
      ctx.strokeStyle = 'rgba(220, 38, 38, 1)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, Math.max(4, Math.floor(size.w * 0.006)), 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, Math.max(8, Math.floor(size.w * 0.01)), 0, Math.PI * 2); ctx.stroke();
    }
    const r = dragRect || rect;
    if (r) {
      const rx = Math.round(r.x * size.w), ry = Math.round(r.y * size.h);
      const rw = Math.round(r.w * size.w), rh = Math.round(r.h * size.h);
      ctx.strokeStyle = 'rgba(220, 38, 38, 1)'; ctx.lineWidth = 2; ctx.strokeRect(rx, ry, rw, rh);
    }
  }, [img, size, pin, rect, dragRect]);

  const toNorm = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!enableAnnotate) return;
    if (tool === 'rect') { const p = toNorm(e); setDragStart(p); setDragRect({ x: p.x, y: p.y, w: 0, h: 0 }); }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!enableAnnotate) return;
    if (tool === 'rect' && dragStart) {
      const p = toNorm(e);
      const x = Math.min(dragStart.x, p.x), y = Math.min(dragStart.y, p.y);
      const w = Math.abs(p.x - dragStart.x), h = Math.abs(p.y - dragStart.y);
      setDragRect({ x, y, w, h });
    }
  };
  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!enableAnnotate) return;
    if (tool === 'dot') onPickDot(toNorm(e));
    else if (tool === 'rect' && dragRect) onPickRect(dragRect);
    setDragStart(null); setDragRect(null);
  };

  return (
    <canvas ref={ref} width={size.w} height={size.h} style={{ width: '100%', height: 'auto', display: 'block', cursor: enableAnnotate ? 'crosshair' : 'default' }} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
  );
}

