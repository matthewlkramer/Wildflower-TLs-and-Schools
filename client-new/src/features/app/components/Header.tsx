import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../auth/auth-context';
import wildflowerLogo from '@/assets/wildflower-logo.jpeg';
import { Button } from '@/shared/components/ui/button';
import { DeveloperNoteModal } from './DeveloperNoteModal';

type NavItem = {
  label: string;
  href: string;
  match: RegExp;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', match: /^\/(dashboard)?$/ },
  { label: 'Educators', href: '/educators', match: /^\/educators/ },
  { label: 'Schools', href: '/schools', match: /^\/schools/ },
  { label: 'Charters', href: '/charters', match: /^\/charters/ },
];

export function Header() {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [preShotUrl, setPreShotUrl] = React.useState<string>('');
  const [preShotBlob, setPreShotBlob] = React.useState<Blob | null>(null);

  // Capture the current viewport before opening Dev Notes
  const handleQuickCaptureAndOpen = React.useCallback(async () => {
    try {
      console.log('[DevNotes] Header capture: start');
      const dtiMod: any = await import('dom-to-image-more');
      const domToImage = dtiMod;

      // Find active scroller (center of viewport)
      const centerX = Math.max(0, Math.min(window.innerWidth - 1, Math.floor(window.innerWidth / 2)));
      const centerY = Math.max(0, Math.min(window.innerHeight - 1, Math.floor(window.innerHeight / 2)));
      let el = document.elementFromPoint(centerX, centerY) as HTMLElement | null;
      const chain: HTMLElement[] = [];
      while (el && el !== document.body && el !== document.documentElement) { chain.push(el); el = el.parentElement; }
      if (document.body) chain.push(document.body);
      if (document.documentElement) chain.push(document.documentElement);
      const isScrollable = (node: HTMLElement) => {
        try {
          const cs = getComputedStyle(node);
          const oy = cs.overflowY, ox = cs.overflowX;
          const sy = node.scrollHeight - node.clientHeight;
          const sx = node.scrollWidth - node.clientWidth;
          return ((oy === 'auto' || oy === 'scroll') && sy > 1) || ((ox === 'auto' || ox === 'scroll') && sx > 1);
        } catch { return false; }
      };
      let scroller = chain.find(isScrollable) || (document.scrollingElement as HTMLElement) || document.documentElement;
      const vx = scroller.scrollLeft || 0;
      const vy = scroller.scrollTop || 0;
      const vw = scroller.clientWidth || window.innerWidth;
      const vh = scroller.clientHeight || window.innerHeight;
      const fullW = Math.max(scroller.scrollWidth || vw, vw);
      const fullH = Math.max(scroller.scrollHeight || vh, vh);
      console.log('[DevNotes] Header capture: viewport', { vx, vy, vw, vh, scroller: scroller.tagName, fullW, fullH });

      // Clone into an invisible wrapper and render the clone, so live scroll never moves
      const withWrapper = async (render: (node: HTMLElement) => Promise<Blob | null>) => {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed'; wrapper.style.inset = '0'; wrapper.style.overflow = 'hidden';
        wrapper.style.pointerEvents = 'none'; wrapper.style.opacity = '0';
        const node = scroller.cloneNode(true) as HTMLElement;
        wrapper.appendChild(node); document.body.appendChild(wrapper);
        try { return await render(node); } finally { try { document.body.removeChild(wrapper); } catch {} }
      };

      // Use dom-to-image-more only (FO)
      try {
        const blob = await withWrapper(async (node) => (domToImage as any).toBlob(node, {
          cacheBust: true,
          width: vw,
          height: vh,
          style: { width: `${fullW}px`, height: `${fullH}px`, background: '#ffffff', transform: `translate(${-vx}px, ${-vy}px)`, transformOrigin: 'top left' },
          bgcolor: '#ffffff',
        }));
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPreShotBlob(blob); setPreShotUrl(url); setNoteOpen(true);
          console.log('[DevNotes] Header capture: used dom-to-image-more');
          return;
        }
      } catch {}

      // If all fail, open modal without pre-shot
      setPreShotBlob(null); setPreShotUrl(''); setNoteOpen(true);
    } catch (e) {
      console.warn('[DevNotes] Header capture failed', e);
      setNoteOpen(true);
    }
  }, []);

  return (
    <header className="app-header">
      <div className="app-header__logo">
        <Link href="/" className="app-header__logo-link" aria-label="TLs & Schools">
          <img className="app-header__logo-image" src={wildflowerLogo} alt="Wildflower" />
          <span className="app-header__brand-text">
            <span className="app-header__brand-name">TLs &amp; Schools</span>
          </span>
        </Link>
      </div>

      <nav className="app-header__nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match.test(location);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`app-header__nav-link${isActive ? ' app-header__nav-link--active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="app-header__account" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            <button
              type="button"
              title="Add Developer Note"
              aria-label="Add Developer Note"
              onClick={handleQuickCaptureAndOpen}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: '#0f172a', padding: 6, borderRadius: 6
              }}
            >
              <DeltaIcon />
            </button>
            <Link href="/settings" className="app-header__settings" aria-label="Settings">
              <SettingsIcon />
            </Link>
            <span className="app-header__email" title={user.email ?? ''}>
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </>
        ) : (
          <Link href="/login" className="app-header__sign-in">
            Sign in
          </Link>
        )}
      </div>

      <DeveloperNoteModal open={noteOpen} onClose={() => setNoteOpen(false)} initialBlob={preShotBlob || undefined} initialUrl={preShotUrl || undefined} />
    </header>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="app-header__settings-icon"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11.3 1.67c-.42-1.11-2.19-1.11-2.61 0l-.34.9a1.67 1.67 0 0 1-2.34.93l-.85-.4c-1.07-.5-2.25.57-1.75 1.64l.4.85a1.67 1.67 0 0 1-.93 2.34l-.9.34c-1.11.42-1.11 2.19 0 2.61l.9.34a1.67 1.67 0 0 1 .93 2.34l-.4.85c-.5 1.07.57 2.25 1.64 1.75l.85-.4a1.67 1.67 0 0 1 2.34.93l.34.9c.42 1.11 2.19 1.11 2.61 0l.34-.9a1.67 1.67 0 0 1 2.34-.93l.85.4c1.07.5 2.25-.57 1.75-1.64l-.4-.85a1.67 1.67 0 0 1 .93-2.34l.9-.34c1.11-.42 1.11-2.19 0-2.61l-.9-.34a1.67 1.67 0 0 1-.93-2.34l.4-.85c.5-1.07-.57-2.25-1.64-1.75l-.85.4a1.67 1.67 0 0 1-2.34-.93l-.34-.9Z"
        fill="currentColor"
      />
      <path
        d="M10 12.5A2.5 2.5 0 1 0 10 7.5a2.5 2.5 0 0 0 0 5Z"
        fill="#ffffff"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function DeltaIcon() {
  // Outline delta (triangle) icon for better visual affordance
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      style={{ display: 'block' }}
    >
      <path
        d="M12 4 L21 20 H3 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
