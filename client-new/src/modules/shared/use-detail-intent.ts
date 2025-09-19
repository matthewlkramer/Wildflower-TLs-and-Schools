import React from 'react';
import { useLocation } from 'wouter';

import type { DetailTabSpec, RowActionId } from './detail-types';

type DetailIntent = {
  defaultTabId?: string;
  autoEditFirstCard: boolean;
  initialRowAction?: { tabId?: string; action: RowActionId };
};

const FALLBACK_TAB_BY_ACTION: Partial<Record<RowActionId, string>> = {
  add_note: 'notes',
  add_task: 'action_steps',
};

export function useDetailIntent(tabs: DetailTabSpec[]): DetailIntent {
  const [location] = useLocation();

  const query = React.useMemo(() => {
    const idx = location.indexOf('?');
    return idx >= 0 ? location.slice(idx + 1) : '';
  }, [location]);

  const params = React.useMemo(() => new URLSearchParams(query), [query]);
  const tabIds = React.useMemo(() => new Set(tabs.map((tab) => tab.id)), [tabs]);

  let action = params.get('action') as RowActionId | null;
  const mode = params.get('mode');
  const modal = params.get('modal');

  if (!action && mode === 'edit') action = 'inline_edit';
  if (!action && modal === 'view') action = 'view_in_modal';

  let section = params.get('section') || undefined;
  if (!section && action && FALLBACK_TAB_BY_ACTION[action]) {
    section = FALLBACK_TAB_BY_ACTION[action];
  }
  if (section && !tabIds.has(section)) {
    section = undefined;
  }
  if (!section && tabs.length > 0 && action === 'inline_edit') {
    section = tabs[0].id;
  }

  const autoEditFirstCard = action === 'inline_edit';
  const initialRowAction = action === 'view_in_modal' ? { tabId: section, action: 'view_in_modal' as RowActionId } : undefined;

  return React.useMemo(() => ({
    defaultTabId: section,
    autoEditFirstCard,
    initialRowAction,
  }), [section, autoEditFirstCard, initialRowAction]);
}
