// Centralized Kanban configuration
//
// How to use:
// - Fill the arrays below in the exact order you want columns to appear.
// - Use the literal string "Unspecified" to control where empty/null values show.
// - Leave an array empty to fall back to whatever values exist in the data (order by first seen).

export const KANBAN_UNSPECIFIED_KEY = "__UNSPECIFIED__";

// Teachers (Educators.Kanban)
export const TEACHERS_KANBAN_ORDER: string[] = [
  "No inquiry received",
  "Inquiry received",
  "Partner assigned",
  "Outreach sent",
  "1:1 scheduled",
  "1:1 completed",
  "Discovery in process",
  "Discovery complete",
  "Visioning",
  "Planning",
  "Startup",
  "Year 1",
  "Open",
  "Paused"
];

// Optionally list labels that should start collapsed (match labels in the order array or live data).
export const TEACHERS_KANBAN_COLLAPSED: string[] = [
  "Paused"
];

// Schools (School.stageStatus)
export const SCHOOLS_KANBAN_ORDER: string[] = [
  "Visioning",
  "Planning",
  "Startup",
  "Year 1",
  "Open",
  "Disaffiliating",
  "Disaffiliated",
  "Permanently closed",
  "Paused"
];

export const SCHOOLS_KANBAN_COLLAPSED: string[] = [
  "Disaffiliated",
  "Permanently closed",
  "Paused"// e.g., "Closed", "Unspecified"
];

// Charters (Charter.status)
export const CHARTERS_KANBAN_ORDER: string[] = [
  "Awaiting start of cohort",
  "Applying",
  "Application Submitted - Waiting",
  "Approved - Year 0",
  "Open",
  "Paused"
];

export const CHARTERS_KANBAN_COLLAPSED: string[] = [
  "Paused"
];

// Utility to turn a preferred order + discovered keys into the final column list.
// - Accepts the literal label "Unspecified" and maps it to the sentinel key.
// - Ensures unspecified appears last if not explicitly ordered.
export function buildKanbanColumns(order: string[], keys: string[]) {
  const LABEL_UNSPECIFIED = "Unspecified";
  const mapInputToKey = (v: string) => (v === LABEL_UNSPECIFIED ? KANBAN_UNSPECIFIED_KEY : v);
  const mapKeyToLabel = (k: string) => (k === KANBAN_UNSPECIFIED_KEY ? LABEL_UNSPECIFIED : k);

  const discovered = new Set(keys);
  const seen = new Set<string>();

  const preferred = (order && order.length ? order : [])
    .map(mapInputToKey)
    .filter((k) => {
      // Always include explicitly ordered columns, even if no items yet
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

  // Any keys not in preferred list get appended, except we add Unspecified last
  const extras: string[] = [];
  let hasUnspecified = false;
  for (const k of discovered) {
    if (seen.has(k)) continue;
    if (k === KANBAN_UNSPECIFIED_KEY) {
      hasUnspecified = true;
      continue;
    }
    extras.push(k);
  }

  const includesUnspecified = preferred.includes(KANBAN_UNSPECIFIED_KEY) || hasUnspecified;
  const finalKeys = [...preferred, ...extras, ...(includesUnspecified && !preferred.includes(KANBAN_UNSPECIFIED_KEY) ? [KANBAN_UNSPECIFIED_KEY] : [])];

  return finalKeys.map((k) => ({ key: k, label: mapKeyToLabel(k) }));
}

// Map human labels to internal keys (handles Unspecified sentinel)
export function labelsToKeys(labels: string[]) {
  const LABEL_UNSPECIFIED = "Unspecified";
  return (labels || []).map((v) => (v === LABEL_UNSPECIFIED ? KANBAN_UNSPECIFIED_KEY : v));
}
