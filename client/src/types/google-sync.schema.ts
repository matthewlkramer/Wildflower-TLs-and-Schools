// Google Sync (z_*) table schemas and Zod validations
import { z } from 'zod';

/**
 * Supabase schema (client-side) for Google Sync and related tables.
 * Derived from supabase/schema.sql (z_* tables).
 *
 * For each table we export:
 * - <Name>Row: exact row shape returned by Supabase
 * - <Name>Insert: fields accepted on insert
 * - <Name>Update: fields accepted on update
 * - <name>InsertSchema / <name>UpdateSchema: Zod schemas for forms/modals
 *
 * Notes:
 * - Timestamps are represented as ISO strings on the client.
 * - UUIDs are strings.
 * - Arrays are string[] where applicable.
 * - Check constraints are encoded as Zod enums.
 */

// ----------------------------------------------
// z_email_filter_addresses
// ----------------------------------------------

export interface ZEmailFilterAddressesRow {
  email: string;
  last_synced_at: string | null; // timestamptz
  educator_id: string | null;    // text
}

export type ZEmailFilterAddressesInsert = {
  email: string;
  last_synced_at?: string | null;
  educator_id?: string | null;
};

export type ZEmailFilterAddressesUpdate = {
  email?: string; // Upserts may require email; regular updates can omit
  last_synced_at?: string | null;
  educator_id?: string | null;
};

export const zEmailFilterAddressesInsertSchema = z.object({
  email: z.string().email('Valid email required'),
  last_synced_at: z.string().datetime().nullish(),
  educator_id: z.string().nullish(),
});

export const zEmailFilterAddressesUpdateSchema = z.object({
  email: z.string().email('Valid email required').optional(),
  last_synced_at: z.string().datetime().nullish().optional(),
  educator_id: z.string().nullish().optional(),
});

// ----------------------------------------------
// z_g_email_attachments
// ----------------------------------------------

export interface ZGEmailAttachmentsRow {
  id: string;                 // uuid
  user_id: string;            // uuid
  gmail_message_id: string;   // text
  attachment_id: string;      // text
  filename: string | null;    // text
  mime_type: string | null;   // text
  size_bytes: number | null;  // integer
  content_base64: string | null; // text
  created_at: string;         // timestamptz
  storage_path: string | null;// text
}

export type ZGEmailAttachmentsInsert = {
  id?: string;
  user_id: string;
  gmail_message_id: string;
  attachment_id: string;
  filename?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  content_base64?: string | null;
  created_at?: string;
  storage_path?: string | null;
};

export type ZGEmailAttachmentsUpdate = Partial<ZGEmailAttachmentsInsert>;

export const zGEmailAttachmentsInsertSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  gmail_message_id: z.string().min(1),
  attachment_id: z.string().min(1),
  filename: z.string().nullish(),
  mime_type: z.string().nullish(),
  size_bytes: z.number().int().nullish(),
  content_base64: z.string().nullish(),
  created_at: z.string().datetime().optional(),
  storage_path: z.string().nullish(),
});

export const zGEmailAttachmentsUpdateSchema = zGEmailAttachmentsInsertSchema.partial();

// ----------------------------------------------
// z_g_email_backfill_queue
// ----------------------------------------------

export type GEmailBackfillStatus = 'queued' | 'done' | 'error';

export interface ZGEmailBackfillQueueRow {
  user_id: string;              // uuid
  gmail_message_id: string;     // text
  enqueued_at: string;          // timestamptz
  status: GEmailBackfillStatus; // text with check
  attempts: number;             // integer
  last_attempt_at: string | null; // timestamptz
  error_message: string | null; // text
}

export type ZGEmailBackfillQueueInsert = {
  user_id: string;
  gmail_message_id: string;
  enqueued_at?: string;
  status?: GEmailBackfillStatus;
  attempts?: number;
  last_attempt_at?: string | null;
  error_message?: string | null;
};

export type ZGEmailBackfillQueueUpdate = Partial<ZGEmailBackfillQueueInsert>;

export const zGEmailBackfillQueueInsertSchema = z.object({
  user_id: z.string().uuid(),
  gmail_message_id: z.string().min(1),
  enqueued_at: z.string().datetime().optional(),
  status: z.enum(['queued', 'done', 'error']).optional(),
  attempts: z.number().int().optional(),
  last_attempt_at: z.string().datetime().nullish(),
  error_message: z.string().nullish(),
});

export const zGEmailBackfillQueueUpdateSchema = zGEmailBackfillQueueInsertSchema.partial();

// ----------------------------------------------
// z_g_email_sync_progress
// ----------------------------------------------

