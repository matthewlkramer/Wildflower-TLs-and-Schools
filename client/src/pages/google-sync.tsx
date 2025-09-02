/**
 * Lightweight wrapper that mounts the `GoogleSyncDashboard`. That dashboard
 * handles OAuth, shows log streams, and triggers Gmail/Calendar sync edge
 * functions. This page exists so the dashboard can live under `/google-sync` as
 * a standalone route.
 */
import React from 'react';
import { GoogleSyncDashboard } from '@/components/google/GoogleSyncDashboard';

export default function GoogleSyncPage() {
  return <GoogleSyncDashboard />;
}
