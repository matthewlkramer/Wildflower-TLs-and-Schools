// Presets are self-contained
import { write } from 'fs';
import type { ColumnVisibility, GridValueKind, GridColumnConfig, FieldMetadataMap } from '../shared/detail-types';

export type { ColumnVisibility, GridValueKind } from '../shared/detail-types';
export type CharterColumnConfig = GridColumnConfig;
// Legacy detail tab types removed; tabs now come from view specs.

// Grid and kanban constants now live in views.ts
 


export const CHARTER_FIELD_METADATA: FieldMetadataMap = {
  'app_walkthrough_date': { writeTable: 'charter_applications'},
  'app_window': { writeTable: 'charter_applications'},
  'application': { type: 'attachment', writeTable: 'charter_applications'},
  'auth_decision': { label: 'Authorization Decision', writeTable: 'charter_applications'},
  'authorizer': { writeTable: 'charter_applications', lookup: { table: 'charter_authorizers', valueColumn: 'authorizer_name', labelColumn: 'authorizer_name' }},
  'beg_age': { label: 'Beginning Age', writeTable: 'charter_applications'},
  'board_membership_signed_date': { writeTable: 'charter_applications'},
  'budget_exercises': { type: 'attachment', writeTable: 'charter_applications' },
  'budget_final': { label: 'Final Budget', type: 'attachment', writeTable: 'charter_applications' },
  'capacity_intv_completed_date': { label: 'Capacity Interview Completed Date', writeTable: 'charter_applications' },
  'capacity_intv_proj_complete': { label: 'Capacity Interview Projected Complete', writeTable: 'charter_applications' },
  'capacity_intv_training_date': { label: 'Capacity Interview Training Date', writeTable: 'charter_applications' },
  'charter_app_pm_plan_complete': { label: 'PM Plan Complete', writeTable: 'charter_applications' },
  'charter_app_roles_set': { label: 'Roles Set', writeTable: 'charter_applications' },
  'comm_engagement_underway': { label: 'Community Engagement Underway', writeTable: 'charter_applications' },
  'current_fy_end': { label: 'Current Fiscal Year End', writeTable: 'charter_applications' },
  'decision_expected_date': { writeTable: 'charter_applications' },
  'design_advice_session_complete': { writeTable: 'charter_applications' },
  'design_album': { type: 'attachment', writeTable: 'charter_applications' },
  'end_age': { label: 'Ending Age', writeTable: 'charter_applications' },
  'incorp_date': { label: 'Incorporation Date'},
  'initial_target_geo': { label: 'Initial Target Geography' },
  'internal_support_meeting_date': {writeTable: 'charter_applications' },
  'joint_kickoff_meeting_date': { writeTable: 'charter_applications' },
  'landscape_analysis': { type: 'attachment', writeTable: 'charter_applications' },
  'logic_model_complete': { writeTable: 'charter_applications' },
  'loi': { label: 'LOI Document', type: 'attachment', writeTable: 'charter_applications' },
  'loi_deadline': { label: 'LOI Deadline', writeTable: 'charter_applications' },
  'loi_required': { label: 'LOI Required', writeTable: 'charter_applications' },
  'loi_submitted': { label: 'LOI Submitted', writeTable: 'charter_applications' },
  'membership_status': { lookup: { table: 'ref_membership_statuses', valueColumn: 'value', labelColumn: 'value' } },
  'non_discrimination_policy_on_website': { label: 'Non-Discrimination Policy on Website'},
  'num_students': { label: 'Projected Students', writeTable: 'charter_applications' },
  'opps_challenges': { label: 'Opportunities & Challenges', multiline: true, writeTable: 'charter_applications' },
  'proj_open_date': { label: 'Projected Open Date', writeTable: 'charter_applications' },
  'target_open': { label: 'Target Open Date', writeTable: 'charter_applications' },
  'team': { label: 'Team', type: 'string', multiline: true, writeTable: 'charter_applications' },
  'total_grants_issued': { editable: false },
  'total_loans_issued': { editable: false },
};

