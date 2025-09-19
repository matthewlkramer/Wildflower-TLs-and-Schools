// Config model: field name, display name, visibility, order, and value type/options.
import type { ColumnVisibility, GridValueKind, GridColumnConfig, DetailCardBlock, DetailTableBlock, DetailMapBlock, DetailTabSpec as SharedDetailTabSpec, FieldMetadataMap } from '../shared/detail-types';
import { ROW_ACTIONS, TABLE_ACTIONS, TABLE_COLUMNS, TABLE_COLUMN_META } from '../shared/detail-presets';
import { TABLE_PRESETS } from '../shared/table-presets';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type SchoolColumnConfig = GridColumnConfig;
export type DetailCardSpec = DetailCardBlock;
export type DetailTableSpec = DetailTableBlock;
export type DetailMapSpec = DetailMapBlock;
export type DetailTabSpec = SharedDetailTabSpec;

export const SCHOOL_GRID: SchoolColumnConfig[] = [
  { field: 'school_name', headerName: 'Name', visibility: 'show', valueType: 'string' , sortKey: true},
  { field: 'stage_status', headerName: 'Stage/Status', visibility: 'show', valueType: 'select', lookupField: 'ref_stage_statuses' , kanbanKey: true },
  { field: 'current_tls', headerName: 'Status', visibility: 'show', valueType: 'string' },
  { field: 'governance_model', headerName: 'City', visibility: 'show', valueType: 'select', enumName: 'governance_models' },
  { field: 'ages_served', headerName: 'Ages served', visibility: 'show', valueType: 'multi', enumName: 'age_spans' },
  { field: 'membership_status', headerName: 'Membership status', visibility: 'show', valueType: 'select', lookupField: 'ref_membership_statuses' },
  { field: 'projected_open', headerName: 'Projected open', visibility: 'show', valueType: 'date' },
  { field: 'id', headerName: 'ID', visibility: 'suppress' }
];

export const SCHOOL_KANBAN_CONSTANTS_TABLE = 'ref_stage_statuses';

