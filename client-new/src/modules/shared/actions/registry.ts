import type { RowActionId } from '../detail-types';

export type RowActionDef = { id: RowActionId; label: string };

const defs: Readonly<Record<RowActionId, RowActionDef>> = {
  inline_edit: { id: 'inline_edit', label: 'Inline Edit' },
  view_in_modal: { id: 'view_in_modal', label: 'View' },
  jump_to_modal: { id: 'jump_to_modal', label: 'Open Linked' },
  toggle_complete: { id: 'toggle_complete', label: 'Toggle Complete' },
  toggle_private_public: { id: 'toggle_private_public', label: 'Toggle Private' },
  toggle_valid: { id: 'toggle_valid', label: 'Toggle Valid' },
  make_primary: { id: 'make_primary', label: 'Make Primary' },
  archive: { id: 'archive', label: 'Archive' },
  end_stint: { id: 'end_stint', label: 'End Stint' },
  add_note: { id: 'add_note', label: 'Add Note' },
  add_task: { id: 'add_task', label: 'Add Task' },
  email: { id: 'email', label: 'Email' },
} as const;

export function getRowActionLabel(id: RowActionId): string {
  return defs[id]?.label || id;
}

// Table action label fallback; converts camel/snake to Title Case
export function formatActionLabel(raw: string): string {
  return raw
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

