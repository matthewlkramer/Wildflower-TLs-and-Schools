-- Complete the UI views for emails and events
-- These provide optimized, view-driven data access

-- UI view for school emails
CREATE VIEW ui_school_emails WITH (security_invoker = true) AS
SELECT 
  e.id,
  e.email_id,
  e.school_id,
  e.people_id,
  e.date,
  e.subject,
  e.from_email,
  e.to_emails,
  e.cc_emails,
  e.body_text,
  e.attachments_count,
  e.created_at
FROM z_g_emails e
WHERE e.school_id IS NOT NULL
ORDER BY e.date DESC;

-- UI view for school events  
CREATE VIEW ui_school_events WITH (security_invoker = true) AS
SELECT
  ev.id,
  ev.event_id, 
  ev.school_id,
  ev.people_id,
  ev.summary,
  ev.description,
  ev.start_time,
  ev.end_time,
  ev.attendees_count,
  ev.location,
  ev.created_at
FROM z_g_events ev
WHERE ev.school_id IS NOT NULL
ORDER BY ev.start_time DESC;

-- UI view for educator emails
CREATE VIEW ui_educator_emails WITH (security_invoker = true) AS
SELECT 
  e.id,
  e.email_id,
  e.school_id,
  e.people_id,
  e.date,
  e.subject,
  e.from_email,
  e.to_emails,
  e.cc_emails,
  e.body_text,
  e.attachments_count,
  e.created_at
FROM z_g_emails e  
WHERE e.people_id IS NOT NULL
ORDER BY e.date DESC;

-- UI view for educator events
CREATE VIEW ui_educator_events WITH (security_invoker = true) AS
SELECT
  ev.id,
  ev.event_id,
  ev.school_id, 
  ev.people_id,
  ev.summary,
  ev.description,
  ev.start_time,
  ev.end_time,
  ev.attendees_count,
  ev.location,
  ev.created_at
FROM z_g_events ev
WHERE ev.people_id IS NOT NULL
ORDER BY ev.start_time DESC;

-- Grant SELECT permissions on the new views
GRANT SELECT ON ui_school_emails TO authenticated;
GRANT SELECT ON ui_school_events TO authenticated;
GRANT SELECT ON ui_educator_emails TO authenticated;
GRANT SELECT ON ui_educator_events TO authenticated;