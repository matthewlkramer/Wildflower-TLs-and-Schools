import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../auth/auth-context';
import wildflowerLogo from '@/assets/wildflower-logo.jpeg';
import { Button } from '@/components/ui/button';

type NavItem = {
  label: string;
  href: string;
  match: RegExp;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Educators', href: '/educators', match: /^\/educators/ },
  { label: 'Schools', href: '/schools', match: /^\/schools/ },
  { label: 'Charters', href: '/charters', match: /^\/charters/ },
];

export function Header() {
  const { user, signOut } = useAuth();
  const [location] = useLocation();

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

      <div className="app-header__account">
        {user ? (
          <>
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
