import { ACTION_STEPS_FIELDS as ASF } from "@shared/airtable-schema";
import type { ActionStep } from "@shared/schema";
import { createdAt, updatedAt } from "./util";

export function transformActionStepRecord(record: any): ActionStep {
  const f = record.fields;
  const status = String(f[ASF.Status] || '');
  return {
    id: record.id,
    charterId: String(f[ASF.charter_id] || ''),
    description: String(f[ASF.Item] || ''),
    assignee: String(f[ASF.Assignee_Short_Name] || ''),
    dueDate: String(f[ASF.Due_date] || ''),
    completedDate: String(f[ASF.Completed_date] || ''),
    status,
    complete: status.toLowerCase() === 'complete' || status.toLowerCase() === 'completed' || status.toLowerCase() === 'done',
    created: createdAt(f),
    lastModified: updatedAt(f),
  };
}

