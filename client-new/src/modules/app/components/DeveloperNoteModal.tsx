import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button as MButton, TextField, Checkbox, MenuItem, FormControl, Select, ListItemText } from '@mui/material';
import { supabase } from '@/lib/supabase/client';
import { getBufferedLogsText } from '@/lib/log-buffer';

type Props = { open: boolean; onClose: () => void; initialBlob?: Blob | null; initialUrl?: string | null };
 
type EnumOption = string;

export function DeveloperNoteModal({ open, onClose, initialBlob, initialUrl }: Props) {
  const [noteTypes, setNoteTypes] = React.useState<EnumOption[]>([]);
  const [availableTypes, setAvailableTypes] = React.useState<EnumOption[]>([]);
  const [comment, setComment] = React.useState('');
  const [priority, setPriority] = React.useState<'High' | 'Medium' | 'Low'>('Medium');
  const [screenshotUrl, setScreenshotUrl] = React.useState<string>('');
  const [shotBlob, setShotBlob] = React.useState<Blob | null>(null);
  const [shotPreview, setShotPreview] = React.useState<string>('');
  const [pin, setPin] = React.useState<{ x: number; y: number } | null>(null); // normalized 0..1
  const [saving, setSaving] = React.useState(false);
  const [typesOpen, setTypesOpen] = React.useState(false);
  const [hideWhilePicking, setHideWhilePicking] = React.useState(false);

  // If we were provided an initial pre-captured image, preload it when opening
  React.useEffect(() => {
    if (!open) return;
    try {
      if (initialBlob && !shotBlob) {
        setShotBlob(initialBlob);
        const url = URL.createObjectURL(initialBlob);
        setShotPreview(url);
        setScreenshotUrl('');
      } else if (initialUrl && !shotPreview) {
        setShotPreview(initialUrl);
        setScreenshotUrl(initialUrl);
      }
    } catch {}
  }, [open, initialBlob, initialUrl]);

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

  // No DOM picking now that we annotate screenshots

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
      // Hold the blob for annotation rather than uploading immediately
      setShotBlob(blob);
      const url = URL.createObjectURL(blob);
      setShotPreview(url);
      setScreenshotUrl('');
      return url;
    } catch {
      alert('Screenshot capture was cancelled or failed.');
      return null;
    } finally {
      setHideWhilePicking(false);
    }
  }

  async function uploadAnnotated(): Promise<string | null> {
    try {
      if (!shotBlob) return null;
      // If a pin is set, draw it onto an annotated image first
      let toUpload: Blob = shotBlob;
      if (pin) {
        const img = await blobToImage(shotBlob);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');
        ctx.drawImage(img, 0, 0);
        // Draw a red pin/circle at normalized coordinates
        const x = Math.round(pin.x * img.width);
        const y = Math.round(pin.y * img.height);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
        ctx.strokeStyle = 'rgba(220, 38, 38, 1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(6, Math.floor(img.width * 0.006)), 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, Math.max(10, Math.floor(img.width * 0.01)), 0, Math.PI * 2);
        ctx.stroke();
        toUpload = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
        });
      }
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id || 'anon';
      const key = `${uid}/${Date.now()}.png`;
      // Expect the bucket to exist; client cannot create buckets under RLS
      const bucket = 'dev-notes-screenshots';
      const { error: upErr } = await supabase.storage.from(bucket).upload(key, toUpload, { upsert: true, contentType: 'image/png' });
      if (upErr) {
        alert(`Upload failed (ensure storage bucket '${bucket}' exists and policy allows uploads): ${upErr.message}`);
        return null;
      }
      const { data: signed } = await supabase.storage.from(bucket).createSignedUrl(key, 7 * 24 * 3600);
      const link = signed?.signedUrl || null;
      if (link) setScreenshotUrl(link);
      return link;
    } catch (e: any) {
      alert(e?.message || 'Upload failed');
      return null;
    }
  }

  async function captureDomSnapshot(): Promise<void> {
    try {
      setHideWhilePicking(true);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      // Dynamic import libraries to avoid upfront bundle cost
      const [h2cMod, htiMod, dtiMod]: any = await Promise.all([
        import('html2canvas'),
        import('html-to-image'),
        import('dom-to-image-more'),
      ]);
      const html2canvas = h2cMod.default || h2cMod;
      const htmlToImage = htiMod;
      const domToImage = dtiMod;

      // Determine the primary scroll container at the current viewport
      const findActiveScroller = () => {
        const centerX = Math.max(0, Math.min(window.innerWidth - 1, Math.floor(window.innerWidth / 2)));
        const centerY = Math.max(0, Math.min(window.innerHeight - 1, Math.floor(window.innerHeight / 2)));
        let el = document.elementFromPoint(centerX, centerY) as HTMLElement | null;
        const chain: HTMLElement[] = [];
        while (el && el !== document.body && el !== document.documentElement) {
          chain.push(el);
          el = el.parentElement;
        }
        if (document.body) chain.push(document.body);
        if (document.documentElement) chain.push(document.documentElement as any);
        const isScrollable = (node: HTMLElement) => {
          try {
            const cs = getComputedStyle(node);
            const oy = cs.overflowY;
            const ox = cs.overflowX;
            const scrollY = node.scrollHeight - node.clientHeight;
            const scrollX = node.scrollWidth - node.clientWidth;
            return ((oy === 'auto' || oy === 'scroll') && scrollY > 1) || ((ox === 'auto' || ox === 'scroll') && scrollX > 1);
          } catch { return false; }
        };
        // Prefer the nearest ancestor that is actually scrollable
        for (const n of chain) {
          if (isScrollable(n)) return n;
        }
        // Fallback: element with the largest overflow among common containers
        const candidates: HTMLElement[] = [
          (document.scrollingElement as HTMLElement | null) || undefined,
          document.getElementById('root') as HTMLElement | null,
          document.querySelector('main') as HTMLElement | null,
          document.querySelector('#app') as HTMLElement | null,
          document.body as any,
          document.documentElement as any,
        ].filter(Boolean) as HTMLElement[];
        let best: HTMLElement = document.documentElement as any;
        let bestOverflow = -1;
        for (const c of candidates) {
          try {
            const overflow = (c.scrollHeight - c.clientHeight) + (c.scrollWidth - c.clientWidth);
            if (overflow > bestOverflow) { bestOverflow = overflow; best = c; }
          } catch {}
        }
        return best;
      };
      const scroller = findActiveScroller();
      const targetNode = scroller; // capture the primary scrolling container directly
      const fullW = Math.max((scroller as any).scrollWidth || 0, (scroller as any).clientWidth || 0);
      const fullH = Math.max((scroller as any).scrollHeight || 0, (scroller as any).clientHeight || 0);

      // Do not pre-scroll; we want the exact viewport as-is.

      // Preferred: capture only the current viewport without moving scroll
      const vx = (scroller as any).scrollLeft || 0;
      const vy = (scroller as any).scrollTop || 0;
      const vw = (scroller as any).clientWidth || 0;
      const vh = (scroller as any).clientHeight || 0;
      try {
        const id = (scroller as HTMLElement).id ? '#' + (scroller as HTMLElement).id : '';
        const cls = (scroller as HTMLElement).className ? '.' + String((scroller as HTMLElement).className).split(/\s+/).slice(0,2).join('.') : '';
        const sh = (scroller as any).scrollHeight, ch = (scroller as any).clientHeight;
        console.log('[DevNotes] Quick Snapshot: starting viewport capture', { vx, vy, vw, vh, scroller: scroller.tagName + id + cls, scrollHeight: sh, clientHeight: ch });
      } catch {}

      // 1) Try dom-to-image-more (SVG foreignObject)
      try {
        try { console.log('[DevNotes] Quick Snapshot: trying dom-to-image-more (viewport)'); } catch {}
        // Render a cloned subtree inside an offscreen wrapper to avoid any interaction with live scroll
        const wrapper1 = document.createElement('div');
        wrapper1.style.position = 'fixed';
        wrapper1.style.inset = '0';
        wrapper1.style.overflow = 'hidden';
        wrapper1.style.pointerEvents = 'none';
        wrapper1.style.opacity = '0';
        const node = targetNode.cloneNode(true) as HTMLElement;
        wrapper1.appendChild(node);
        document.body.appendChild(wrapper1);
        const style = {
          width: `${fullW}px`,
          height: `${fullH}px`,
          background: '#ffffff',
          transform: `translate(${-vx}px, ${-vy}px)`,
          transformOrigin: 'top left',
        } as any;
        const blob = await (domToImage as any).toBlob(node, {
          cacheBust: true,
          width: vw,
          height: vh,
          style,
          bgcolor: '#ffffff',
        });
        if (blob) {
          try { console.log('[DevNotes] Quick Snapshot: used dom-to-image-more (viewport)'); } catch {}
          setShotBlob(blob);
          const url = URL.createObjectURL(blob);
          setShotPreview(url);
          setScreenshotUrl('');
          try { document.body.removeChild(wrapper1); } catch {}
          return;
        }
        try { document.body.removeChild(wrapper1); } catch {}
      } catch {}

      // 2) Try html-to-image (similar FO approach)
      try {
        try { console.log('[DevNotes] Quick Snapshot: trying html-to-image (viewport)'); } catch {}
        const wrapper2 = document.createElement('div');
        wrapper2.style.position = 'fixed';
        wrapper2.style.inset = '0';
        wrapper2.style.overflow = 'hidden';
        wrapper2.style.pointerEvents = 'none';
        wrapper2.style.opacity = '0';
        const node = targetNode.cloneNode(true) as HTMLElement;
        wrapper2.appendChild(node);
        document.body.appendChild(wrapper2);
        const style = {
          width: `${fullW}px`,
          height: `${fullH}px`,
          background: '#ffffff',
          transform: `translate(${-vx}px, ${-vy}px)`,
          transformOrigin: 'top left',
        } as any;
        const blob = await (htmlToImage as any).toBlob(node, {
          cacheBust: true,
          pixelRatio: 1,
          backgroundColor: '#ffffff',
          width: vw,
          height: vh,
          style,
          skipFonts: false,
        });
        if (blob) {
          try { console.log('[DevNotes] Quick Snapshot: used html-to-image (viewport)'); } catch {}
          setShotBlob(blob);
          const url = URL.createObjectURL(blob);
          setShotPreview(url);
          setScreenshotUrl('');
          try { document.body.removeChild(wrapper2); } catch {}
          return;
        }
        try { document.body.removeChild(wrapper2); } catch {}
      } catch {}

      // 3) Try html2canvas viewport with scroll offsets (non-FO; may fail on CSS4 color())
      try {
        try { console.log('[DevNotes] Quick Snapshot: trying html2canvas (viewport)'); } catch {}
        const canvas: HTMLCanvasElement = await html2canvas(targetNode, {
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: fullW,
          windowHeight: fullH,
          width: vw,
          height: vh,
          scrollX: -vx,
          scrollY: -vy,
          foreignObjectRendering: false,
        } as any);
        const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
        if (blob) {
          try { console.log('[DevNotes] Quick Snapshot: used html2canvas (viewport)'); } catch {}
          setShotBlob(blob);
          const url = URL.createObjectURL(blob);
          setShotPreview(url);
          setScreenshotUrl('');
          return;
        }
      } catch {}

      try { console.log('[DevNotes] Quick Snapshot: falling back to tiled full-page capture'); } catch {}

      // Stitch the page in tiles (fallback) to ensure content beyond viewport renders
      const viewportH = window.innerHeight || 900;
      const tileH = Math.max(600, Math.min(viewportH, 1200));

      // Guard against huge canvases by scaling down if necessary
      const MAX_DIM = 16384; // conservative cross-browser limit
      const scale = Math.min(1, MAX_DIM / fullW, MAX_DIM / fullH);
      const outW = Math.floor(fullW * scale);
      const outH = Math.floor(fullH * scale);
      const outCanvas = document.createElement('canvas');
      outCanvas.width = outW;
      outCanvas.height = outH;
      const outCtx = outCanvas.getContext('2d');
      if (!outCtx) throw new Error('Canvas unavailable');
      // Persist original scroll position on window to restore later
      (window as unknown as any).__WF_ORIG_SCROLL_X = window.pageXOffset || 0;
      (window as unknown as any).__WF_ORIG_SCROLL_Y = window.pageYOffset || 0;

      const baseOpts = {
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: fullW,
        windowHeight: tileH,
        width: fullW,
        height: tileH,
      } as const;

      const origX = window.pageXOffset || 0;
      const origY = window.pageYOffset || 0;
      let y = 0;
      while (y < fullH) {
        const h = Math.min(tileH, fullH - y);
        // Scroll live window to the tile start to coerce virtualized content to render
        window.scrollTo(0, y);
        // Wait a frame to allow layout/paint
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        // Capture the viewport-sized tile, offsetting with scrollY so html2canvas crops the correct slice
        const optsViewport = {
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: window.innerWidth,
          windowHeight: h,
          width: window.innerWidth,
          height: h,
          scrollX: 0,
          scrollY: -y,
          foreignObjectRendering: false,
        } as any;
        let tile: HTMLCanvasElement | null = null;
        try {
          tile = await html2canvas(document.documentElement, optsViewport);
        } catch {
          tile = await html2canvas(document.body, optsViewport);
        }
        if (!tile) break;
        // Draw the tile into the output canvas at scaled position
        const destY = Math.floor(y * scale);
        const destH = Math.floor(h * scale);
        outCtx.drawImage(tile, 0, 0, tile.width, tile.height, 0, destY, outW, destH);
        y += h;
        // Yield occasionally to keep UI responsive
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 10));
      }

      const blob: Blob | null = await new Promise((resolve) => outCanvas.toBlob((b) => resolve(b), 'image/png'));
      if (!blob) throw new Error('Snapshot failed');
      setShotBlob(blob);
      const url = URL.createObjectURL(blob);
      setShotPreview(url);
      setScreenshotUrl('');
    } catch (e: any) {
      alert(e?.message || 'Quick snapshot failed');
    } finally {
      // Restore original scroll position
      try {
        const w: any = window as any;
        const ox = w.__WF_ORIG_SCROLL_X as number | undefined;
        const oy = w.__WF_ORIG_SCROLL_Y as number | undefined;
        if (typeof ox === 'number' && typeof oy === 'number') window.scrollTo(ox, oy);
      } catch {}
      setHideWhilePicking(false);
    }
  }

  const reset = () => {
    setNoteTypes([]);
    setComment('');
    setPriority('Medium');
    setShotBlob(null);
    setShotPreview('');
    setPin(null);
    setScreenshotUrl('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalComment = comment;
      // Capture recent client logs for dedicated column
      const logs = getBufferedLogsText(200);
      let link: string | null = screenshotUrl || null;
      if (!link && shotBlob) link = await uploadAnnotated();

      const payload: any = {
        notes_type: noteTypes,
        comment: finalComment,
        user_priority: priority,
        focus_area: null,
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
        {/* Screenshot annotation instead of DOM focus picker */}
        <div style={{ display: 'grid', gap: 4 }}>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Capture a screenshot, then click on the image to mark the problem area. Use <strong>Quick Snapshot</strong> (no prompt) for a DOM render, or <strong>Capture Screen</strong> to choose a tab/window.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <MButton variant="outlined" size="small" onClick={async () => { await captureDomSnapshot(); }}>Quick Snapshot (no prompt)</MButton>
            <MButton variant="outlined" size="small" onClick={async () => { await captureScreenshot(); }}>Capture Screen</MButton>
            <MButton variant="outlined" size="small" disabled={!shotBlob} onClick={async () => { const link = await uploadAnnotated(); if (!link) return; }}>Save Screenshot</MButton>
            <TextField label="Screenshot URL" size="small" value={screenshotUrl} fullWidth InputProps={{ readOnly: true }} />
          </div>
          {shotPreview ? (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 4, overflow: 'auto', maxHeight: '65vh' }}>
              <ScreenshotCanvas imageUrl={shotPreview} pin={pin} onPick={(pt) => setPin(pt)} />
            </div>
          ) : null}
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

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function ScreenshotCanvas({ imageUrl, pin, onPick }: { imageUrl: string; pin: { x: number; y: number } | null; onPick: (pt: { x: number; y: number }) => void }) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [size, setSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });

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
    const canvas = ref.current;
    if (!canvas || !img) return;
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.drawImage(img, 0, 0, size.w, size.h);
    if (pin) {
      const x = Math.round(pin.x * size.w);
      const y = Math.round(pin.y * size.h);
      ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
      ctx.strokeStyle = 'rgba(220, 38, 38, 1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(4, Math.floor(size.w * 0.006)), 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, Math.max(8, Math.floor(size.w * 0.01)), 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [img, size, pin]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onPick({ x, y });
  }

  return <canvas ref={ref} width={size.w} height={size.h} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }} onClick={handleClick} />;
}
