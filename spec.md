# Wildflower TLs & Schools — Product Specification

This document describes the desired behavior and user experience for a rebuilt version of the Wildflower TLs & Schools application.
It is intended to guide an agent in designing a clean implementation while preserving Airtable as the source of truth for data.

## Purpose

Provide a streamlined tool for Wildflower staff to manage educators ("Teacher Leaders"), schools, charter organizations,
and loan programs. The app should centralize information, make it easy to update records, and surface relationships between
different entities. Optional modules may sync Gmail and Google Calendar data to aid communication tracking.

## Core Data Entities

All core entities live in Airtable. The rebuilt app must read from and write to Airtable so that it remains the canonical
database.

- **Educators/Teacher Leaders**: personal details, contact info, school assignment, notes, related loans.
- **Schools**: name, location, charter affiliation, associated educators, logos, and documents.
- **Charter Organizations**: umbrella entities that manage one or more schools.
- **Loans**: application data, covenants, payments, documents, templates, and generated outputs.
- **Notes & Attachments**: supplemental information tied to educators, schools, or loans.

## Authentication & Access

- Login via Google; only `@wildflowerschools.org` accounts are permitted.
- After authentication, users land on the most recently visited page or a default list view.
- The header shows the signed‑in email, a settings link, and a sign‑out option.
- A global **“My records”** toggle filters list pages to items associated with the current user.

## Navigation Overview

Primary navigation tabs surface the main modules:

1. Educators
2. Schools
3. Charters
4. Loans
5. Google Sync (optional)
6. Settings

### Header Requirements

- Persistent across pages.
- Displays app name, navigation tabs, signed‑in email, and the “My records” toggle.
- Dropdown menu for Settings and Sign out.

## Page Specifications

### 1. Login

- Presents a Google sign‑in button.
- Redirects to the last attempted page after successful login.
- Shows a friendly error if the user is outside the allowed domain.

### 2. Password Reset

- Receives a recovery token (e.g., from email).
- Form to choose a new password.
- Redirects back to the login page once completed.

### 3. Educators Module

#### List Page
- Table layout supporting column sorting and type‑ahead filtering.
- Search field per column.
- “Add New” opens a creation form or modal.
- Clicking a row opens the detail page.

#### Detail Page
- Shows core fields (name, contact, status, associated school).
- Sections for notes, documents, and related loans.
- Inline edit controls; saving pushes changes to Airtable.
- History or activity log (if available from Airtable).

### 4. Schools Module

#### List Page
- Similar table interface as Educators.
- Columns include school name, location, charter, and count of educators.

#### Detail Page
- Displays school information, associated charter, educators, and uploaded logo.
- Allows editing of details and relationships.
- Supports attaching documents or images.

### 5. Charters Module

#### List Page
- Table of charter organizations with name and region.

#### Detail Page
- Shows charter information and the schools operating under it.
- Editing capabilities mirror other modules.

### 6. Loans Module

#### List Page
- Table of loans with filters by status, type, educator, or school.
- “Add New” starts a loan creation wizard capturing essential metadata.

#### Detail Page
- Multi‑section layout:
  - **Application**: borrower info, requested amount, status.
  - **Covenants**: compliance items and tracking.
  - **Payments**: schedule and recorded payments.
  - **Documents**: upload and view related files; generate documents from templates.
  - **Committee Reviews**: record review notes and decisions.
- Editing any section updates Airtable.

### 7. Google Sync Dashboard (Optional)

- Lists users who have opted into Gmail or Calendar syncing.
- Shows progress indicators and recent sync logs.
- Buttons to start, stop, or retry sync operations.
- Data for this module may live outside Airtable, but Airtable records should link to any relevant account info.

### 8. Settings Page

- Displays user email and profile info.
- Option to send a password reset email.
- Links to documentation or help resources.

### 9. Error & Fallback Pages

- Unauthenticated users are redirected to the Login page.
- A generic error state handles unexpected failures with a retry option.
- 404 page for unknown routes.

## Non‑Functional Considerations

- **Airtable Integrity**: all create, update, and delete operations must reflect in Airtable and maintain relationships between tables.
- **Performance**: list pages should handle large data sets efficiently (e.g., through pagination or virtualized rendering).
- **Accessibility**: pages and controls should follow basic accessibility practices (semantic headings, labels, keyboard navigation).
- **Responsiveness**: layouts adapt to various screen sizes, prioritizing desktop but functioning on tablets and phones.

## Future Enhancements (Optional)

- Extended analytics or dashboards built from Airtable data.
- Full Gmail/Calendar ingestion with search and labeling features.
- Role‑based permissions beyond the current “staff” assumption.

