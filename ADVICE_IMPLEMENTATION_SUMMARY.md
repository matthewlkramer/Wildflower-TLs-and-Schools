# Advice System Implementation Summary

## Overview
Implemented a comprehensive advice/feedback system for schools in the SSJ (School Startup Journey) process, allowing Wildflower to manage Visioning and Planning advice panels.

## What Was Implemented

### 1. Updated Schema
- Regenerated schema using `npm run gen:all` to pull latest `advice` table structure
- Confirmed fields:
  - `stage` ('Visioning' | 'Planning')
  - `advice_giver_people_id`, `advice_giver_guide_id`
  - `advice_requested_date`, `advice_given_date`, `advice_loop_closed_date`
  - `advice_text`, `advice_docs_object_ids`, `advice_docs_public_urls`
  - `advice_submitted`, `advice_loop_closed`
  - `response_to_advice`, `loop_closing_object_ids`, `loop_closing_public_urls`
- School SSJ data fields: `visioning_advice_loop_status`, `planning_advice_loop_status`

### 2. Updated List Preset Configuration
**File:** `client-new/src/shared/config/table-list-presets.ts`

Updated the `advice` preset to include:
- All relevant fields for display (stage, givers, dates, advice, responses, documents)
- Field layout configuration (title, subtitle, body)
- 6 table actions:
  - `initiateVisioningAdvice`
  - `concludeVisioningAdvice`
  - `reopenVisioningAdvice`
  - `initiatePlanningAdvice`
  - `concludePlanningAdvice`
  - `reopenPlanningAdvice`

### 3. Created InitiateAdviceModal Component
**File:** `client-new/src/shared/components/InitiateAdviceModal.tsx`

Features:
- Multi-select checkboxes for TL members (from `people` table where `is_archived = false`)
- Multi-select checkboxes for Partner members (from `guides` table where `is_active = true` and `is_archived = false`)
- Creates one advice record per selected person/guide
- Sets `advice_requested_date` to today
- Updates `school_ssj_data.visioning_advice_loop_status` or `planning_advice_loop_status` to 'Open'
- Shows selection counts
- Placeholder for email notifications (TODO: requires Supabase Edge Function)

### 4. Created ConcludeAdviceModal Component
**File:** `client-new/src/shared/components/ConcludeAdviceModal.tsx`

Features:
- Lists all advice panel members with their status (submitted, loop closed)
- Shows dates for requested, given, and loop closed
- Per-advisor actions:
  - **Enter/Upload Advice**: Opens sub-modal to input advice text (future: add file upload)
  - **Enter/Upload Response**: Opens sub-modal to input response text (future: add file upload)
  - **View Details**: Shows full advice and response with document links
  - **Close Loop**: Marks advice loop as closed with today's date
  - **Reopen Loop**: Allows reopening a closed advice loop
- Final "Proceed" button:
  - Warns if not all loops are closed
  - Sets `school_ssj_data` status to 'Complete'

### 5. Integrated Modals into DetailsRenderer
**File:** `client-new/src/shared/components/DetailsRenderer.tsx`

Changes:
- Added imports for `InitiateAdviceModal` and `ConcludeAdviceModal`
- Added state management in `ListBlockRenderer`: `showAdviceModal`
- Implemented `handleTableAction` to route the 6 table actions
- Implemented `handleReopenAdvice` for direct reopen actions (with confirmation)
- Rendered modals conditionally based on `showAdviceModal` state
- Modals refresh list data on success

### 6. Advice List Display
**Already configured in:** `client-new/src/features/schools/views.ts`

- Advice list container appears on line 128 (SSJ tab) and line 152 (Ops Guide tab)
- Displays advice cards with all configured fields
- Action dropdown appears in upper right with 6 options

## What Still Needs Implementation (Future Enhancements)

### 1. Public Advice Submission Page
**Description:** A public page (no login required) where advice panel members can submit their advice via a unique link.

**Requirements:**
- Generate unique token/link per advice record
- Page accessible at `/advice/submit/:token`
- Shows school name, stage, advisor name, requested date
- Large textarea for advice text
- File upload for advice documents (storage.objects bucket='Advice')
- "Save" (draft) and "Submit" buttons
- Save: Updates `advice_text` and documents but keeps `advice_submitted = false`
- Submit: Sets `advice_submitted = true`, `advice_given_date = today`
- Send email notification to school TLs when advice is submitted
- Show "already submitted" message if user returns after submission

### 2. Email Notifications
**Description:** Automated emails sent at key points in the advice process.

**Required Emails:**
1. **Advice Request Email** (when advice is initiated):
   - To: Each panel member
   - Subject: "Advice Request for [School Name]"
   - Body: Thank you message + unique submission link

2. **Advice Submitted Email** (when advisor submits):
   - To: Current TLs at the school (via `primary_emails`)
   - Subject: "Advice Received from [Advisor Name]"
   - Body: Include advice text + links to documents

**Implementation:** Requires Supabase Edge Function to send emails via central mail service

### 3. File Upload for Advice Documents
**Description:** Allow uploading files to `storage.objects` bucket and storing IDs/URLs

**Required Changes:**
- Add file input fields to modals
- Upload to `storage.objects` with `bucket_id = 'Advice'`
- Store object IDs in `advice_docs_object_ids` (uuid[])
- Store public URLs in `advice_docs_public_urls` (text[])
- Same for response documents: `loop_closing_object_ids`, `loop_closing_public_urls`

### 4. Abandon Advice Actions
**Description:** Allow abandoning advice process (sets status to 'Abandoned')

**Changes needed:**
- Add "Abandon Visioning Advice" and "Abandon Planning Advice" to table actions
- On abandon:
  - Set `school_ssj_data.[stage]_advice_loop_status = 'Abandoned'`
  - Set `school_ssj_data.ssj_stage = 'Paused'`
  - Set `schools.status = 'Paused'`

## Testing Checklist

- [ ] Navigate to Schools → [Any School] → SSJ tab
- [ ] Verify advice list container displays
- [ ] Click action dropdown shows 6 options
- [ ] Click "Initiate Visioning Advice" opens modal with TL/Partner selections
- [ ] Select panel members and initiate - creates advice records
- [ ] Verify `visioning_advice_loop_status` set to 'Open' in database
- [ ] Click "Conclude Visioning Advice" shows all panel members with status
- [ ] Test entering advice text via sub-modal
- [ ] Test entering response text via sub-modal
- [ ] Test viewing details shows advice + response
- [ ] Test closing loop marks as closed with date
- [ ] Test reopening loop removes closed status
- [ ] Test proceeding when all closed sets status to 'Complete'
- [ ] Test "Reopen Visioning Advice" confirms and sets status back to 'Open'
- [ ] Repeat all tests for Planning Advice

## Files Modified

1. `client-new/src/shared/config/table-list-presets.ts` - Added table actions and fields
2. `client-new/src/shared/components/DetailsRenderer.tsx` - Integrated modals and handlers

## Files Created

1. `client-new/src/shared/components/InitiateAdviceModal.tsx`
2. `client-new/src/shared/components/ConcludeAdviceModal.tsx`

## Database Tables Used

- `advice` - Main advice records
- `school_ssj_data` - Status tracking
- `people` - TL panel members
- `guides` - Partner panel members
- `schools` - School information

## Notes

- The modals use React Portal (`createPortal`) to render at document.body level
- All modals use the shared dialog system (`useDialog`) for confirmations
- File uploads are placeholder - commented as TODO
- Email notifications are placeholder - commented as TODO
- The system is fully functional for manual advice tracking without the public submission page
