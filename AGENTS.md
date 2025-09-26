# Wildflower TLs & Schools – Agents Guide

This document orients contributors and automation/AI agents so they work safely and effectively in the current codebase.

## Overview

- **Stack**: React 18 + Vite (front-end in client-new/), Supabase (Auth, Google sync data + Edge Functions).
- **Purpose**: Manage teachers/educators, schools, charter pipelines, and loans via Supabase.

## Architecture

- client-new/: Primary front-end. Vite app with React Query, AG Grid Enterprise (dynamic registration), shared layout/components, and a growing shared module surface (src/modules/shared).
  - src/modules/*: Feature modules (educators, schools, charters) hold API hooks, constants, pages, and shared helpers.
  - src/modules/shared/detail-types.ts: Canonical typings for grid/detail configs.
  - src/modules/shared/detail-presets.ts: Reusable presets for table actions/columns.
  - src/modules/shared/details-renderer.tsx: Generic renderer powering module detail views (map blocks now embed Google Maps if coordinates/address are present).
- client/: Previous SPA (kept for reference / gradual migration).
- server/: Express API serving Airtable data and legacy UIs.
- supabase/: CLI config, SQL migrations, and Edge Functions (gmail-sync, gcal-sync).
- scripts/: Node utilities (e.g., sync-email-filter-to-supabase.ts).
- google/: Original Google Sync dashboard mirrored from the legacy client (client/).

## Directory Map (selected client-new/ paths)

- src/App.tsx: App shell (initialises AG Grid modules via initAgGridEnterprise).
- src/modules/educators/*: Educator list/detail/Kanban pages, Supabase queries, helper utilities.
- src/modules/schools/*: Schools list/detail/Kanban; mirrors educator module patterns.
- src/modules/charters/*: Charter list/detail/Kanban; tabs described by constants.ts and rendered via the shared renderer.
- src/modules/shared/detail-presets.ts: Shared row/table action presets & column lists (used by all modules).
- src/modules/shared/details-renderer.tsx: Generic detail renderer (cards/tables/maps) that consumes each module's DetailTabSpec.

Legacy locations (still referenced by older flows):
- client/src/...: Old React app + components.
- server/routes.ts: Airtable-backed REST endpoints.

## Local Development

- Requirements: Node 18+, npm, Supabase CLI (
px supabase).
- Front-end dev server: cd client-new && npm run dev (Vite + Supabase auth).
- Typecheck: cd client-new && npm run typecheck (tsc --noEmit).
- Front-end build: cd client-new && npm run build (outputs to dist/).
- Legacy server: 
pm run dev (runs Express + legacy client) – only needed if you still interact with the old client/ UI.

> **Note**: Keep client-new’s tsconfig.json in sync with workspace tooling. The root 
pm run check is no longer wired; run checks inside client-new.

## Environment & Secrets

Client (client-new/.env.local):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_AG_GRID_LICENSE_KEY

Server / legacy scripts (.env):
- Airtable API key, base IDs.
- SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (scripts + functions deployment).

Supabase Edge Functions secrets (via CLI):
- SERVICE_ROLE_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI (Supabase injects SUPABASE_URL / SUPABASE_ANON_KEY).

## Authentication

- Supabase Auth + Google SSO. client-new enforces @wildflowerschools.org via auth context.
- Unauthenticated users redirected to /login; /reset handles password reset tokens.
- Ensure front-end requests include Supabase auth headers where required (e.g., invoking Edge Functions).

## Core Modules (client-new)

- **Educators, Schools, Charters**
  - constants.ts: Declarative grid + detail tab configs. Grids use sortKey to make the column for sorting in table view and kanbanKey to mark the column that powers the Kanban grouping.
  - pi/queries.ts: Supabase-backed data fetch (paginated helper for large views).
  - pages/*: React pages; list pages use GridBase; detail pages use the shared renderer.
  - pages/*KanbanPage.tsx: Generic Kanban board using KanbanBoard + constants-defined grouping.
  - Shared presets (ROW_ACTIONS, TABLE_ACTIONS, TABLE_COLUMNS) keep action arrays consistent without altering feature content.
- **Details Renderer**
  - Cards render inline editing (delegated to module save helpers).
  - Tables fetch up to 200 rows from Supabase (respecting schema/table validators).
  - Map blocks embed Google Maps when lat/lng or address fields are present.

## AG Grid

- Initialisation: client-new/src/lib/ag-grid-enterprise.ts (called in App.tsx).
- Use GridBase + g-grid-defaults.ts for consistent theming/behaviour.
- ilterForText hook toggles enterprise/community filter automatically.
- When adding filters, prefer using shared presets or type-specific settings (e.g., ilter: filterForText).

## Google Sync

- Edge Functions manage OAuth & sync state; Supabase tables (g_emails, g_events) surface data to the UI.
- Front-end modules reuse presets to show Gmail/Calendar tables within detail tabs.
- When extending: handle Supabase auth tokens, respect xclude_from_calendar_logging, and write activity back to Supabase tables.

## Data Sources

- Supabase stores authentication state, Google sync artifacts, authoritative source of data and module-specific denormalised views (details_*, grid_*).

## Common Tasks

- Typecheck front-end: cd client-new && npm run typecheck.
- Run front-end tests (if added): npm run test (configure within client-new).
- Deploy Edge Functions: 
pm run supabase:functions:deploy (set secrets first).
- Sync email filters: 
pm run sync:email-filter (requires .env + Airtable access).

## Conventions & Guidelines

- **Module-first structure**: For new feature work, create/extend modules under client-new/src/modules/* rather than scattering components.
- **Shared presets**: Use detail-presets.ts for repeated action/column arrays; extend it carefully so existing modules retain semantics.
- **Avoid unwanted refactors**: When modifying constants.ts, preserve existing tab ordering/field groupings unless explicitly asked.
- **Testing**: Always run pnpm run typecheck when touching TypeScript-heavy modules. Add unit/integration tests under client-new/src as we expand coverage.
- **Maps**: Map blocks expect [latField, lngField, addressField]. Provide data in Supabase views to enable map previews.

## Deployment

- Front-end build output: client-new/dist/ (serve via Vercel)
- Edge Functions: 
px supabase functions deploy gmail-sync gcal-sync.

## Troubleshooting

- **Typecheck fails with missing tsconfig**: Run pnpm run typecheck inside client-new (root script is deprecated).
- **AG Grid “module not registered” errors**: Ensure initAgGridEnterprise runs before grids mount.
- **Supabase 401**: Confirm auth context has a session; re-login or refresh tokens as needed.
- **Google map block blank**: Ensure Supabase view exposes numeric lat/lng or a non-empty address.

## Roadmap Hints

- Expand Supabase functions for full Gmail/Calendar ingestion and error handling.
- Add module-level tests (React Testing Library + Vitest) once critical flows stabilise.
- Gradually migrate remaining shared utilities from client/ to client-new or client-new/src/modules/shared.
## Recent Updates (2025-09)

- Detail pages now read `action`/`section` query params via `useDetailIntent`, which drives default tab selection and can auto-open inline edit or fire a table row action.
- Main AG Grid list pages share `GridRowActionsCell` for inline edit/view/email/add note/add task/archive shortcuts; archive uses the base tables (`people`, `schools`, `charters`).
- `details-renderer.tsx` handles forced card edit and initial row actions; check `DetailActionPreset` when adding new tables so dropdowns stay in sync.
- Global styling lives in `client-new/src/styles/global.css` (subtle blue/gray theme borrowed from the legacy client).

## Outstanding Follow-ups

- Hook `add_note`/`add_task` from the list dropdown directly into the preset modal/create flow instead of just navigating.
- Migrate remaining charter tables that still rely on `createRowActions(...)` (authorizer actions, governance docs/990s, reports/metrics, grants, loans) to the shared presets so they inherit toggle/archive behaviour.
- Review Supabase mutation targets for archive toggles on grid_* views before enabling for end users.