export type GSyncStatus = 'not_started' | 'running' | 'paused' | 'completed' | 'partial' | 'error';

export interface ZGEmailSyncProgressRow {
  user_id: string;             // uuid
  year: number;                // int
  week: number;                // int
  sync_status: GSyncStatus;    // text with check
  error_message: string | null;// text
  total_messages: number | null;    // int
  processed_messages: number | null; // int
  started_at: string | null;   // timestamptz
  completed_at: string | null; // timestamptz
  updated_at: string | null;   // timestamptz
  current_run_id: string | null; // text
}

export type ZGEmailSyncProgressInsert = {
  user_id: string;
  year: number;
  week: number;
  sync_status?: GSyncStatus;
  error_message?: string | null;
  total_messages?: number | null;
  processed_messages?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
  current_run_id?: string | null;
};

export type ZGEmailSyncProgressUpdate = Partial<ZGEmailSyncProgressInsert>;

export const zGEmailSyncProgressInsertSchema = z.object({
  user_id: z.string().uuid(),
  year: z.number().int(),
  week: z.number().int(),
  sync_status: z.enum(['not_started', 'running', 'paused', 'completed', 'partial', 'error']).optional(),
  error_message: z.string().nullish(),
  total_messages: z.number().int().nullish(),
  processed_messages: z.number().int().nullish(),
  started_at: z.string().datetime().nullish(),
  completed_at: z.string().datetime().nullish(),
  updated_at: z.string().datetime().nullish(),
  current_run_id: z.string().nullish(),
});

export const zGEmailSyncProgressUpdateSchema = zGEmailSyncProgressInsertSchema.partial();

// ----------------------------------------------
// z_g_emails
// ----------------------------------------------

export interface ZGEmailsRow {
  id: string;                 // uuid
  user_id: string;            // uuid
  gmail_message_id: string;   // text
  thread_id: string | null;   // text
  from_email: string | null;  // text
  to_emails: string[] | null; // text[]
  cc_emails: string[] | null; // text[]
  bcc_emails: string[] | null;// text[]
  subject: string | null;     // text
  body_text: string | null;   // text
  body_html: string | null;   // text
  sent_at: string | null;     // timestamptz
  created_at: string;         // timestamptz
  updated_at: string;         // timestamptz
  matched_emails: string[] | null;      // text[]
  matched_educator_ids: string[] | null;// text[]
}

export type ZGEmailsInsert = {
  id?: string;
  user_id: string;
  gmail_message_id: string;
  thread_id?: string | null;
  from_email?: string | null;
  to_emails?: string[] | null;
  cc_emails?: string[] | null;
  bcc_emails?: string[] | null;
  subject?: string | null;
  body_text?: string | null;
  body_html?: string | null;
  sent_at?: string | null;
  created_at?: string;
  updated_at?: string;
  matched_emails?: string[] | null;
  matched_educator_ids?: string[] | null;
};

export type ZGEmailsUpdate = Partial<ZGEmailsInsert>;

export const zGEmailsInsertSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  gmail_message_id: z.string().min(1),
  thread_id: z.string().nullish(),
  from_email: z.string().email().nullish(),
  to_emails: z.array(z.string().email()).nullish(),
  cc_emails: z.array(z.string().email()).nullish(),
  bcc_emails: z.array(z.string().email()).nullish(),
  subject: z.string().nullish(),
  body_text: z.string().nullish(),
  body_html: z.string().nullish(),
  sent_at: z.string().datetime().nullish(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  matched_emails: z.array(z.string().email()).nullish(),
  matched_educator_ids: z.array(z.string()).nullish(),
});

export const zGEmailsUpdateSchema = zGEmailsInsertSchema.partial();

// ----------------------------------------------
// z_g_event_attachments
// ----------------------------------------------

export interface ZGEventAttachmentsRow {
  id: string;                  // uuid
  user_id: string;             // uuid
  google_calendar_id: string;  // text
  google_event_id: string;     // text
  title: string | null;        // text
  mime_type: string | null;    // text
  file_url: string | null;     // text
  file_id: string | null;      // text
  icon_link: string | null;    // text
  identity_key: string | null; // generated always (COALESCE(file_id, file_url))
  created_at: string;          // timestamptz
  storage_path: string | null; // text
}

export type ZGEventAttachmentsInsert = {
  id?: string;
  user_id: string;
  google_calendar_id: string;
  google_event_id: string;
  title?: string | null;
  mime_type?: string | null;
  file_url?: string | null;
  file_id?: string | null;
  icon_link?: string | null;
  // identity_key is generated by DB
  created_at?: string;
  storage_path?: string | null;
};

export type ZGEventAttachmentsUpdate = Partial<ZGEventAttachmentsInsert>;

export const zGEventAttachmentsInsertSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  google_calendar_id: z.string().min(1),
  google_event_id: z.string().min(1),
  title: z.string().nullish(),
  mime_type: z.string().nullish(),
  file_url: z.string().url().nullish(),
  file_id: z.string().nullish(),
  icon_link: z.string().url().nullish(),
  created_at: z.string().datetime().optional(),
  storage_path: z.string().nullish(),
});

export const zGEventAttachmentsUpdateSchema = zGEventAttachmentsInsertSchema.partial();

// ----------------------------------------------
// z_g_event_sync_progress
// ----------------------------------------------

export interface ZGEventSyncProgressRow {
  user_id: string;                // uuid
  calendar_id: string;            // text
  year: number;                   // int
  month: number;                  // int
  sync_status: GSyncStatus;       // text with check
  error_message: string | null;   // text
  total_events: number | null;    // int
  processed_events: number | null;// int
  last_sync_token: string | null; // text
  started_at: string | null;      // timestamptz
  completed_at: string | null;    // timestamptz
  updated_at: string | null;      // timestamptz
  current_run_id: string | null;  // text
}

export type ZGEventSyncProgressInsert = {
  user_id: string;
  calendar_id: string;
  year: number;
  month: number;
  sync_status?: GSyncStatus;
  error_message?: string | null;
  total_events?: number | null;
  processed_events?: number | null;
  last_sync_token?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
  current_run_id?: string | null;
};

export type ZGEventSyncProgressUpdate = Partial<ZGEventSyncProgressInsert>;

export const zGEventSyncProgressInsertSchema = z.object({
  user_id: z.string().uuid(),
  calendar_id: z.string().min(1),
  year: z.number().int(),
  month: z.number().int(),
  sync_status: z.enum(['not_started', 'running', 'paused', 'completed', 'partial', 'error']).optional(),
  error_message: z.string().nullish(),
  total_events: z.number().int().nullish(),
  processed_events: z.number().int().nullish(),
  last_sync_token: z.string().nullish(),
  started_at: z.string().datetime().nullish(),
  completed_at: z.string().datetime().nullish(),
  updated_at: z.string().datetime().nullish(),
  current_run_id: z.string().nullish(),
});

export const zGEventSyncProgressUpdateSchema = zGEventSyncProgressInsertSchema.partial();

// ----------------------------------------------
// z_g_events
// ----------------------------------------------

export interface ZGEventsRow {
  id: string;                    // uuid
  user_id: string;               // uuid
  google_calendar_id: string;    // text
  google_event_id: string;       // text
  summary: string | null;        // text
  description: string | null;    // text
  start_time: string | null;     // timestamptz
  end_time: string | null;       // timestamptz
  organizer_email: string | null;// text
  location: string | null;       // text
  status: string | null;         // text
  created_at: string;            // timestamptz
  updated_at: string;            // timestamptz
  matched_emails: string[] | null;      // text[]
  matched_educator_ids: string[] | null;// text[]
  attendees: string[] | null;           // text[]
}

export type ZGEventsInsert = {
  id?: string;
  user_id: string;
  google_calendar_id: string;
  google_event_id: string;
  summary?: string | null;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  organizer_email?: string | null;
  location?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
  matched_emails?: string[] | null;
  matched_educator_ids?: string[] | null;
  attendees?: string[] | null;
};

export type ZGEventsUpdate = Partial<ZGEventsInsert>;

export const zGEventsInsertSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  google_calendar_id: z.string().min(1),
  google_event_id: z.string().min(1),
  summary: z.string().nullish(),
  description: z.string().nullish(),
  start_time: z.string().datetime().nullish(),
  end_time: z.string().datetime().nullish(),
  organizer_email: z.string().email().nullish(),
  location: z.string().nullish(),
  status: z.string().nullish(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  matched_emails: z.array(z.string().email()).nullish(),
  matched_educator_ids: z.array(z.string()).nullish(),
  attendees: z.array(z.string().email()).nullish(),
});

export const zGEventsUpdateSchema = zGEventsInsertSchema.partial();

// ----------------------------------------------
// z_google_auth_tokens
// ----------------------------------------------

export interface ZGoogleAuthTokensRow {
  user_id: string;       // uuid
  access_token: string;  // text
  refresh_token: string; // text
  expires_at: string;    // timestamptz
  updated_at: string;    // timestamptz
}

export type ZGoogleAuthTokensInsert = {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  updated_at?: string;
};

export type ZGoogleAuthTokensUpdate = Partial<ZGoogleAuthTokensInsert>;

