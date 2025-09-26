import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import { EducatorsPage } from '../educators/pages/EducatorsPage';
import { SchoolsPage } from '../schools/pages/SchoolsPage';
import { ChartersPage } from '../charters/pages/ChartersPage';
import { Header } from './components/Header';
import { RequireAuth, useAuth } from '../auth/auth-context';
import { useLocation } from 'wouter';
import { LoginPage } from '../auth/pages/LoginPage';
import { ResetPage } from '../auth/pages/ResetPage';
import { EducatorDetailPage } from '../educators/pages/EducatorDetailPage';
import { SchoolDetailPage } from '../schools/pages/SchoolDetailPage';
import { CharterDetailPage } from '../charters/pages/CharterDetailPage';
import { initAgGridEnterprise } from '@/lib/ag-grid';
import { initLogBuffer } from '@/lib/log-buffer';
import { EducatorsKanbanPage } from '../educators/pages/EducatorsKanbanPage';
import { EducatorsSplitPage } from '../educators/pages/EducatorsSplitPage';
import { SchoolsKanbanPage } from '../schools/pages/SchoolsKanbanPage';
import { SchoolsSplitPage } from '../schools/pages/SchoolsSplitPage';
import { ChartersKanbanPage } from '../charters/pages/ChartersKanbanPage';
import { ChartersSplitPage } from '../charters/pages/ChartersSplitPage';
import { SettingsPage } from '../settings/pages/SettingsPage';
import { ComposeEmailPage } from '../email/ComposeEmailPage';
import { DashboardPage } from '../dashboard/pages/DashboardPage';

export function App() {
  return (
    <div className="min-h-screen font-sans">
      <AgInit />
      <Header />
      <main className="p-4">
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/dashboard">
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          </Route>
          <Route path="/login" component={LoginPage} />
          <Route path="/reset" component={ResetPage} />

          <Route path="/educators">
            <RequireAuth>
              <EducatorsPage />
            </RequireAuth>
          </Route>
          <Route path="/educators/kanban">
            <RequireAuth>
              <EducatorsKanbanPage />
            </RequireAuth>
          </Route>
          <Route path="/educators/split">
            <RequireAuth>
              <EducatorsSplitPage />
            </RequireAuth>
          </Route>
          <Route path="/educators/:id">{(params: any) => (
            <RequireAuth>
              <EducatorDetailPage params={params} />
            </RequireAuth>
          )}</Route>

          <Route path="/schools">
            <RequireAuth>
              <SchoolsPage />
            </RequireAuth>
          </Route>
          <Route path="/schools/kanban">
            <RequireAuth>
              <SchoolsKanbanPage />
            </RequireAuth>
          </Route>
          <Route path="/schools/split">
            <RequireAuth>
              <SchoolsSplitPage />
            </RequireAuth>
          </Route>
          <Route path="/schools/:id">{(params: any) => (
            <RequireAuth>
              <SchoolDetailPage params={params} />
            </RequireAuth>
          )}</Route>

          <Route path="/charters">
            <RequireAuth>
              <ChartersPage />
            </RequireAuth>
          </Route>
          <Route path="/charters/kanban">
            <RequireAuth>
              <ChartersKanbanPage />
            </RequireAuth>
          </Route>
          <Route path="/charters/split">
            <RequireAuth>
              <ChartersSplitPage />
            </RequireAuth>
          </Route>
          <Route path="/charters/:id">{(params: any) => (
            <RequireAuth>
              <CharterDetailPage params={params} />
            </RequireAuth>
          )}</Route>

          <Route path="/settings">
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          </Route>

          <Route path="/email/compose">
            <RequireAuth>
              <ComposeEmailPage />
            </RequireAuth>
          </Route>

          <Route>Not found</Route>
        </Switch>
      </main>
    </div>
  );
}

function AgInit() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) {
      initAgGridEnterprise();
      try { initLogBuffer(); } catch {}
      setDone(true);
    }
  }, [done]);
  return null;
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!loading) {
      navigate(user ? '/dashboard' : '/login', { replace: true });
    }
  }, [loading, user, navigate]);
  return null;
}