export const SCHOOL_DETAIL_TABS: DetailTabSpec[] = [
  {
    id: 'overview',
    label: 'Overview',
    blocks: [
      { kind: 'map', title: 'Location', fields: ['physical_lat','physical_long','physical_address'] },
      { kind: 'card', title: 'Name(s)', fields: ['short_name', 'long_name', 'prior_names','founding_tls'], editable: true },
      { kind: 'card', title: 'Status', fields: ['stage_status', 'open_date','membership_status'], editable: false },
      { kind: 'card', title: 'About', fields: ['about','about_spanish'], editable: true },
      { kind: 'card', title: 'Support', fields: ['current_tls','current_guide_name','current_cohort'], editable: false },
      { kind: 'card', title: 'School Model', fields: ['governance_model','public_funding','program_focus','institutional_partner','ages_served', 'number_of_classrooms','enrollment_at_full_capacity'], editable: true },
      { kind: 'card', title: 'Contact Info', fields: ['school_email', 'school_phone', 'domain_name', 'website', 'facebook', 'instagram'], editable: true },
      { kind: 'card', title: 'Grants and Loans', fields: ['total_grants_issued', 'total_loans_issued'], editable: false },
      { kind: 'card', title: 'Warnings', fields: ['risk_factors','watchlist'], editable: true },
    ],
  },
  {
    id: 'details',
    label: 'Details',
    blocks: [
      { kind: 'card', title: 'Legal entity', fields: ['status','legal_structure','ein','incorporation_date','current_fy_end','loan_report_name'], editable: true },
      { kind: 'card', title: 'Nonprofit status', fields: ['nonprofit_status','group_exemption_status'], editable: true },
      { kind: 'card', title: 'Founders', fields: ['founders'], editable: true },
      { kind: 'card', title: 'Boards + Ops', fields: ['board_members', 'ops_committee', 'fundraising_committee'], editable: true },
      { kind: 'card', title: 'Logo(s)', fields: ['logo','logo_url'], editable: true },
    ],
  },
  {
    id: 'ssj',
    label: 'SSJ',
    blocks: [
      { kind: 'card', title: 'Target location', fields: ['ssj_target_city','ssj_target_state'], editable: true },
      { kind: 'card', title: 'Milestones', fields: ['entered_visioning_date','visioning_album_complete','visioning_album','entered_planning_date','planning_album','entered_startup_date'], editable: true },
      { kind: 'card', title: 'Readiness', fields: ['ssj_ops_guide_support_track','ssj_readiness_to_open_rating', 'ssj_has_partner','ssj_board_development','ssj_on_track_for_enrollment'], editable: true },
      { kind: 'card', title: 'Branding', fields: ['ssj_name_reserved','name_selection_proposal','trademark_files','logo_designer','on_national_website'], editable: true },
      { kind: 'card', title: 'Facilities', fields: ['ssj_facility','ssj_building4good_status','date_shared_with_n4g','building4good_firm_and_attorney'], editable: true },
      { kind: 'card', title: 'Fundraising', fields: ['ssj_budget_ready_for_next_steps','ssj_seeking_wf_funding','ssj_fundraising_narrative','ssj_pathway_to_funding','ssj_total_startup_funding_needed','ssj_loan_eligibility','ssj_loan_approved_amt','ssj_amount_raised','ssj_gap_in_funding'], editable: true },
    ],
  },
  {
    id: 'systems',
    label: 'Systems',
    blocks: [
      { kind: 'card', title: 'Systems', fields: ['google_workspace_org_unit_path','transparent_classroom','admissions_system'], editable: true },
      { kind: 'card', title: 'Operations', fields: ['gsuite_roles','google_voice','website_tool','tc_recordkeeping','tc_admissions','business_insurance'], editable: true },
      { kind: 'card', title: 'Finance', fields: ['budget_utility','budget_link','qbo','bill_account','gusto','bookkeeper_or_accountant','qbo_school_codes'], editable: true },
      { kind: 'card', title: 'Compliance', fields: ['guidestar_listing_requested','nondiscrimination_policy_on_application','nondiscrimination_policy_on_website'], editable: true },
    ],
  },
  {
    id: 'educators',
    label: 'Educators',
    blocks: [
      { kind: 'table', source: { table: 'educators', fkColumn: 'school_id' }, columns: [...TABLE_COLUMNS.educators], columnMeta: TABLE_COLUMN_META.educators, rowActions: ['inline_edit', 'view_educators','email','add_note','add_task','end_link','archive'], tableActions: ['addExistingEducatorToSchool','addNewEducatorToSchool'], tableActionLabels: ['Add Existing Educator','Add New Educator'] },
    ],
  },

  {
    id: 'enrollment',
    label: 'Enrollment',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.schoolEnrollment.source, columns: [...TABLE_PRESETS.schoolEnrollment.columns], columnMeta: TABLE_PRESETS.schoolEnrollment.columnMeta, rowActions: [...(TABLE_PRESETS.schoolEnrollment.rowActions || [])], tableActions: [...(TABLE_PRESETS.schoolEnrollment.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolEnrollment.tableActionLabels || [])] },
    ],
  },
  {
    id: 'grants_and_loans',
    label: 'Grants & Loans',
    blocks: [
      { kind: 'table', width: 'half', title: 'Loans', source: TABLE_PRESETS.schoolLoans.source, columns: [...TABLE_PRESETS.schoolLoans.columns], columnMeta: TABLE_PRESETS.schoolLoans.columnMeta, rowActions: [...(TABLE_PRESETS.schoolLoans.rowActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolLoans.tableActionLabels || [])] },
      { kind: 'table', width: 'half', title: 'Grants', source: TABLE_PRESETS.schoolGrants.source, columns: [...TABLE_PRESETS.schoolGrants.columns], columnMeta: TABLE_PRESETS.schoolGrants.columnMeta, rowActions: [...(TABLE_PRESETS.schoolGrants.rowActions || [])], tableActions: [...(TABLE_PRESETS.schoolGrants.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolGrants.tableActionLabels || [])] },

    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.schoolLocations.source, columns: [...TABLE_PRESETS.schoolLocations.columns], columnMeta: TABLE_PRESETS.schoolLocations.columnMeta, rowActions: [...(TABLE_PRESETS.schoolLocations.rowActions || [])], tableActions: [...(TABLE_PRESETS.schoolLocations.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolLocations.tableActionLabels || [])] },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.schoolGuideAssignments.source, columns: [...TABLE_PRESETS.schoolGuideAssignments.columns], columnMeta: TABLE_PRESETS.schoolGuideAssignments.columnMeta, rowActions: [...(TABLE_PRESETS.schoolGuideAssignments.rowActions || [])], tableActions: [...(TABLE_PRESETS.schoolGuideAssignments.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolGuideAssignments.tableActionLabels || [])] }
    ],
  },
  {
    id: 'documents',
    label: 'Docs',
    blocks: [
      { kind: 'table', width: 'half', title: 'Documents', source: TABLE_PRESETS.schoolGovernanceDocs.source, columns: [...TABLE_PRESETS.schoolGovernanceDocs.columns], columnMeta: TABLE_PRESETS.schoolGovernanceDocs.columnMeta, rowActions: [...(TABLE_PRESETS.schoolGovernanceDocs.rowActions || [])], tableActions: [...(TABLE_PRESETS.schoolGovernanceDocs.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolGovernanceDocs.tableActionLabels || [])] },
      { kind: 'table', width: 'half', title: '990s', source: TABLE_PRESETS.schoolNineNineties.source, columns: [...TABLE_PRESETS.schoolNineNineties.columns], columnMeta: TABLE_PRESETS.schoolNineNineties.columnMeta, rowActions: [...(TABLE_PRESETS.schoolNineNineties.rowActions || [])], tableActions: [...(TABLE_PRESETS.schoolNineNineties.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolNineNineties.tableActionLabels || [])] },
    ],
  },
  {
    id: 'action_steps',
    label: 'Action Steps',
    blocks: [
      { kind: 'table', source: { table: 'action_steps', fkColumn: 'school_id' }, columns: [...TABLE_COLUMNS.actionSteps], columnMeta: TABLE_COLUMN_META.actionSteps, rowActions: [...ROW_ACTIONS.actionSteps], tableActions: [...TABLE_ACTIONS.actionSteps], tableActionLabels: ['Add Action Step'] },
    ],
  },
  {
    id: 'notes',
    label: 'Notes',
    blocks: [
      { kind: 'table', source: TABLE_PRESETS.schoolNotes.source, columns: [...TABLE_PRESETS.schoolNotes.columns], columnMeta: TABLE_PRESETS.schoolNotes.columnMeta, rowActions: [...(TABLE_PRESETS.schoolNotes.rowActions || [])], tableActions: [...(TABLE_PRESETS.schoolNotes.tableActions || [])], tableActionLabels: [...(TABLE_PRESETS.schoolNotes.tableActionLabels || [])] },
    ],
  },
  {
    id: 'google_sync',
    label: 'gmail/gCal',
    blocks: [
      { kind: 'table', width: 'half', title: 'Gmails', source: TABLE_PRESETS.schoolGmails.source, columns: [...TABLE_PRESETS.schoolGmails.columns], columnMeta: TABLE_PRESETS.schoolGmails.columnMeta, rowActions: [...(TABLE_PRESETS.schoolGmails.rowActions || [])] },
      { kind: 'table', width: 'half', title: 'Calendar Events', source: TABLE_PRESETS.schoolCalendarEvents.source, columns: [...TABLE_PRESETS.schoolCalendarEvents.columns], columnMeta: TABLE_PRESETS.schoolCalendarEvents.columnMeta, rowActions: [...(TABLE_PRESETS.schoolCalendarEvents.rowActions || [])] },
    ],
  },

];



