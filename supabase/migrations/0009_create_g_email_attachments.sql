-- Store Gmail attachment metadata and content (base64) per message
create table if not exists public.g_email_attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  gmail_message_id text not null,
  attachment_id text not null,
  filename text,
  mime_type text,
  size_bytes int,
  content_base64 text,
  created_at timestamptz not null default now(),
  unique (user_id, gmail_message_id, attachment_id)
);
create index if not exists g_email_attachments_msg_idx on public.g_email_attachments(user_id, gmail_message_id);

