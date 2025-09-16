import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../auth/auth-context';
import { UserFilterProvider } from '../contexts/user-filter-context';

const qc = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <UserFilterProvider>
          {children}
        </UserFilterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
