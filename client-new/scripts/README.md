# Airtable → Supabase Sync Scripts

This directory contains the `airtable-to-supabase.ts` utility that performs a one-way sync from Airtable into Supabase.

## Setup

1. Copy `airtable-sync.config.example.json` to `airtable-sync.config.json` and edit it so that each entry describes how an Airtable table maps to its Supabase counterpart.
2. Create (or update) `scripts/airtable-sync-state.json` if you want to seed an initial `lastSyncedAt` timestamp. The file will be created automatically after the first successful run.
3. Set the required environment variables before running the script:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID` (or set `baseId` in the config file)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Running the script

Run the sync (inserts new Airtable records into Supabase, prints diffs for modified rows):

```bash
npm run airtable:sync
```

Preview the changes without writing to Supabase or updating the sync state:

```bash
npm run airtable:sync:dry
```

## How it works

- The script fetches Airtable records that changed since the last `lastSyncedAt` timestamp stored in `airtable-sync-state.json` (per Supabase table).
- New Airtable records that do not have a matching Supabase row (based on the configured primary key) are inserted.
- Existing records with differing field values are reported with field-level diffs so you can review them before overwriting Supabase manually.
- After a successful non-dry run, the script updates `airtable-sync-state.json` with the current timestamp.

> **Note:** To capture human-friendly “last modified” timestamps in the diff report, add a formula field in Airtable (e.g. `DATETIME_FORMAT(LAST_MODIFIED_TIME(), 'YYYY-MM-DDTHH:mm:ssZ')`) and reference it via `lastModifiedField` in the config.
