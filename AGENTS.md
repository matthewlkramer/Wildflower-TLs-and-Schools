# Wildflower TLs & Schools — Agents Guide

This document orients contributors and automation/AI agents to work safely and effectively in this codebase.

## Overview

- Stack: React + Vite (client), Express (server), Airtable (primary data), Supabase (Auth + Google sync storage + Edge Functions).
- Purpose: End-to-end management of teachers/educators, schools, charters, and loans with Airtable as the system of record. Optional per-user Gmail/Calendar sync in Supabase.

## Architecture

- `client/`: React app served via Vite in development and built into `dist/public` for production.
- `server/`: Express server providing REST API for Airtable-backed entities and serving the client app.
- `shared/`: Type definitions and constants shared across server/client.
- `supabase/`: CLI config, SQL migrations, and Edge Functions for `gmail-sync` and `gcal-sync`.
- `google/`: Original Google Sync dashboard source (mirrored under `client/src/components/google`).
- `scripts/`: Node utility scripts (e.g., seeding email filter addresses into Supabase).

## Directory Map (selected)

- `client/src/pages/login.tsx`: Google SSO login page.
- `client/src/pages/reset.tsx`: Password reset page (Supabase recovery token flow).
- `client/src/pages/google-sync.tsx`: Renders the Google Sync dashboard (optional module).
- `client/src/components/google/GoogleSyncDashboard.tsx`: In-app dashboard UI for Gmail/Calendar sync.
- `client/src/components/header.tsx`: Global header; shows user email and Sign out.
- `client/src/contexts/auth-context.tsx`: Supabase Auth provider; enforces `@wildflowerschools.org` domain.
- `server/index.ts`, `server/routes.ts`, `server/vite.ts`: Express setup and API routes.
- `server/cache.ts`, `server/logger.ts`: Request logging and in-memory caching for snappy reads.
- `shared/schema.ts`: Types for Airtable entities and legacy mappings.
- `supabase/migrations/0001_init.sql`: Tables for tokens, progress, logs, emails, and events.
- `supabase/functions/gmail-sync`, `supabase/functions/gcal-sync`: Edge Functions for OAuth + sync control.
- `scripts/sync-email-filter-to-supabase.ts`: Populate `email_filter_addresses` from Airtable.

## Local Development

- Requirements: Node 18+, pnpm/npm, Supabase CLI (via `npx supabase`).
- Run dev server: `npm run dev` (Express + Vite middleware).
- Build: `npm run build` (builds client and bundles server into `dist/`).
- Start prod build: `npm run start`.

## Environments & Secrets

Client (`.env.local`):
- `VITE_SUPABASE_URL` — Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key.

Server/scripts (`.env`):
- Airtable creds already used by the server storage layer.
- `SUPABASE_URL` — used by scripts.
- `SUPABASE_SERVICE_ROLE_KEY` — used by scripts (do not expose to client).

