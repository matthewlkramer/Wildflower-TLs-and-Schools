// AUTO-GENERATED FILE. DO NOT EDIT.
// Run "pnpm tsx scripts/generate-schema-metadata.ts" from client-new/ to regenerate.

export const schemaMetadata = {
  "public": {
    "action_steps": {
      "columns": {
        "assigned_date": {
          "schema": "public",
          "table": "action_steps",
          "column": "assigned_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assignee": {
          "schema": "public",
          "table": "action_steps",
          "column": "assignee",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "action_steps",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "completed_date": {
          "schema": "public",
          "table": "action_steps",
          "column": "completed_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "due_date": {
          "schema": "public",
          "table": "action_steps",
          "column": "due_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "guide_id": {
          "schema": "public",
          "table": "action_steps",
          "column": "guide_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "guides",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "id": {
          "schema": "public",
          "table": "action_steps",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "action_steps",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "item": {
          "schema": "public",
          "table": "action_steps",
          "column": "item",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "item_status": {
          "schema": "public",
          "table": "action_steps",
          "column": "item_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "action_steps",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "school_id": {
          "schema": "public",
          "table": "action_steps",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "annual_assessment_and_metrics_data": {
      "columns": {
        "assessed_bipoc": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "assessed_bipoc",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assessed_ell": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "assessed_ell",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assessed_frl": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "assessed_frl",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assessed_sped": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "assessed_sped",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assessed_total": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "assessed_total",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assessment_or_metric": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "assessment_or_metric",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "id": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "met_plus_bipoc": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "met_plus_bipoc",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "met_plus_ell": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "met_plus_ell",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "met_plus_frl": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "met_plus_frl",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "met_plus_sped": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "met_plus_sped",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "met_plus_total": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "met_plus_total",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "metric_data": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "metric_data",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "school_year": {
          "schema": "public",
          "table": "annual_assessment_and_metrics_data",
          "column": "school_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ref_school_years",
              "referencedColumns": [
                "value"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "annual_enrollment_and_demographics": {
      "columns": {
        "charter_id": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "enrolled_bipoc": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "enrolled_bipoc",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "enrolled_ell": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "enrolled_ell",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "enrolled_frl": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "enrolled_frl",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "enrolled_sped": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "enrolled_sped",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "enrolled_students_total": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "enrolled_students_total",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "school_year": {
          "schema": "public",
          "table": "annual_enrollment_and_demographics",
          "column": "school_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ref_school_years",
              "referencedColumns": [
                "value"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "charter_applications": {
      "columns": {
        "app_deadline": {
          "schema": "public",
          "table": "charter_applications",
          "column": "app_deadline",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "app_status": {
          "schema": "public",
          "table": "charter_applications",
          "column": "app_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "app_submitted": {
          "schema": "public",
          "table": "charter_applications",
          "column": "app_submitted",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "app_walkthrough_date": {
          "schema": "public",
          "table": "charter_applications",
          "column": "app_walkthrough_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "app_window": {
          "schema": "public",
          "table": "charter_applications",
          "column": "app_window",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "auth_decision": {
          "schema": "public",
          "table": "charter_applications",
          "column": "auth_decision",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "authorizor": {
          "schema": "public",
          "table": "charter_applications",
          "column": "authorizor",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "beg_age": {
          "schema": "public",
          "table": "charter_applications",
          "column": "beg_age",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "board_membership_signed_date": {
          "schema": "public",
          "table": "charter_applications",
          "column": "board_membership_signed_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "budget_exercises": {
          "schema": "public",
          "table": "charter_applications",
          "column": "budget_exercises",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "budget_final": {
          "schema": "public",
          "table": "charter_applications",
          "column": "budget_final",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "capacity_intv_completed_date": {
          "schema": "public",
          "table": "charter_applications",
          "column": "capacity_intv_completed_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "capacity_intv_proj_date": {
          "schema": "public",
          "table": "charter_applications",
          "column": "capacity_intv_proj_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "capacity_intv_training_complete": {
          "schema": "public",
          "table": "charter_applications",
          "column": "capacity_intv_training_complete",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_app_pm_plan_complete": {
          "schema": "public",
          "table": "charter_applications",
          "column": "charter_app_pm_plan_complete",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_app_roles_set": {
          "schema": "public",
          "table": "charter_applications",
          "column": "charter_app_roles_set",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "charter_applications",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "comm_engagement_underway": {
          "schema": "public",
          "table": "charter_applications",
          "column": "comm_engagement_underway",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "decision_expected_date": {
          "schema": "public",
          "table": "charter_applications",
          "column": "decision_expected_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "design_advice_session_complete": {
          "schema": "public",
          "table": "charter_applications",
          "column": "design_advice_session_complete",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "design_album": {
          "schema": "public",
          "table": "charter_applications",
          "column": "design_album",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "end_age": {
          "schema": "public",
          "table": "charter_applications",
          "column": "end_age",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "charter_applications",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "internal_support_meeting_date": {
          "schema": "public",
          "table": "charter_applications",
          "column": "internal_support_meeting_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "charter_applications",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "joint_kickoff_meeting_date": {
          "schema": "public",
          "table": "charter_applications",
          "column": "joint_kickoff_meeting_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "logic_model_complete": {
          "schema": "public",
          "table": "charter_applications",
          "column": "logic_model_complete",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loi": {
          "schema": "public",
          "table": "charter_applications",
          "column": "loi",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loi_deadline": {
          "schema": "public",
          "table": "charter_applications",
          "column": "loi_deadline",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loi_required": {
          "schema": "public",
          "table": "charter_applications",
          "column": "loi_required",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loi_submitted": {
          "schema": "public",
          "table": "charter_applications",
          "column": "loi_submitted",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "most_recent_app": {
          "schema": "public",
          "table": "charter_applications",
          "column": "most_recent_app",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "nonprofit_status": {
          "schema": "public",
          "table": "charter_applications",
          "column": "nonprofit_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "num_students": {
          "schema": "public",
          "table": "charter_applications",
          "column": "num_students",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "odds_authorization": {
          "schema": "public",
          "table": "charter_applications",
          "column": "odds_authorization",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "odds_on_time_open": {
          "schema": "public",
          "table": "charter_applications",
          "column": "odds_on_time_open",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "charter_applications",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "opps_challenges": {
          "schema": "public",
          "table": "charter_applications",
          "column": "opps_challenges",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "support_timeline": {
          "schema": "public",
          "table": "charter_applications",
          "column": "support_timeline",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "target_open": {
          "schema": "public",
          "table": "charter_applications",
          "column": "target_open",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "team": {
          "schema": "public",
          "table": "charter_applications",
          "column": "team",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "charter_authorization_actions": {
      "columns": {
        "action": {
          "schema": "public",
          "table": "charter_authorization_actions",
          "column": "action",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "action_date": {
          "schema": "public",
          "table": "charter_authorization_actions",
          "column": "action_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "authorized_after_action": {
          "schema": "public",
          "table": "charter_authorization_actions",
          "column": "authorized_after_action",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "authorizer": {
          "schema": "public",
          "table": "charter_authorization_actions",
          "column": "authorizer",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "charter_authorization_actions",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "charter_authorization_actions",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "charter_authorization_actions",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "charter_authorizers": {
      "columns": {
        "active": {
          "schema": "public",
          "table": "charter_authorizers",
          "column": "active",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "authorizer_name": {
          "schema": "public",
          "table": "charter_authorizers",
          "column": "authorizer_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "charter_authorizers",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "is_archived": {
          "schema": "public",
          "table": "charter_authorizers",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "start_of_authorization": {
          "schema": "public",
          "table": "charter_authorizers",
          "column": "start_of_authorization",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "charters": {
      "columns": {
        "application": {
          "schema": "public",
          "table": "charters",
          "column": "application",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "cohorts": {
          "schema": "public",
          "table": "charters",
          "column": "cohorts",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "current_fy_end": {
          "schema": "public",
          "table": "charters",
          "column": "current_fy_end",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ein": {
          "schema": "public",
          "table": "charters",
          "column": "ein",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_site_opened_date": {
          "schema": "public",
          "table": "charters",
          "column": "first_site_opened_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "full_name": {
          "schema": "public",
          "table": "charters",
          "column": "full_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "group_exemption_status": {
          "schema": "public",
          "table": "charters",
          "column": "group_exemption_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "guidestar_listing_requested": {
          "schema": "public",
          "table": "charters",
          "column": "guidestar_listing_requested",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "charters",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "incorp_date": {
          "schema": "public",
          "table": "charters",
          "column": "incorp_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "initial_authorization": {
          "schema": "public",
          "table": "charters",
          "column": "initial_authorization",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "initial_authorizer": {
          "schema": "public",
          "table": "charters",
          "column": "initial_authorizer",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "initial_target_geo": {
          "schema": "public",
          "table": "charters",
          "column": "initial_target_geo",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "initial_target_planes": {
          "schema": "public",
          "table": "charters",
          "column": "initial_target_planes",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "charters",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "landscape_analysis": {
          "schema": "public",
          "table": "charters",
          "column": "landscape_analysis",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "membership_status": {
          "schema": "public",
          "table": "charters",
          "column": "membership_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ref_membership_statuses",
              "referencedColumns": [
                "value"
              ],
              "isOneToOne": false
            }
          ]
        },
        "non_discrimination_policy_on_website": {
          "schema": "public",
          "table": "charters",
          "column": "non_discrimination_policy_on_website",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "non_tl_roles": {
          "schema": "public",
          "table": "charters",
          "column": "non_tl_roles",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "nonprofit_status": {
          "schema": "public",
          "table": "charters",
          "column": "nonprofit_status",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "charters",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "partnership_with_wf": {
          "schema": "public",
          "table": "charters",
          "column": "partnership_with_wf",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_provided_1023": {
          "schema": "public",
          "table": "charters",
          "column": "school_provided_1023",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "short_name": {
          "schema": "public",
          "table": "charters",
          "column": "short_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "status": {
          "schema": "public",
          "table": "charters",
          "column": "status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "website": {
          "schema": "public",
          "table": "charters",
          "column": "website",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "cohort_participation": {
      "columns": {
        "charter_id": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "cohort": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "cohort",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "cohorts",
              "referencedColumns": [
                "cohort_title"
              ],
              "isOneToOne": false
            }
          ]
        },
        "created_at": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "created_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "participation_status": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "participation_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "cohort_participation",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "cohorts": {
      "columns": {
        "cohort_title": {
          "schema": "public",
          "table": "cohorts",
          "column": "cohort_title",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "cohort_type": {
          "schema": "public",
          "table": "cohorts",
          "column": "cohort_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "cohorts",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "start_date": {
          "schema": "public",
          "table": "cohorts",
          "column": "start_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "email_addresses": {
      "columns": {
        "category": {
          "schema": "public",
          "table": "email_addresses",
          "column": "category",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created_at": {
          "schema": "public",
          "table": "email_addresses",
          "column": "created_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "email_address": {
          "schema": "public",
          "table": "email_addresses",
          "column": "email_address",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "email_addresses",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "email_addresses",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_primary": {
          "schema": "public",
          "table": "email_addresses",
          "column": "is_primary",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_valid": {
          "schema": "public",
          "table": "email_addresses",
          "column": "is_valid",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "email_addresses",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "email_drafts": {
      "columns": {
        "bcc_emails": {
          "schema": "public",
          "table": "email_drafts",
          "column": "bcc_emails",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "body": {
          "schema": "public",
          "table": "email_drafts",
          "column": "body",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "cc_emails": {
          "schema": "public",
          "table": "email_drafts",
          "column": "cc_emails",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "email_drafts",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "email_drafts",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sent": {
          "schema": "public",
          "table": "email_drafts",
          "column": "sent",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sent_at": {
          "schema": "public",
          "table": "email_drafts",
          "column": "sent_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "subject": {
          "schema": "public",
          "table": "email_drafts",
          "column": "subject",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "to_emails": {
          "schema": "public",
          "table": "email_drafts",
          "column": "to_emails",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "updated_at": {
          "schema": "public",
          "table": "email_drafts",
          "column": "updated_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "user_id": {
          "schema": "public",
          "table": "email_drafts",
          "column": "user_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "event_attendance": {
      "columns": {
        "attended_event": {
          "schema": "public",
          "table": "event_attendance",
          "column": "attended_event",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "duration_at_event_in_minutes": {
          "schema": "public",
          "table": "event_attendance",
          "column": "duration_at_event_in_minutes",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "event_name": {
          "schema": "public",
          "table": "event_attendance",
          "column": "event_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "event_list",
              "referencedColumns": [
                "event_name"
              ],
              "isOneToOne": false
            }
          ]
        },
        "id": {
          "schema": "public",
          "table": "event_attendance",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "event_attendance",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "event_attendance",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "registration_date": {
          "schema": "public",
          "table": "event_attendance",
          "column": "registration_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "spanish_translation_needed": {
          "schema": "public",
          "table": "event_attendance",
          "column": "spanish_translation_needed",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "event_list": {
      "columns": {
        "event_date": {
          "schema": "public",
          "table": "event_list",
          "column": "event_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "event_name": {
          "schema": "public",
          "table": "event_list",
          "column": "event_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "event_list",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "type": {
          "schema": "public",
          "table": "event_list",
          "column": "type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ref_event_types",
              "referencedColumns": [
                "value"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "governance_docs": {
      "columns": {
        "charter_id": {
          "schema": "public",
          "table": "governance_docs",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "doc_type": {
          "schema": "public",
          "table": "governance_docs",
          "column": "doc_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "governance_docs",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "governance_docs",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "pdf": {
          "schema": "public",
          "table": "governance_docs",
          "column": "pdf",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "governance_docs",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "grants": {
      "columns": {
        "accounting_notes": {
          "schema": "public",
          "table": "grants",
          "column": "accounting_notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_501c3_proof": {
          "schema": "public",
          "table": "grants",
          "column": "actual_501c3_proof",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_ein": {
          "schema": "public",
          "table": "grants",
          "column": "actual_ein",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_mailing_address": {
          "schema": "public",
          "table": "grants",
          "column": "actual_mailing_address",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_membership_status": {
          "schema": "public",
          "table": "grants",
          "column": "actual_membership_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_nonprofit_status": {
          "schema": "public",
          "table": "grants",
          "column": "actual_nonprofit_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_school_legal_name": {
          "schema": "public",
          "table": "grants",
          "column": "actual_school_legal_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_tl_emails": {
          "schema": "public",
          "table": "grants",
          "column": "actual_tl_emails",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "actual_tls": {
          "schema": "public",
          "table": "grants",
          "column": "actual_tls",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "amount": {
          "schema": "public",
          "table": "grants",
          "column": "amount",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "automation_step_trigger": {
          "schema": "public",
          "table": "grants",
          "column": "automation_step_trigger",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "bill_account": {
          "schema": "public",
          "table": "grants",
          "column": "bill_account",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "grants",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "end_of_full_advice_window": {
          "schema": "public",
          "table": "grants",
          "column": "end_of_full_advice_window",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "full_advice_request_timestamp": {
          "schema": "public",
          "table": "grants",
          "column": "full_advice_request_timestamp",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "funding_period": {
          "schema": "public",
          "table": "grants",
          "column": "funding_period",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "funding_purpose": {
          "schema": "public",
          "table": "grants",
          "column": "funding_purpose",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "funding_source": {
          "schema": "public",
          "table": "grants",
          "column": "funding_source",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "grant_advice": {
          "schema": "public",
          "table": "grants",
          "column": "grant_advice",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "grant_status": {
          "schema": "public",
          "table": "grants",
          "column": "grant_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "guide_first_name": {
          "schema": "public",
          "table": "grants",
          "column": "guide_first_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "grants",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "grants",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "issue_date": {
          "schema": "public",
          "table": "grants",
          "column": "issue_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "issued_by": {
          "schema": "public",
          "table": "grants",
          "column": "issued_by",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "label": {
          "schema": "public",
          "table": "grants",
          "column": "label",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ledger_entry": {
          "schema": "public",
          "table": "grants",
          "column": "ledger_entry",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "notes": {
          "schema": "public",
          "table": "grants",
          "column": "notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "grants",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "prelim_advice_request_timestamp": {
          "schema": "public",
          "table": "grants",
          "column": "prelim_advice_request_timestamp",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "qbo_number": {
          "schema": "public",
          "table": "grants",
          "column": "qbo_number",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ready_to_accept_flag": {
          "schema": "public",
          "table": "grants",
          "column": "ready_to_accept_flag",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ready_to_issue_grant_letter_flag": {
          "schema": "public",
          "table": "grants",
          "column": "ready_to_issue_grant_letter_flag",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "School Grant Name": {
          "schema": "public",
          "table": "grants",
          "column": "School Grant Name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "grants",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "signed_grant_agreement": {
          "schema": "public",
          "table": "grants",
          "column": "signed_grant_agreement",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "unsigned_grant_agreement": {
          "schema": "public",
          "table": "grants",
          "column": "unsigned_grant_agreement",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "group_exemption_actions": {
      "columns": {
        "action": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "action",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "action_date": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "action_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "created_at": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "created_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "group_exemption_status_after_action": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "group_exemption_status_after_action",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "notes": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "group_exemption_actions",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "guide_assignments": {
      "columns": {
        "active": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "active",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "email_or_name": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "email_or_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "guides",
              "referencedColumns": [
                "email_or_name"
              ],
              "isOneToOne": false
            }
          ]
        },
        "end_date": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "end_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "guide_id": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "guide_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "guides",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "id": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "start_date": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "start_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "type": {
          "schema": "public",
          "table": "guide_assignments",
          "column": "type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "guides": {
      "columns": {
        "birthdate": {
          "schema": "public",
          "table": "guides",
          "column": "birthdate",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "currently_active": {
          "schema": "public",
          "table": "guides",
          "column": "currently_active",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "email": {
          "schema": "public",
          "table": "guides",
          "column": "email",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "email_or_name": {
          "schema": "public",
          "table": "guides",
          "column": "email_or_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "full_name": {
          "schema": "public",
          "table": "guides",
          "column": "full_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "home_address": {
          "schema": "public",
          "table": "guides",
          "column": "home_address",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "guides",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "image_url": {
          "schema": "public",
          "table": "guides",
          "column": "image_url",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "guides",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "guides",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "partner_roles": {
          "schema": "public",
          "table": "guides",
          "column": "partner_roles",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "phone": {
          "schema": "public",
          "table": "guides",
          "column": "phone",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "short_name": {
          "schema": "public",
          "table": "guides",
          "column": "short_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "lead_routing_and_templates": {
      "columns": {
        "cc": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "cc",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "geo_type": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "geo_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "growth_lead": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "growth_lead",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "guides",
              "referencedColumns": [
                "email"
              ],
              "isOneToOne": false
            }
          ]
        },
        "indiv_type": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "indiv_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "indiv_type_array": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "indiv_type_array",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "language": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "language",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "language_array": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "language_array",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "rule": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "rule",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "sender": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "sender",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sendgrid_template_id": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "sendgrid_template_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "source": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "source",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "states": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "states",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "states_array": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "states_array",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "us_or_intl": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "us_or_intl",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "us_or_intl_array": {
          "schema": "public",
          "table": "lead_routing_and_templates",
          "column": "us_or_intl_array",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "loans": {
      "columns": {
        "amount_issued": {
          "schema": "public",
          "table": "loans",
          "column": "amount_issued",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "loans",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "id": {
          "schema": "public",
          "table": "loans",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "interest_rate": {
          "schema": "public",
          "table": "loans",
          "column": "interest_rate",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "loans",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "issue_date": {
          "schema": "public",
          "table": "loans",
          "column": "issue_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Loan Key": {
          "schema": "public",
          "table": "loans",
          "column": "Loan Key",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loan_docs": {
          "schema": "public",
          "table": "loans",
          "column": "loan_docs",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loan_status": {
          "schema": "public",
          "table": "loans",
          "column": "loan_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "maturity": {
          "schema": "public",
          "table": "loans",
          "column": "maturity",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "notes": {
          "schema": "public",
          "table": "loans",
          "column": "notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "loans",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "loans",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "use_of_proceeds": {
          "schema": "public",
          "table": "loans",
          "column": "use_of_proceeds",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "vehicle": {
          "schema": "public",
          "table": "loans",
          "column": "vehicle",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "locations": {
      "columns": {
        "address": {
          "schema": "public",
          "table": "locations",
          "column": "address",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "census_tract": {
          "schema": "public",
          "table": "locations",
          "column": "census_tract",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "locations",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "city": {
          "schema": "public",
          "table": "locations",
          "column": "city",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "co_location_partner": {
          "schema": "public",
          "table": "locations",
          "column": "co_location_partner",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "co_location_type": {
          "schema": "public",
          "table": "locations",
          "column": "co_location_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "country": {
          "schema": "public",
          "table": "locations",
          "column": "country",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created_datetime": {
          "schema": "public",
          "table": "locations",
          "column": "created_datetime",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "current_mail_address": {
          "schema": "public",
          "table": "locations",
          "column": "current_mail_address",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "current_physical_address": {
          "schema": "public",
          "table": "locations",
          "column": "current_physical_address",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "end_date": {
          "schema": "public",
          "table": "locations",
          "column": "end_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "geocode_last_run_at": {
          "schema": "public",
          "table": "locations",
          "column": "geocode_last_run_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "locations",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "locations",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "lat": {
          "schema": "public",
          "table": "locations",
          "column": "lat",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "lease": {
          "schema": "public",
          "table": "locations",
          "column": "lease",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "lease_end_date": {
          "schema": "public",
          "table": "locations",
          "column": "lease_end_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "long": {
          "schema": "public",
          "table": "locations",
          "column": "long",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "mailable": {
          "schema": "public",
          "table": "locations",
          "column": "mailable",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "max_students": {
          "schema": "public",
          "table": "locations",
          "column": "max_students",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "modified_datetime": {
          "schema": "public",
          "table": "locations",
          "column": "modified_datetime",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "neighborhood": {
          "schema": "public",
          "table": "locations",
          "column": "neighborhood",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "physical": {
          "schema": "public",
          "table": "locations",
          "column": "physical",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "qualified_low_income_tract": {
          "schema": "public",
          "table": "locations",
          "column": "qualified_low_income_tract",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "locations",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "sq_ft": {
          "schema": "public",
          "table": "locations",
          "column": "sq_ft",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "start_date": {
          "schema": "public",
          "table": "locations",
          "column": "start_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "state": {
          "schema": "public",
          "table": "locations",
          "column": "state",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "street": {
          "schema": "public",
          "table": "locations",
          "column": "street",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "zip": {
          "schema": "public",
          "table": "locations",
          "column": "zip",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "mailing_lists": {
      "columns": {
        "google_group_id": {
          "schema": "public",
          "table": "mailing_lists",
          "column": "google_group_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "mailing_lists",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "name": {
          "schema": "public",
          "table": "mailing_lists",
          "column": "name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "slug": {
          "schema": "public",
          "table": "mailing_lists",
          "column": "slug",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sub_name": {
          "schema": "public",
          "table": "mailing_lists",
          "column": "sub_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "type": {
          "schema": "public",
          "table": "mailing_lists",
          "column": "type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "membership_actions": {
      "columns": {
        "action": {
          "schema": "public",
          "table": "membership_actions",
          "column": "action",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "action_date": {
          "schema": "public",
          "table": "membership_actions",
          "column": "action_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "agreement_version": {
          "schema": "public",
          "table": "membership_actions",
          "column": "agreement_version",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "attachments": {
          "schema": "public",
          "table": "membership_actions",
          "column": "attachments",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "membership_actions",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "created_at": {
          "schema": "public",
          "table": "membership_actions",
          "column": "created_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "membership_actions",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "membership_actions",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "membership_status_after_action": {
          "schema": "public",
          "table": "membership_actions",
          "column": "membership_status_after_action",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ref_membership_statuses",
              "referencedColumns": [
                "value"
              ],
              "isOneToOne": false
            }
          ]
        },
        "notes": {
          "schema": "public",
          "table": "membership_actions",
          "column": "notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "membership_actions",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "montessori_certs": {
      "columns": {
        "admin_credential": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "admin_credential",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assistant_training": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "assistant_training",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "association": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "association",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "cert_completion_status": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "cert_completion_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "cert_level": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "cert_level",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created_date": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "created_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "macte_accredited": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "macte_accredited",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "trainer": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "trainer",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "training_center": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "training_center",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "year": {
          "schema": "public",
          "table": "montessori_certs",
          "column": "year",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "nine_nineties": {
      "columns": {
        "ai_derived_EOY": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "ai_derived_EOY",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ai_derived_revenue": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "ai_derived_revenue",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "form_year": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "form_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "link": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "link",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "notes": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "pdf": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "pdf",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "nine_nineties",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "notes": {
      "columns": {
        "action_step_id": {
          "schema": "public",
          "table": "notes",
          "column": "action_step_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "action_steps",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "charter_application_id": {
          "schema": "public",
          "table": "notes",
          "column": "charter_application_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charter_applications",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "charter_id": {
          "schema": "public",
          "table": "notes",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "created_by": {
          "schema": "public",
          "table": "notes",
          "column": "created_by",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created_date": {
          "schema": "public",
          "table": "notes",
          "column": "created_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "governance_doc_id": {
          "schema": "public",
          "table": "notes",
          "column": "governance_doc_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "governance_docs",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "grant_id": {
          "schema": "public",
          "table": "notes",
          "column": "grant_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "grants",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "guide_id": {
          "schema": "public",
          "table": "notes",
          "column": "guide_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "guides",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "id": {
          "schema": "public",
          "table": "notes",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "notes",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_private": {
          "schema": "public",
          "table": "notes",
          "column": "is_private",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loan_id": {
          "schema": "public",
          "table": "notes",
          "column": "loan_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "loans",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "montessori_cert_id": {
          "schema": "public",
          "table": "notes",
          "column": "montessori_cert_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "montessori_certs",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "nine_ninety_id": {
          "schema": "public",
          "table": "notes",
          "column": "nine_ninety_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "nine_nineties",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "people_id": {
          "schema": "public",
          "table": "notes",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "school_id": {
          "schema": "public",
          "table": "notes",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "ssj_fillout_form_id": {
          "schema": "public",
          "table": "notes",
          "column": "ssj_fillout_form_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ssj_fillout_forms",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "text": {
          "schema": "public",
          "table": "notes",
          "column": "text",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "open_date_revisions": {
      "columns": {
        "charter_id": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "created_at": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "created_at",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "notes": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "prior_proj_open_date": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "prior_proj_open_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "proj_open_date": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "proj_open_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "open_date_revisions",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "people": {
      "columns": {
        "childhood_income": {
          "schema": "public",
          "table": "people",
          "column": "childhood_income",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created": {
          "schema": "public",
          "table": "people",
          "column": "created",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created_by": {
          "schema": "public",
          "table": "people",
          "column": "created_by",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "educ_attainment": {
          "schema": "public",
          "table": "people",
          "column": "educ_attainment",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "exclude_from_email_logging": {
          "schema": "public",
          "table": "people",
          "column": "exclude_from_email_logging",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_name": {
          "schema": "public",
          "table": "people",
          "column": "first_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "full_name": {
          "schema": "public",
          "table": "people",
          "column": "full_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "gender": {
          "schema": "public",
          "table": "people",
          "column": "gender",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "gender_other": {
          "schema": "public",
          "table": "people",
          "column": "gender_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "google_groups": {
          "schema": "public",
          "table": "people",
          "column": "google_groups",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "hh_income": {
          "schema": "public",
          "table": "people",
          "column": "hh_income",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "home_address": {
          "schema": "public",
          "table": "people",
          "column": "home_address",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "people",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "indiv_type": {
          "schema": "public",
          "table": "people",
          "column": "indiv_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "people",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "last_modified": {
          "schema": "public",
          "table": "people",
          "column": "last_modified",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "last_name": {
          "schema": "public",
          "table": "people",
          "column": "last_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "lgbtqia": {
          "schema": "public",
          "table": "people",
          "column": "lgbtqia",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "middle_name": {
          "schema": "public",
          "table": "people",
          "column": "middle_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "nickname": {
          "schema": "public",
          "table": "people",
          "column": "nickname",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "other_languages": {
          "schema": "public",
          "table": "people",
          "column": "other_languages",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "primary_languages": {
          "schema": "public",
          "table": "people",
          "column": "primary_languages",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "primary_phone": {
          "schema": "public",
          "table": "people",
          "column": "primary_phone",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "primary_phone_other_info": {
          "schema": "public",
          "table": "people",
          "column": "primary_phone_other_info",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "pronouns": {
          "schema": "public",
          "table": "people",
          "column": "pronouns",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "pronouns_other": {
          "schema": "public",
          "table": "people",
          "column": "pronouns_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "race_ethnicity": {
          "schema": "public",
          "table": "people",
          "column": "race_ethnicity",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "race_ethnicity_other": {
          "schema": "public",
          "table": "people",
          "column": "race_ethnicity_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "secondary_phone": {
          "schema": "public",
          "table": "people",
          "column": "secondary_phone",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "secondary_phone_other_info": {
          "schema": "public",
          "table": "people",
          "column": "secondary_phone_other_info",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "source": {
          "schema": "public",
          "table": "people",
          "column": "source",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "source_other": {
          "schema": "public",
          "table": "people",
          "column": "source_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "tags": {
          "schema": "public",
          "table": "people",
          "column": "tags",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "tc_userid": {
          "schema": "public",
          "table": "people",
          "column": "tc_userid",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "people_educator_early_cultivation": {
      "columns": {
        "assigned_partner": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "assigned_partner",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assigned_partner_override": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "assigned_partner_override",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "discovery_status": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "discovery_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_contact_ages": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "first_contact_ages",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_contact_form_notes": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "first_contact_form_notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_contact_governance_model": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "first_contact_governance_model",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_contact_interests": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "first_contact_interests",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_contact_notes_on_pre_wf_employment": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "first_contact_notes_on_pre_wf_employment",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_contact_wf_employment_status": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "first_contact_wf_employment_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_contact_willingness_to_relocate": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "first_contact_willingness_to_relocate",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "montessori_lead_guide_trainings": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "montessori_lead_guide_trainings",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "notes": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "on_school_board": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "on_school_board",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "one_on_one_scheduling_status": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "one_on_one_scheduling_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "opsguide_checklist": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "opsguide_checklist",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "opsguide_fundraising_opps": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "opsguide_fundraising_opps",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "opsguide_meeting_prefs": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "opsguide_meeting_prefs",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "opsguide_request_pertinent_info": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "opsguide_request_pertinent_info",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "opsguide_support_type_needed": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "opsguide_support_type_needed",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": true
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": true
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": true
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": true
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": true
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": true
            }
          ]
        },
        "person_responsible_for_follow_up": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "person_responsible_for_follow_up",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "personal_email_sent": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "personal_email_sent",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "personal_email_sent_date": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "personal_email_sent_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "routed_to": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "routed_to",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "self_reflection_doc": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "self_reflection_doc",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sendgrid_send_date": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "sendgrid_send_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sendgrid_template_selected": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "sendgrid_template_selected",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "target_city": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "target_city",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "target_geo_combined": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "target_geo_combined",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "target_intl": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "target_intl",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "target_state": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "target_state",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "training_grants": {
          "schema": "public",
          "table": "people_educator_early_cultivation",
          "column": "training_grants",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "people_roles_associations": {
      "columns": {
        "authorizer_id": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "authorizer_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "created_date": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "created_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "currently_active": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "currently_active",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "email_status": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "email_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "end_date": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "end_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "gsuite_roles": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "gsuite_roles",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loan_fund": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "loan_fund",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "role": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "role",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ref_roles",
              "referencedColumns": [
                "value"
              ],
              "isOneToOne": false
            }
          ]
        },
        "role_specific_email": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "role_specific_email",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "start_date": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "start_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "who_initiated_tl_removal": {
          "schema": "public",
          "table": "people_roles_associations",
          "column": "who_initiated_tl_removal",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "people_systems": {
      "columns": {
        "gsuite_roles": {
          "schema": "public",
          "table": "people_systems",
          "column": "gsuite_roles",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "people_systems",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "in_tl_google_grp": {
          "schema": "public",
          "table": "people_systems",
          "column": "in_tl_google_grp",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "in_wf_directory": {
          "schema": "public",
          "table": "people_systems",
          "column": "in_wf_directory",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "people_systems",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "on_connected": {
          "schema": "public",
          "table": "people_systems",
          "column": "on_connected",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "on_natl_website": {
          "schema": "public",
          "table": "people_systems",
          "column": "on_natl_website",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "on_slack": {
          "schema": "public",
          "table": "people_systems",
          "column": "on_slack",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "people_systems",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "who_initiated_tl_removal": {
          "schema": "public",
          "table": "people_systems",
          "column": "who_initiated_tl_removal",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_boolean": {
      "columns": {
        "category": {
          "schema": "public",
          "table": "ref_boolean",
          "column": "category",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "english": {
          "schema": "public",
          "table": "ref_boolean",
          "column": "english",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_boolean",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "spanish": {
          "schema": "public",
          "table": "ref_boolean",
          "column": "spanish",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_certifications": {
      "columns": {
        "admin_training": {
          "schema": "public",
          "table": "ref_certifications",
          "column": "admin_training",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ages": {
          "schema": "public",
          "table": "ref_certifications",
          "column": "ages",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "credential_level": {
          "schema": "public",
          "table": "ref_certifications",
          "column": "credential_level",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_certifications",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "lead_guide_training": {
          "schema": "public",
          "table": "ref_certifications",
          "column": "lead_guide_training",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "synonyms": {
          "schema": "public",
          "table": "ref_certifications",
          "column": "synonyms",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_charter_authorizer_actions": {
      "columns": {
        "action": {
          "schema": "public",
          "table": "ref_charter_authorizer_actions",
          "column": "action",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_charter_authorizer_actions",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_charter_statuses": {
      "columns": {
        "is_archived": {
          "schema": "public",
          "table": "ref_charter_statuses",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "label": {
          "schema": "public",
          "table": "ref_charter_statuses",
          "column": "label",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_charter_statuses",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_educator_statuses": {
      "columns": {
        "is_archived": {
          "schema": "public",
          "table": "ref_educator_statuses",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "kanban_visibility": {
          "schema": "public",
          "table": "ref_educator_statuses",
          "column": "kanban_visibility",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "label": {
          "schema": "public",
          "table": "ref_educator_statuses",
          "column": "label",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "order": {
          "schema": "public",
          "table": "ref_educator_statuses",
          "column": "order",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_educator_statuses",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_event_types": {
      "columns": {
        "is_archived": {
          "schema": "public",
          "table": "ref_event_types",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_event_types",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_gender": {
      "columns": {
        "category": {
          "schema": "public",
          "table": "ref_gender",
          "column": "category",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "english": {
          "schema": "public",
          "table": "ref_gender",
          "column": "english",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_gender",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "spanish": {
          "schema": "public",
          "table": "ref_gender",
          "column": "spanish",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_membership_agreement_versions": {
      "columns": {
        "end_date": {
          "schema": "public",
          "table": "ref_membership_agreement_versions",
          "column": "end_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_membership_agreement_versions",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "start_date": {
          "schema": "public",
          "table": "ref_membership_agreement_versions",
          "column": "start_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "version": {
          "schema": "public",
          "table": "ref_membership_agreement_versions",
          "column": "version",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_membership_statuses": {
      "columns": {
        "is_archived": {
          "schema": "public",
          "table": "ref_membership_statuses",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_membership_statuses",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_planes": {
      "columns": {
        "age_ranges": {
          "schema": "public",
          "table": "ref_planes",
          "column": "age_ranges",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "age_spans": {
          "schema": "public",
          "table": "ref_planes",
          "column": "age_spans",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "credentials": {
          "schema": "public",
          "table": "ref_planes",
          "column": "credentials",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_planes",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "synonyms": {
          "schema": "public",
          "table": "ref_planes",
          "column": "synonyms",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_planes",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_public_funding_sources": {
      "columns": {
        "description": {
          "schema": "public",
          "table": "ref_public_funding_sources",
          "column": "description",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_public_funding_sources",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "planes": {
          "schema": "public",
          "table": "ref_public_funding_sources",
          "column": "planes",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_public_funding_sources",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_race_and_ethnicity": {
      "columns": {
        "category": {
          "schema": "public",
          "table": "ref_race_and_ethnicity",
          "column": "category",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "english": {
          "schema": "public",
          "table": "ref_race_and_ethnicity",
          "column": "english",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "english_short": {
          "schema": "public",
          "table": "ref_race_and_ethnicity",
          "column": "english_short",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_race_and_ethnicity",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "spanish": {
          "schema": "public",
          "table": "ref_race_and_ethnicity",
          "column": "spanish",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_roles": {
      "columns": {
        "contexts": {
          "schema": "public",
          "table": "ref_roles",
          "column": "contexts",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_roles",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "show_in_educator_grid": {
          "schema": "public",
          "table": "ref_roles",
          "column": "show_in_educator_grid",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_roles",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "value_long": {
          "schema": "public",
          "table": "ref_roles",
          "column": "value_long",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_school_years": {
      "columns": {
        "end_date": {
          "schema": "public",
          "table": "ref_school_years",
          "column": "end_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ending_calendar_year": {
          "schema": "public",
          "table": "ref_school_years",
          "column": "ending_calendar_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "fiscal_year": {
          "schema": "public",
          "table": "ref_school_years",
          "column": "fiscal_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ref_school_years",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "start_date": {
          "schema": "public",
          "table": "ref_school_years",
          "column": "start_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "starting_calendar_year": {
          "schema": "public",
          "table": "ref_school_years",
          "column": "starting_calendar_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_school_years",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ref_stage_statuses": {
      "columns": {
        "is_archived": {
          "schema": "public",
          "table": "ref_stage_statuses",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "kanban_visibility": {
          "schema": "public",
          "table": "ref_stage_statuses",
          "column": "kanban_visibility",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "label": {
          "schema": "public",
          "table": "ref_stage_statuses",
          "column": "label",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "order": {
          "schema": "public",
          "table": "ref_stage_statuses",
          "column": "order",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "value": {
          "schema": "public",
          "table": "ref_stage_statuses",
          "column": "value",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "school_reports_and_submissions": {
      "columns": {
        "attachments": {
          "schema": "public",
          "table": "school_reports_and_submissions",
          "column": "attachments",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "school_reports_and_submissions",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "id": {
          "schema": "public",
          "table": "school_reports_and_submissions",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "school_reports_and_submissions",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "report_type": {
          "schema": "public",
          "table": "school_reports_and_submissions",
          "column": "report_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_year": {
          "schema": "public",
          "table": "school_reports_and_submissions",
          "column": "school_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "ref_school_years",
              "referencedColumns": [
                "value"
              ],
              "isOneToOne": false
            }
          ]
        }
      }
    },
    "school_ssj_data": {
      "columns": {
        "building4good_firm_and_attorney": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "building4good_firm_and_attorney",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "entered_planning_date": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "entered_planning_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "entered_startup_date": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "entered_startup_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "entered_visioning_date": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "entered_visioning_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "logo_designer": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "logo_designer",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "name_selection_proposal": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "name_selection_proposal",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_id": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": [
            {
              "relation": "details_schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": true
            },
            {
              "relation": "grid_school",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": true
            },
            {
              "relation": "schools",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": true
            }
          ]
        },
        "ssj_advice_givers_partners": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_advice_givers_partners",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_advice_givers_tls": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_advice_givers_tls",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_amount_raised": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_amount_raised",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_board_development": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_board_development",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_budget_ready_for_next_steps": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_budget_ready_for_next_steps",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_building4good_status": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_building4good_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_date_shared_with_n4g": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_date_shared_with_n4g",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_facility": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_facility",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_fundraising_narrative": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_fundraising_narrative",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_gap_in_funding": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_gap_in_funding",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_has_partner": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_has_partner",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_loan_approved_amt": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_loan_approved_amt",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_loan_eligibility": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_loan_eligibility",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_name_reserved": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_name_reserved",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_on_track_for_enrollment": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_on_track_for_enrollment",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_ops_guide_support_track": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_ops_guide_support_track",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_pathway_to_funding": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_pathway_to_funding",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_proj_open_school_year": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_proj_open_school_year",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_readiness_to_open_rating": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_readiness_to_open_rating",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_seeking_wf_funding": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_seeking_wf_funding",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_stage": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_stage",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_target_city": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_target_city",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_target_state": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_target_state",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_tool": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_tool",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ssj_total_startup_funding_needed": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "ssj_total_startup_funding_needed",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "trademark_filed": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "trademark_filed",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "visioning_album": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "visioning_album",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "visioning_album_complete": {
          "schema": "public",
          "table": "school_ssj_data",
          "column": "visioning_album_complete",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "schools": {
      "columns": {
        "about": {
          "schema": "public",
          "table": "schools",
          "column": "about",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "about_spanish": {
          "schema": "public",
          "table": "schools",
          "column": "about_spanish",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "admissions_system": {
          "schema": "public",
          "table": "schools",
          "column": "admissions_system",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ages_served": {
          "schema": "public",
          "table": "schools",
          "column": "ages_served",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "automation_notes": {
          "schema": "public",
          "table": "schools",
          "column": "automation_notes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "bill_account": {
          "schema": "public",
          "table": "schools",
          "column": "bill_account",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "bookkeeper_or_accountant": {
          "schema": "public",
          "table": "schools",
          "column": "bookkeeper_or_accountant",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "budget_link": {
          "schema": "public",
          "table": "schools",
          "column": "budget_link",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "budget_utility": {
          "schema": "public",
          "table": "schools",
          "column": "budget_utility",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "business_insurance": {
          "schema": "public",
          "table": "schools",
          "column": "business_insurance",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_id": {
          "schema": "public",
          "table": "schools",
          "column": "charter_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "details_charters",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_charter",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "created": {
          "schema": "public",
          "table": "schools",
          "column": "created",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created_by": {
          "schema": "public",
          "table": "schools",
          "column": "created_by",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "current_fy_end": {
          "schema": "public",
          "table": "schools",
          "column": "current_fy_end",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "domain_name": {
          "schema": "public",
          "table": "schools",
          "column": "domain_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ein": {
          "schema": "public",
          "table": "schools",
          "column": "ein",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "email_domain": {
          "schema": "public",
          "table": "schools",
          "column": "email_domain",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "enrollment_at_full_capacity": {
          "schema": "public",
          "table": "schools",
          "column": "enrollment_at_full_capacity",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "facebook": {
          "schema": "public",
          "table": "schools",
          "column": "facebook",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "flexible_tuition_model": {
          "schema": "public",
          "table": "schools",
          "column": "flexible_tuition_model",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "founding_tls": {
          "schema": "public",
          "table": "schools",
          "column": "founding_tls",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "google_voice": {
          "schema": "public",
          "table": "schools",
          "column": "google_voice",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "google_workspace_org_unit_path": {
          "schema": "public",
          "table": "schools",
          "column": "google_workspace_org_unit_path",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "governance_model": {
          "schema": "public",
          "table": "schools",
          "column": "governance_model",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "guidestar_listing_requested": {
          "schema": "public",
          "table": "schools",
          "column": "guidestar_listing_requested",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "gusto": {
          "schema": "public",
          "table": "schools",
          "column": "gusto",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "hero_image_2_url": {
          "schema": "public",
          "table": "schools",
          "column": "hero_image_2_url",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "hero_image_url": {
          "schema": "public",
          "table": "schools",
          "column": "hero_image_url",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "schools",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "incorporation_date": {
          "schema": "public",
          "table": "schools",
          "column": "incorporation_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "instagram": {
          "schema": "public",
          "table": "schools",
          "column": "instagram",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "institutional_partner": {
          "schema": "public",
          "table": "schools",
          "column": "institutional_partner",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "schools",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "last_modified": {
          "schema": "public",
          "table": "schools",
          "column": "last_modified",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "last_modified_by": {
          "schema": "public",
          "table": "schools",
          "column": "last_modified_by",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "legal_name": {
          "schema": "public",
          "table": "schools",
          "column": "legal_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "legal_structure": {
          "schema": "public",
          "table": "schools",
          "column": "legal_structure",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "loan_report_name": {
          "schema": "public",
          "table": "schools",
          "column": "loan_report_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "logo": {
          "schema": "public",
          "table": "schools",
          "column": "logo",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "logo_url": {
          "schema": "public",
          "table": "schools",
          "column": "logo_url",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "long_name": {
          "schema": "public",
          "table": "schools",
          "column": "long_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "membership_termination_steps": {
          "schema": "public",
          "table": "schools",
          "column": "membership_termination_steps",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "narrative": {
          "schema": "public",
          "table": "schools",
          "column": "narrative",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "nondiscrimination_policy_on_application": {
          "schema": "public",
          "table": "schools",
          "column": "nondiscrimination_policy_on_application",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "nondiscrimination_policy_on_website": {
          "schema": "public",
          "table": "schools",
          "column": "nondiscrimination_policy_on_website",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "nonprofit_status": {
          "schema": "public",
          "table": "schools",
          "column": "nonprofit_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "number_of_classrooms": {
          "schema": "public",
          "table": "schools",
          "column": "number_of_classrooms",
          "baseType": "number",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "schools",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "on_national_website": {
          "schema": "public",
          "table": "schools",
          "column": "on_national_website",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "open_date": {
          "schema": "public",
          "table": "schools",
          "column": "open_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "planning_album": {
          "schema": "public",
          "table": "schools",
          "column": "planning_album",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "pod": {
          "schema": "public",
          "table": "schools",
          "column": "pod",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "primary_contact_id": {
          "schema": "public",
          "table": "schools",
          "column": "primary_contact_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "prior_names": {
          "schema": "public",
          "table": "schools",
          "column": "prior_names",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "program_focus": {
          "schema": "public",
          "table": "schools",
          "column": "program_focus",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "public_funding": {
          "schema": "public",
          "table": "schools",
          "column": "public_funding",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "qbo": {
          "schema": "public",
          "table": "schools",
          "column": "qbo",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "qbo_school_codes": {
          "schema": "public",
          "table": "schools",
          "column": "qbo_school_codes",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "risk_factors": {
          "schema": "public",
          "table": "schools",
          "column": "risk_factors",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_calendar": {
          "schema": "public",
          "table": "schools",
          "column": "school_calendar",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_email": {
          "schema": "public",
          "table": "schools",
          "column": "school_email",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_phone": {
          "schema": "public",
          "table": "schools",
          "column": "school_phone",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "school_sched": {
          "schema": "public",
          "table": "schools",
          "column": "school_sched",
          "baseType": "string",
          "isArray": true,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "short_name": {
          "schema": "public",
          "table": "schools",
          "column": "short_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "status": {
          "schema": "public",
          "table": "schools",
          "column": "status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "tc_admissions": {
          "schema": "public",
          "table": "schools",
          "column": "tc_admissions",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "tc_recordkeeping": {
          "schema": "public",
          "table": "schools",
          "column": "tc_recordkeeping",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "tc_school_id": {
          "schema": "public",
          "table": "schools",
          "column": "tc_school_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "transparent_classroom": {
          "schema": "public",
          "table": "schools",
          "column": "transparent_classroom",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "watchlist": {
          "schema": "public",
          "table": "schools",
          "column": "watchlist",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "website": {
          "schema": "public",
          "table": "schools",
          "column": "website",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "website_tool": {
          "schema": "public",
          "table": "schools",
          "column": "website_tool",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    },
    "sources": {
      "columns": {
        "is_archived": {
          "schema": "public",
          "table": "sources",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "ref_sources": {
          "schema": "public",
          "table": "sources",
          "column": "ref_sources",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        }
      }
    },
    "ssj_fillout_forms": {
      "columns": {
        "age_targets": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "age_targets",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "assigned_partner_override": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "assigned_partner_override",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "cert_processing_status": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "cert_processing_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "charter_interest": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "charter_interest",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "city": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "city",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "city_standardized": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "city_standardized",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "city2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "city2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "community_desc": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "community_desc",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "community_member_interest": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "community_member_interest",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "community_member_self_description": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "community_member_self_description",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "contact_type": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "contact_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "country": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "country",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "country2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "country2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "created_date": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "created_date",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "current_income": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "current_income",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "currently_montessori_certified": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "currently_montessori_certified",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "currently_seeking_mont_cert": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "currently_seeking_mont_cert",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "educator_interests": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "educator_interests",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "educator_interests_other": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "educator_interests_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "email": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "email",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "email_1": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "email_1",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "email_sent_by_initial_outreacher": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "email_sent_by_initial_outreacher",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "first_name": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "first_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "follow_upper": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "follow_upper",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "form_type": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "form_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "full_name": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "full_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "gender": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "gender",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "gender_other": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "gender_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "id": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "id",
          "baseType": "string",
          "isArray": false,
          "isNullable": false,
          "enumRef": null,
          "references": []
        },
        "initial_outreacher": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "initial_outreacher",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "is_archived": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "is_archived",
          "baseType": "boolean",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "language_primary": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "language_primary",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "language_primary_other": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "language_primary_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "last_name": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "last_name",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "lgbtqia": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "lgbtqia",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Link to Start a School": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Link to Start a School",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "message": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "message",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "mont_cert_question": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "mont_cert_question",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Certifier 1": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Certifier 1",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Certifier 2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Certifier 2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Certifier 3": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Certifier 3",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Certifier 4": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Certifier 4",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Level 1": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Level 1",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Level 2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Level 2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Level 3": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Level 3",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Level 4": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Level 4",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Year 1": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Year 1",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Year 2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Year 2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Year 3": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Year 3",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Montessori Certification Year 4": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Montessori Certification Year 4",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "old_id": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "old_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "one_on_one_status": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "one_on_one_status",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "people_id": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "people_id",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": [
            {
              "relation": "details_educators",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "grid_educator",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_complete_summary",
              "referencedColumns": [
                "people_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "mont_certs_in_process_summary",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "people",
              "referencedColumns": [
                "id"
              ],
              "isOneToOne": false
            },
            {
              "relation": "select_teacher",
              "referencedColumns": [
                "person_id"
              ],
              "isOneToOne": false
            }
          ]
        },
        "pronouns": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "pronouns",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "pronouns_other": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "pronouns_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "race_ethnicity": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "race_ethnicity",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "race_ethnicity_other": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "race_ethnicity_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "routed_to": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "routed_to",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sendgrid_date_sent": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "sendgrid_date_sent",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "sendgrid_template": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "sendgrid_template",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "source_campaign": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "source_campaign",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "source_detail": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "source_detail",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "source_other": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "source_other",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "source_type": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "source_type",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "state": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "state",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "state_abbrev": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "state_abbrev",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "state2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "state2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "target_geo": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "target_geo",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Cert 1": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Cert 1",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Cert 2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Cert 2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Cert 3": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Cert 3",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Cert 4": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Cert 4",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Level 1": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Level 1",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Level 2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Level 2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Level 3": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Level 3",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Level 4": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Level 4",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Year 1": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Year 1",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Year 2": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Year 2",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Year 3": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Year 3",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "Temp - M Cert Year 4": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "Temp - M Cert Year 4",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "want_communications": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "want_communications",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        },
        "want_helping_sourcing_teachers": {
          "schema": "public",
          "table": "ssj_fillout_forms",
          "column": "want_helping_sourcing_teachers",
          "baseType": "string",
          "isArray": false,
          "isNullable": true,
          "enumRef": null,
          "references": []
        }
      }
    }
  }
} as const;

export type SchemaMetadata = typeof schemaMetadata;
export type ColumnMetadata = {
  schema: string;
  table: string;
  column: string;
  baseType: string;
  isArray: boolean;
  isNullable: boolean;
  enumRef: { schema: string; name: string } | null;
  references: Array<{ relation: string; referencedColumns: string[]; isOneToOne: boolean; schema?: string }>;
};
