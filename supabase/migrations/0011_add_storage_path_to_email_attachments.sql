-- Add storage_path for uploaded Gmail attachments (Supabase Storage key)
alter table if exists public.g_email_attachments
  add column if not exists storage_path text;

