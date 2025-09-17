import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../auth/auth-context';

export function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="px-4 py-2 border-b flex items-center gap-4">
      <nav className="flex gap-4">
        <Link href="/educators">Educators</Link>
        <Link href="/schools">Schools</Link>
        <Link href="/charters">Charters</Link>
        <Link href="/settings">Settings</Link>
      </nav>
      <div className="ml-auto text-sm">
        {user ? (
          <div className="flex items-center gap-3">
            <span>{user.email}</span>
            <button className="px-2 py-1 border rounded" onClick={signOut}>Sign out</button>
          </div>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </div>
    </header>
  );
}

