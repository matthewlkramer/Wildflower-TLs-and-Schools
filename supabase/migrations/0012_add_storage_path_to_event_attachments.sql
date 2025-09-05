-- Add storage_path for uploaded Calendar attachments (Supabase Storage key)
alter table if exists public.g_event_attachments
  add column if not exists storage_path text;

