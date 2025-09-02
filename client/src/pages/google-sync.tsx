/**
 * Entry point for the optional Google Sync dashboard. Simply renders the
 * `GoogleSyncDashboard` component which manages Gmail and Calendar sync status.
 */
import React from 'react';
import { GoogleSyncDashboard } from '@/components/google/GoogleSyncDashboard';

export default function GoogleSyncPage() {
  return <GoogleSyncDashboard />;
}