export const SCHOOL_FIELD_METADATA: FieldMetadataMap = {
  'about': { label: 'About', type: 'string', multiline: true, edit: { table: 'schools' } },
  'about_spanish': { label: 'About (Spanish)', type: 'string', multiline: true, edit: { table: 'schools' } },
  'ages_served': { label: 'Ages Served', type: 'enum', array: true, edit: { table: 'schools' , enumName: 'ages_spans_rev'} },
  'current_cohort': { label: 'Current Cohort', type: 'string'},
  'current_fy_end': { label: 'Current Fiscal Year End', type: 'enum', edit: { table: 'schools' , enumName: 'fiscal_year_end'} },
  'current_guide_name': { label: 'Current Guide Name', type: 'string' },
  'current_tls': { label: 'Current TLs', type: 'string'},
  'domain_name': { label: 'Domain Name', type: 'string', edit: { table: 'schools' } },
  'ein': { label: 'EIN', type: 'string', edit: { table: 'schools' } },
  'enrollment_at_full_capacity': { label: 'Enrollment at Full Capacity', type: 'number', edit: { table: 'schools' } },
  'entered_planning_date': { label: 'Entered Planning Date', type: 'date', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'entered_startup_date': { label: 'Entered Startup Date', type: 'date', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'entered_visioning_date': { label: 'Entered Visioning Date', type: 'date', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'facebook': { label: 'Facebook', type: 'string', edit: { table: 'schools' } },
  'founding_tls': { label: 'Founding TLs', type: 'string', array: true, edit: { table: 'people'}, lookup: { table: 'guides', valueColumn: 'email_or_name', labelColumn: 'email_or_name' } },
  'governance_model': { label: 'Governance Model', type: 'enum', edit: { table: 'schools' , enumName: 'governance_models'} },
  'incorporation_date': { label: 'Incorporation Date', type: 'date', edit: { table: 'schools' } },
  'instagram': { label: 'Instagram', type: 'string', edit: { table: 'schools' } },
  'institutional_partner': { label: 'Institutional Partner', type: 'string', edit: { table: 'schools' } },
  'legal_structure': { label: 'Legal Structure', type: 'enum', edit: { table: 'schools' ,enumName: 'legal_structure_options'} },
  'loan_report_name': { label: 'Loan Report Name', type: 'string', edit: { table: 'schools' } },  
  'logo': { label: 'Logo', type: 'attachment' },  
  'logo_url': { label: 'Logo URL', type: 'string' },
  'long_name': { label: 'Long Name', type: 'string', edit: { table: 'schools' } },  
  'mailing_address': { label: 'Mailing Address', type: 'string', multiline: true },
  'membership_status': { label: 'Membership Status', type: 'string', edit: { table: 'schools' } , lookup: { table: 'ref_membership_statuses', valueColumn: 'value', labelColumn: 'value' } },
  'nonprofit_status': { label: 'Nonprofit Status', type: 'enum', edit: { table: 'schools' ,enumName: 'nonprofit_status_rev'} },
  'number_of_classrooms': { label: 'Number of Classrooms', type: 'number', edit: { table: 'schools' } },
  'open_date': { label: 'Open Date', type: 'date', edit: { table: 'schools' } },
  'physical_address': { label: 'Physical Address', type: 'string', multiline: true },  
  'physical_lat': { label: 'Latitude', type: 'number' },  
  'physical_long': { label: 'Longitude', type: 'number' },
  'planning_album': { label: 'Planning Album', type: 'attachment', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'prior_names': { label: 'Prior Names', type: 'string', edit: { table: 'schools' } },
  'program_focus': { label: 'Program Focus', type: 'string', multiline: true, edit: { table: 'schools' } },
  'public_funding': { label: 'Public Funding', type: 'string', array: true, edit: { table: 'schools'}, lookup: { table: 'ref_public_funding_sources', valueColumn: 'value', labelColumn: 'value' } },
  'risk_factors': { label: 'Risk Factors', type: 'string', multiline: true, edit: { table: 'schools' } },
  'school_email': { label: 'School Email', type: 'string', edit: { table: 'schools' } },
  'school_name': { label: 'School Name', type: 'string', edit: { table: 'schools' } },
  'school_phone': { label: 'School Phone', type: 'string', edit: { table: 'schools' } },
  'short_name': { label: 'Short Name', type: 'string', edit: { table: 'schools' } },
  'ssj_amount_raised': { label: 'Amount Raised', type: 'string', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'ssj_board_development': { label: 'Board Development', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id',enumName:'ssj_board_dev_status' } },
  'ssj_budget_ready_for_next_steps': { label: 'Budget Ready for Next Steps', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id', enumName:'ssj_budget_ready_for_next_steps_enum' } },
  'ssj_facility': { label: 'Facility', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id', enumName: 'ssj_facility_enum' } },
  'ssj_fundraising_narrative': { label: 'Fundraising Narrative', type: 'string', multiline: true, edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'ssj_gap_in_funding': { label: 'Gap in Funding', type: 'string', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'ssj_has_partner': { label: 'Has Partner', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id', enumName: 'ssj_has_partner_enum' } },
  'ssj_loan_approved_amt': { label: 'Loan Approved Amount', type: 'number', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'ssj_loan_eligibility': { label: 'Loan Eligibility', type: 'string', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'ssj_on_track_for_enrollment': { label: 'On Track for Enrollment', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id', enumName: 'ssj_on_track_for_enrollment_enum' } },
  'ssj_ops_guide_support_track': { label: 'Ops Guide Support Track', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id', enumName: 'ssj_ops_guide_support_track_enum' } },
  'ssj_pathway_to_funding': { label: 'Pathway to Funding', type: 'enum', multiline: true, edit: { table: 'schools_ssj_data', pk: 'school_id', enumName: 'ssj_pathway_to_funding_enum' } },
  'ssj_readiness_to_open_rating': { label: 'Readiness to Open Rating', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id' , enumName: 'high_med_low'} },
  'ssj_seeking_wf_funding': { label: 'Seeking WF Funding', type: 'enum', edit: { table: 'schools_ssj_data', pk: 'school_id', enumName: 'ssj_seeking_wf_funding_enum' } },
  'ssj_target_city': { label: 'SSJ Target City', type: 'string', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'ssj_target_state': { label: 'SSJ Target State', type: 'string', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'ssj_total_startup_funding_needed': { label: 'Total Startup Funding Needed', type: 'string', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'stage_status': { label: 'Stage Status', type: 'enum'},
  'status': { label: 'Status', type: 'enum', edit: { table: 'schools' , enumName: 'school_statuses'} },  
  'total_grants_issued': { label: 'Total Grants Issued', type: 'number' },  
  'total_loans_issued': { label: 'Total Loans Issued', type: 'number' },
  'visioning_album': { label: 'Visioning Album', type: 'attachment', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'visioning_album_complete': { label: 'Visioning Album Complete', type: 'boolean', edit: { table: 'schools_ssj_data', pk: 'school_id' } },
  'watchlist': { label: 'Watchlist', type: 'string', multiline: true, edit: { table: 'schools' } },
  'website': { label: 'Website', type: 'string', edit: { table: 'schools' } },
};