Supabase Edge Functions (set via CLI secrets):
- Auto-injected: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (from the project; do not set via CLI).
- Set via CLI: `SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.

CLI secrets:
- `npx supabase secrets set SERVICE_ROLE_KEY=... GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... GOOGLE_REDIRECT_URI=...`
- Note: the CLI rejects names starting with `SUPABASE_`.

## Authentication

- Supabase Auth with Google SSO; login at `/login`.
- Domain restriction: only `@wildflowerschools.org` accounts are allowed; others are signed out.
- Global route guard: unauthenticated users are redirected to `/login` (except `/reset`).
- Header shows the signed-in email with a dropdown (Settings, Sign out).
- Password reset flow:
  - Settings → “Send password reset email” → link opens `/reset`.
  - `/reset` consumes recovery tokens from the URL hash, lets user set a new password, then redirects to `/login`.

## Core App (Teachers, Schools, Charters, Loans)

- Lists:
  - Teachers/Educators, Schools, Charters pages render ag‑grid tables with sorting and header type‑ahead search.
  - “My records” toggle (header) scopes data to the current user via `@/contexts/user-filter-context`.
  - “Add New” triggers creation modals or navigates to create forms depending on section.
- Detail Views:
  - Show core fields, related data (e.g., educator↔school associations), and notes.
  - Edit actions call server `/api/...` endpoints; server invalidates caches; client updates React Query caches.
- Validation:
  - Server validates payloads with zod schemas derived from `shared/schema.ts` (and `@shared/loan-schema`).
- Loans:
  - Includes applications, payments, documents, covenants, committee reviews, templates, and generated documents (see `server/routes.ts`).

## AG Grid

- Initialization: Centralized in `client/src/lib/ag-grid-enterprise.ts:5` via `initAgGridEnterprise()`; called once at app start in `client/src/App.tsx:74`.
- Community module: Always registers `AllCommunityModule` so community features work everywhere.
- Enterprise modules: Dynamically imported and registered (Set Filter, SideBar, Columns/Filters tool panels, Menu). No per-grid registration needed.
- License: Optional. If `VITE_AG_GRID_LICENSE_KEY` is set, it is applied; without it, enterprise modules still register (useful in dev), but AG Grid may show a watermark.
- Feature flag hook: `client/src/hooks/use-aggrid-features.ts:4` exposes `{ entReady, filterForText }` where `filterForText` resolves to `"agSetColumnFilter"` when enterprise is ready, otherwise `"agTextColumnFilter"`.
- Grid wrapper: Use `client/src/components/shared/GridBase.tsx:14` and defaults from `client/src/components/shared/ag-grid-defaults.ts:3` and `client/src/components/shared/ag-grid-defaults.ts:11` for consistent config (theme, row heights, selection, etc.).
- Theme: We use `themeMaterial` from `ag-grid-community` with `ag-theme-material` container class.
- Typical usage: Set column `filter: filterForText` for text columns; numeric/date columns can still specify explicit filters.
- Common error 200: “SetFilterModule is not registered” occurs if modules aren’t registered before grid mounts. Our init runs in `AppContent` so don’t re‑register in components; just consume `filterForText` or check `entReady`.
- Example column: `{ field: 'name', headerName: 'Name', filter: filterForText }` guards enterprise set filter safely.

## Google Sync

- Edge Functions: `gmail-sync` and `gcal-sync` in `supabase/functions/`.
- Storage schema (Supabase):
  - `google_auth_tokens` — per-user Google OAuth tokens.
  - `google_sync_messages` — log stream consumed by the dashboard.
  - `g_email_sync_progress` — Gmail weekly progress per user.
  - `g_event_sync_progress` — Calendar monthly progress per user/calendar.
  - `g_emails`, `g_events` — normalized storage for messages/events.
  - `email_filter_addresses` — list of addresses to match/allowlist (seeded from Airtable).
- Dashboard: `/google-sync` integrates realtime and polling on the above tables.
- Current state: “start_sync” endpoints update status and logs (safe placeholders). Extend to full ingestion by calling Google APIs and writing into `g_emails`/`g_events`.

## Data Sources

- Airtable: primary system of record for schools/teachers; accessed via `server/simple-storage.ts` and Airtable schema mappings in `shared/`.
- Supabase: auxiliary system for Auth + Gmail/Calendar sync data. Keep it isolated from Airtable content.

## Server APIs & Storage

- Endpoints: see `server/routes.ts` (e.g., `/api/educators`, `/api/schools`, `/api/charters`, loan routes, etc.).
- Storage: `server/simple-storage.ts` maps Airtable records to `shared/schema.ts` types; methods include full CRUD for major entities.
- Caching: `server/cache.ts` memoizes frequently used datasets; routes invalidate relevant cache keys on mutation.

## Common Tasks

- Link to Supabase project: `npm run supabase:link`
- Push DB schema: `npm run supabase:db:push`
- Deploy functions: `npm run supabase:functions:deploy`
- Seed email filter from Airtable: `npm run sync:email-filter`

## Conventions

- Keep changes minimal and focused; avoid unrelated refactors.
- Prefer SQL migrations in `supabase/migrations/` over ad‑hoc schema changes.
- Do not hardcode secrets; use `.env`, client `VITE_*` vars, or Supabase CLI secrets.
- Client-only code must import from `client/src/...` (avoid reaching outside Vite root).
- Use TypeScript across client/server; align types with `shared/` when applicable.

## Deployment

- Build the app: `npm run build` → server at `dist/index.js`, static assets at `dist/public`.
- Run Express in production: `npm run start` (ensure `.env` exists on the host).
- Supabase Functions: deploy with `npx supabase functions deploy gmail-sync gcal-sync` after setting secrets.

## Troubleshooting

- Supabase link error about Postgres version: set the `major_version` in `supabase/config.toml` to match the project and retry `link`/`db push`.
- CLI skips `SUPABASE_*` secrets: expected; use `SERVICE_ROLE_KEY` and let Supabase inject `SUPABASE_URL/ANON_KEY`.
- OAuth redirect errors: ensure Google Console has callback `https://<project>.supabase.co/auth/v1/callback` and Supabase Auth “Site URL/Redirects” include your app’s URL.
- Client 401s to functions: ensure the user is signed in (Supabase JWT) before calling `supabase.functions.invoke`.

## Roadmap Hints (for agents)

- Implement full Gmail ingestion (list → headers → bodies) into `g_emails`; respect `email_filter_addresses`.
- Implement Calendar ingestion into `g_events` with monthly progress updates and sync tokens.
- Extend the dashboard to show per-period progress bars and error drilldowns.
- Add server-side protection using Supabase JWT verification if exposing custom API endpoints.
