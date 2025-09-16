export const ROW_ACTIONS = {
  actionSteps: Object.freeze(['inline_edit', 'mark_complete', 'archive'] as const),
  notesCamel: Object.freeze(['inline_edit', 'markPrivate', 'archive'] as const),
  notesSnake: Object.freeze(['inline_edit', 'mark_private', 'archive'] as const),
  modalViewPrivate: Object.freeze(['modalView', 'markPrivate'] as const),
} as const;

export const TABLE_ACTIONS = {
  actionSteps: Object.freeze(['addActionStep'] as const),
  notes: Object.freeze(['addNote'] as const),
} as const;

export const TABLE_COLUMNS = {
  actionSteps: Object.freeze(['item', 'assignee', 'item_status', 'assigned_date', 'due_date', 'completed_date'] as const),
  notesBasic: Object.freeze(['created_date', 'created_by', 'private'] as const),
  notesWithBody: Object.freeze(['created_date', 'created_by', 'note', 'private'] as const),
  gmail: Object.freeze(['sent_at', 'from', 'to_emails', 'cc_emails', 'subject'] as const),
  calendarEvents: Object.freeze(['summary', 'start_date', 'attendees'] as const),
} as const;