export const zGoogleAuthTokensInsertSchema = z.object({
  user_id: z.string().uuid(),
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export const zGoogleAuthTokensUpdateSchema = zGoogleAuthTokensInsertSchema.partial();

// ----------------------------------------------
// z_google_sync_messages
// ----------------------------------------------

export type GoogleSyncType = 'gmail' | 'calendar';

export interface ZGoogleSyncMessagesRow {
  id: string;                 // uuid
  user_id: string;            // uuid
  run_id: string | null;      // text
  sync_type: GoogleSyncType;  // text
  level: string | null;       // text (default 'info')
  message: string;            // text
  created_at: string;         // timestamptz
}

export type ZGoogleSyncMessagesInsert = {
  id?: string;
  user_id: string;
  run_id?: string | null;
  sync_type: GoogleSyncType;
  level?: string | null;
  message: string;
  created_at?: string;
};

export type ZGoogleSyncMessagesUpdate = Partial<ZGoogleSyncMessagesInsert>;

export const zGoogleSyncMessagesInsertSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  run_id: z.string().nullish(),
  sync_type: z.enum(['gmail', 'calendar']),
  level: z.string().nullish(),
  message: z.string().min(1),
  created_at: z.string().datetime().optional(),
});

export const zGoogleSyncMessagesUpdateSchema = zGoogleSyncMessagesInsertSchema.partial();

// ----------------------------------------------
// z_google_sync_settings
// ----------------------------------------------

export interface ZGoogleSyncSettingsRow {
  user_id: string;          // uuid
  sync_start_date: string;  // timestamptz (NOT NULL)
  updated_at: string;       // timestamptz
}

export type ZGoogleSyncSettingsInsert = {
  user_id: string;
  sync_start_date: string;
  updated_at?: string;
};

export type ZGoogleSyncSettingsUpdate = Partial<ZGoogleSyncSettingsInsert>;

export const zGoogleSyncSettingsInsertSchema = z.object({
  user_id: z.string().uuid(),
  sync_start_date: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export const zGoogleSyncSettingsUpdateSchema = zGoogleSyncSettingsInsertSchema.partial();

// ----------------------------------------------
// z_sync_catchup_requests
// ----------------------------------------------

export type SyncCatchupStatus = 'queued' | 'processing' | 'done' | 'error';

export interface ZSyncCatchupRequestsRow {
  user_id: string;             // uuid
  status: SyncCatchupStatus;   // text with check
  requested_at: string;        // timestamptz
  processed_at: string | null; // timestamptz
  last_error: string | null;   // text
}

export type ZSyncCatchupRequestsInsert = {
  user_id: string;
  status?: SyncCatchupStatus;
  requested_at?: string;
  processed_at?: string | null;
  last_error?: string | null;
};

export type ZSyncCatchupRequestsUpdate = Partial<ZSyncCatchupRequestsInsert>;

export const zSyncCatchupRequestsInsertSchema = z.object({
  user_id: z.string().uuid(),
  status: z.enum(['queued', 'processing', 'done', 'error']).optional(),
  requested_at: z.string().datetime().optional(),
  processed_at: z.string().datetime().nullish(),
  last_error: z.string().nullish(),
});

export const zSyncCatchupRequestsUpdateSchema = zSyncCatchupRequestsInsertSchema.partial();

// ----------------------------------------------
// Convenience union types and table map (optional)
// ----------------------------------------------

export type SupabaseZTableRow =
  | ZEmailFilterAddressesRow
  | ZGEmailAttachmentsRow
  | ZGEmailBackfillQueueRow
  | ZGEmailSyncProgressRow
  | ZGEmailsRow
  | ZGEventAttachmentsRow
  | ZGEventSyncProgressRow
  | ZGEventsRow
  | ZGoogleAuthTokensRow
  | ZGoogleSyncMessagesRow
  | ZGoogleSyncSettingsRow
  | ZSyncCatchupRequestsRow;

export const Z_TABLES = {
  z_email_filter_addresses: 'z_email_filter_addresses',
  z_g_email_attachments: 'z_g_email_attachments',
  z_g_email_backfill_queue: 'z_g_email_backfill_queue',
  z_g_email_sync_progress: 'z_g_email_sync_progress',
  z_g_emails: 'z_g_emails',
  z_g_event_attachments: 'z_g_event_attachments',
  z_g_event_sync_progress: 'z_g_event_sync_progress',
  z_g_events: 'z_g_events',
  z_google_auth_tokens: 'z_google_auth_tokens',
  z_google_sync_messages: 'z_google_sync_messages',
  z_google_sync_settings: 'z_google_sync_settings',
  z_sync_catchup_requests: 'z_sync_catchup_requests',
} as const;
