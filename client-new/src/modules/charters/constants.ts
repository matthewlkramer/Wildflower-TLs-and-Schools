// Config model: field name, display name, visibility, order, and value type/options.
export type ColumnVisibility = 'show' | 'hide' | 'suppress';
export type GridValueKind = 'string' | 'boolean' | 'multi' | 'select' | 'date' | 'number';
export type CharterColumnConfig = {
  field: string;
  headerName: string;
  visibility: ColumnVisibility;
  order?: number;
  valueType?: GridValueKind;
  selectOptions?: string[]; // for select/multi
  lookupField?: string;     // table.column for select/multi
  enumName?: string;        // Postgres enum type name for select
  sortKey?: boolean; // whether this field should be the default sort key
  kanbanKey?: boolean; // whether this field should be the kanban grouping key
};

export const CHARTER_GRID: CharterColumnConfig[] = [
  { field: 'charter_name', headerName: 'Name', visibility: 'show', order: 1, valueType: 'string', sortKey: true },
  { field: 'status', headerName: 'Status', visibility: 'show', order: 2, valueType: 'select',enumName: 'charter_status', kanbanKey: true },
  { field: 'proj_open', headerName: 'Projected open', visibility: 'show', order: 3, valueType: 'date' },
  { field: 'non_tl_roles', headerName: 'Non-TL leadership', visibility: 'show', order: 4, valueType: 'string' },
  { field: 'initial_target_planes', headerName: 'Target planes', visibility: 'show', order: 5, valueType: 'multi', enumName: 'developmental_planes' },
  { field: 'initial_target_geo', headerName: 'Target geography', visibility: 'show', order: 6, valueType: 'string' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' }
];

export const CHARTER_KANBAN_CONSTANTS_TABLE = 'ref_charter_statuses';

// Details section types
export type DetailCardSpec = {
  kind: 'card';
  title: string;
  fields: string[]; // names from details_educators or editable base relation
  editable: boolean;
  editSource?: { schema?: string; table: string; pk?: string; exceptions?: Array<{ field: string; mapsToField?: string; viaLookup?: { schema?: string; table: string; labelColumn: string; keyColumn: string } }> };
};

export type DetailTableSpec = {
  kind: 'table';
  title: string;
  source: { schema?: string; table: string; fkColumn: string }; // fkColumn referencing school id
  columns: string[];
  rowActions?: string[];
  tableActions?: string[];
};

export type DetailMapSpec = {
  kind: 'map';
  title: string;
  fields: string[];
};

export type DetailTabSpec = {
  id: string;
  label: string;
  // Default write target for editable cards on this tab
  writeTo?: { schema?: string; table: string; pk?: string };
  blocks: (DetailCardSpec | DetailTableSpec | DetailMapSpec)[];
};

export const CHARTER_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
    writeTo: { schema: 'public', table: 'charters', pk: 'id' },
    blocks: [
      { kind: 'map', title: 'Location', fields: ['physical_lat','physical_long','physical_address'] },
      { kind: 'card', title: 'Name(s)', fields: ['short_name', 'full_name'], editable: true },
      { kind: 'card', title: 'Status', fields: ['status','membership_status','currently_authorized','authorizer'], editable: false },
      { kind: 'card', title: 'People', fields: ['non_tl_roles'], editable: true },
      { kind: 'card', title: 'Support', fields: ['current_cohort','support_timeline'], editable: false },
      { kind: 'card', title: 'Grants and Loans', fields: ['total_grants_issued', 'total_loans_issued'], editable: false },
      { kind: 'card', title: 'Initial Vision', fields: ['initial_target_geo','initial_target_planes','target_open'], editable: true },
    ],
  },
  {
    id: 'details',
    label: 'Details',
    writeTo: { schema: 'public', table: 'charters', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Legal entity', fields: ['ein','incorp_date','current_fy_end'], editable: true },
      { kind: 'card', title: 'Nonprofit status', fields: ['nonprofit_status','group_exemption_status'], editable: true },
      { kind: 'table', title: 'Authorizer actions', source: { table: 'charter_authorizer_actions', schema: 'public', fkColumn: 'charter_id' }, columns: ['action','action_date','authorized_after_action'], rowActions: ['modal_view'], tableActions: ['addAction'] },
    ],
  },
  {
    id: 'app_details',
    label: 'Application Details',
    writeTo: { schema: 'public', table: 'charter_applications', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Lexxxxy', fields: ['app_window','key_dates','milestones',], editable: true },
      { kind: 'card', title: 'Ages', fields: ['beg_age','end_age'], editable: true },
      { kind: 'card', title: 'LOI', fields: ['loi_required','loi_deadline','loi_submitted','loi'], editable: true },
      { kind: 'card', title: 'dates', fields: ['app_deadline'], editable: true },
      { kind: 'card', title: 'Projections', fields: ['odds_authorization','odds_on_time_open','proj_open_date'], editable: true },
      { kind: 'card', title: 'Docs', fields: ['design_album','application'], editable: true },
      { kind: 'card', title: 'Budgets', fields: ['num_students','budget_exercises','budget_final'], editable: true },
      { kind: 'card', title: 'People', fields: ['team','opps_challenges'], editable: true },
      { kind: 'card', title: 'Dates', fields: ['app_submitted','joint_kickoff_meeting_date','jv_contract_signed_date','decision_expected_date'], editable: true },
      { kind: 'card', title: 'Capacity Interviews', fields: ['capacity_intv_training_complete','capacity_intv_proj_date','capacity_intv_completed_date'], editable: true },
      { kind: 'card', title: 'Auth Decision', fields: ['auth_decision'], editable: true },
    ],
  },
  {
    id: 'operations',
    label: 'Ops + Governance',
    writeTo: { schema: 'public', table: 'charters', pk: 'id' },
    blocks: [
      { kind: 'card', title: 'Participation + Partnership with Wildflower', fields: ['partnership_with_wf','first_site_opened_date','non_discrimination_policy_on_website','school_provided_1023','guidestar_listing_requested'], editable: true },
  },
  {
    id: 'schools',
    label: 'Schools',
    blocks: [
      { kind: 'table', title: '', source: { table: 'details_associations', schema: 'public', fkColumn: 'charter_id' }, columns: ['school_name','role', 'start_date', 'end_date', 'currently_active', 'ages_served','stage_status'], rowActions: ['inline_edit', 'modal_view'], tableActions: ['addSchool','addNewSchool'] },
    ],
  },
  {
    id: 'people',
    label: 'People',
    blocks: [
      { kind: 'table', title: '', source: { table: 'details_associations', schema: 'public', fkColumn: 'charter_id' }, columns: ['full_name,'role','start_date','end_date','currently_active','race_ethnicity_display','has_montessori_cert'], rowActions: ['inline_edit'], tableActions: ['addRole','addPersonAndRole'] },
    ],
  },
  {
    id: 'grants_and_loans',
    label: 'Grants and Loans',
    blocks: [
      { kind: 'table', title: 'Loans', source: { table: 'loans', schema: 'public', fkColumn: 'charter_id' }, columns: ['issue_date','amount_issued','loan_status'], rowActions: ['modal_view']},
      { kind: 'table', title: 'Grants', source: { table: 'grants', schema: 'public', fkColumn: 'charter_id' }, columns: ['issue_date','amount','grant_status'], rowActions: ['inline_edit','modal_view','archive'], tableActions: ['addGrant'] },

    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    blocks: [
      { kind: 'table', title: '', source: { table: 'locations', schema: 'public', fkColumn: 'charter_id' }, columns: ['address','start_date','end_date','current_mail_address','current_physical_address','lease_end_date'], rowActions: ['modal_view', 'inline_edit','end_occupancy', 'archive'], tableActions: ['addLocation'] },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    blocks: [
      { kind: 'table', title: 'Guide Assignments', source: { table: 'guide_assignments', schema: 'public', fkColumn: 'charter_id' }, columns: ['email_or_name','type','start_date','end_date','active'], rowActions: ['inline_edit'], tableActions: ['addGuideLink','addNewGuide'] }
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    blocks: [
      { kind: 'table', title: 'Documents', source: { table: 'governance_docs', schema: 'public', fkColumn: 'charter_id' }, columns: ['document','uploaded_at','notes'], rowActions: ['inline_edit','modal_view'], tableActions: ['addDocument'] },
      { kind: 'table', title: '990s', source: { table: 'nine_nineties', schema: 'public', fkColumn: 'charter_id' }, columns: ['form_year','pdf'], rowActions: ['archive'], tableActions: ['addSchoolDoc'] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', title: 'Notes', source: { table: 'notes', schema: 'public', fkColumn: 'charter_id' }, columns: ['note','created_by','created_date','private'], rowActions: ['inline_edit', 'modal_view', 'markPrivate', 'archive'], tableActions: ['addNote'] },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', title: 'Action Steps', source: { table: 'action_steps', schema: 'public', fkColumn: 'charter_id' }, columns: ['item','assignee','item_status','assigned_date','due_date','completed_date'], rowActions: ['inline_edit', 'modal_view', 'mark_complete', 'archive'], tableActions: ['addActionStep'] },
    ],
  },
  {
    id: 'google_sync',
    label: 'Google Sync',
    blocks: [
      { kind: 'table', title: 'Gmails', source: { table: 'g_emails', schema: 'gsync', fkColumn: 'people_id' }, columns: ['sent_at', 'from', 'to_emails', 'cc_emails', 'subject'], rowActions: ['modalView', 'markPrivate'] },
      { kind: 'table', title: 'Calendar Events', source: { table: 'g_events', schema: 'gsync', fkColumn: 'people_id' }, columns: ['summary', 'start_date', 'attendees'], rowActions: ['modalView', 'markPrivate'] },
    ],
  },
];
