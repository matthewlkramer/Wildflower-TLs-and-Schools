// Reusable list layout options for list blocks across modules
// These are UI-only view presets (not data presets) and can be spread/overridden per module if needed.

export const GMAIL_LIST_OPTIONS = {
  title: 'Gmails',
  width: 'half' as const,
  orderBy: [{ column: 'sent_at', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'subject',
    subtitleFields: ['from'] as const,
    badgeFields: ['is_private'] as const,
    bodyFields: ['to_emails', 'cc_emails', 'body_text'] as const,
    footerFields: ['sent_at'] as const,
    showFieldLabels: true,
  },
} as const;

export const GCAL_LIST_OPTIONS = {
  title: 'gCal',
  width: 'half' as const,
  orderBy: [{ column: 'start_time', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'summary',
    badgeFields: ['is_private'] as const,
    bodyFields: ['start_time', 'end_time', 'location', 'organizer_email', 'attendees'] as const,
    showFieldLabels: true,
  },
} as const;

export const NOTES_LIST_OPTIONS = {
  title: 'Notes',
  width: 'half' as const,
  orderBy: [{ column: 'created_date', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'title',
    badgeFields: ['is_private'] as const,
    bodyFields: ['full_text'] as const,
    bodyFieldFullWidth: true,
    footerFields: ['created_date'] as const,
    showFieldLabels: true,
  },
} as const;

export const ACTION_STEPS_LIST_OPTIONS = {
  title: 'Action Steps',
  width: 'half' as const,
  orderBy: [{ column: 'created_date', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'item',
    subtitleFields: ['assignee'] as const,
    badgeFields: ['item_status'] as const,
    bodyFields: ['assigned_date', 'due_date', 'completed_date'] as const,
    footerFields: ['created_date'] as const,
    showFieldLabels: true,
  },
} as const;

export const EDUCATOR_LIST_OPTIONS = {
  title: 'Educators',
  width: 'half' as const,
  orderBy: [{ column: 'start_date', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'full_name',
    subtitleFields: ['role'] as const,
    badgeFields: ['is_active'] as const,
    bodyFields: ['start_date', 'end_date'] as const,
    showFieldLabels: true,
  },
} as const;

export const BOARD_MEMBER_LIST_OPTIONS = {
  title: 'Board Members',
  width: 'half' as const,
  orderBy: [{ column: 'start_date', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'full_name',
    subtitleFields: ['role'] as const,
    badgeFields: ['is_active'] as const,
    bodyFields: ['start_date', 'end_date'] as const,
    showFieldLabels: true,
  },
} as const;

export const ENROLLMENT_LIST_OPTIONS = {
  title: 'Enrollment',
  width: 'half' as const,
  orderBy: [{ column: 'school_year', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'school_year',
    bodyFields: ['enrolled_students_total', 'enrolled_frl', 'enrolled_bipoc', 'enrolled_ell', 'enrolled_sped'] as const,
    showFieldLabels: true,
  },
} as const;

export const ASSESSMENTS_LIST_OPTIONS = {
  title: 'Assessments',
  width: 'half' as const,
  orderBy: [{ column: 'school_year', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'assessment_or_metric',
    subtitleFields: ['school_year'] as const,
    bodyFields: ['metric_data', 'assessed_total', 'met_plus_total'] as const,
    showFieldLabels: true,
  },
} as const;

export const CERTIFICATION_LIST_OPTIONS = {
  title: 'Montessori Certifications',
  width: 'half' as const,
  orderBy: [{ column: 'year', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'cert_level',
    subtitleFields: ['year'] as const,
    badgeFields: ['cert_completion_status','macte_accredited'] as const,
    bodyFields: ['association' ] as const,
    showFieldLabels: true,
  },
} as const;


export const EVENTS_LIST_OPTIONS = {
  title: 'Events',
  width: 'half' as const,
  orderBy: [{ column: 'school_year', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'event_name',
    bodyFields: ['registration_date','attended_event'] as const,
    showFieldLabels: true,
  },
} as const;

export const GRANTS_LIST_OPTIONS = {
  title: 'Grants',
  width: 'half' as const,
  orderBy: [{ column: 'issue_date', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'issue_date',
    subtitleFields: ['amount'] as const,
    bodyFields: ['grant_status', 'ready_to_accept_flag','ready_to_issue_letter_flag'] as const,
    showFieldLabels: true,
  },
} as const;
export const LOANS_LIST_OPTIONS = {
  title: 'Loans',
  width: 'half' as const,
  orderBy: [{ column: 'issue_date', ascending: false }] as const,
  limit: 50,
  layout: {
    titleField: 'issue_date',
    subtitleFields: ['amount_issued'] as const,
    bodyFields: ['maturity', 'interest_rate','loan_status', 'vehicle', 'use_of_proceeds'] as const,
    attachmentFields: ['loan_docs'] as const,
    showFieldLabels: true,
  },
} as const;

// Aggregate export: import one object to access all list presets.
export const LIST_PRESETS = {
  GMAIL_LIST_OPTIONS,
  GCAL_LIST_OPTIONS,
  NOTES_LIST_OPTIONS,
  ACTION_STEPS_LIST_OPTIONS,
  EDUCATOR_LIST_OPTIONS,
  BOARD_MEMBER_LIST_OPTIONS,
  ENROLLMENT_LIST_OPTIONS,
  ASSESSMENTS_LIST_OPTIONS,
  CERTIFICATION_LIST_OPTIONS,
  EVENTS_LIST_OPTIONS,
  GRANTS_LIST_OPTIONS,
  LOANS_LIST_OPTIONS,
} as const;