# Wildflower TLs & Schools — Product Specification

This document describes the desired behavior and user experience for a rebuilt version of the Wildflower TLs & Schools application.
It is intended to guide an agent in designing a clean implementation while preserving Airtable as the source of truth for data.

## Purpose

Provide a streamlined tool for Wildflower staff to support educators ("Teacher Leaders"), schools, and charter organizations. The app should centralize information, make it easy to update records, and surface relationships between
different entities. The most important set of users of the app are the school support team that works directly with emerging Teacher Leaders and emerging schools to help them get started, and with schools that are already open as well. The people who work directly with emerging schools are called ops guides.

## Core Data Entities

Most core entities live in Airtable. The rebuilt app must read from and write to Airtable so that it remains the canonical
database.

- **Educators/Teacher Leaders**: personal details, contact info, school assignment, notes, related loans/grants.
- **Schools**: name, location, charter affiliation (if any), associated educators, logos, and governance and tax documents.
- **Charter Organizations**: umbrella entities that manage one or more schools.

Supporting entities, also in airtable.
- **Loans**: application data, covenants, payments, documents, templates, and generated outputs. 
- **Grants**: funding given from the Wildflower Foundation and its partners to schools
- **Notes**: supplemental information tied to educators, schools, or loans.
- **Interactions**: logs of meetings, phone calls, conversations at conferences, etc.
- **Tasks**: to do items associated with educators, schools, charter organizations, loans, grants, etc. - that have assigned dates, due dates, who is responsible for them, and whether they are complete
- **Montessori certifications**: information about an educator's completion of a Montessori training program, including when, the age level for which they trained, the training program and its affiliations
- **Locations**: school addresses, including mailing addresses and physical addresses when different
- **Fillout forms**: inquiries from teachers that came to us online with information about the educator

## One supporting set of data does not need to live in airtable
- **Linked emails and events**: so that any user can see the entire communication record between a Teacher Leader and anyone involved in school support.
- ** This would probably be better to be put in a higher-powered postgres system like supabase

## Authentication & Access

- Login via Google; only `@wildflowerschools.org` accounts are permitted.
- After authentication, users land on their dashboard page.
- The header shows the signed‑in email, a settings link, and a sign‑out option.
- A global **“My records”** toggle filters list pages to items associated with the current user.

## Navigation Overview

Primary navigation tabs surface the main modules:

1. Educators
2. Schools
3. Charters
4. Settings
5. Extension: we may also want to create a full application for the team that issues and manages loans to schools to support their work
 
### Header Requirements

- Persistent across pages.
- Displays app name, navigation tabs, signed‑in email, the “My records” toggle, and a way for the user to get to their own settings.

## Page Specifications

### 1. Login

- Presents a Google sign‑in button.
- Redirects to the last attempted page after successful login, or to a dashboard if there was no recent attempt to login.
- Shows a friendly error if the user is outside the allowed domain.

### 2. List pages for Educators/Schools/Charters
- As noted below, the main navigation tabs should be lists of each of the core entities. Though some details of these pages will differ for each entity, most of the pages should follow the same pattern
- Each main entity page should be visible in 3 ways: a table view, a kanban view, and a combo table/detail view
- Some of the features of table views: all columns should be filterable using a googlesheets-like filter that allows for filtering based on specific values or by ways that are specific to the data type of the column (=/<>/contains/does not contain for text fields, comparisons for numerical fields, before/after/between for dates), all columns should be sortable, there should be a main set of columns that are show by default but a column chooser should let the user change the columns, the columns should be reorderable, sortable, and resizeable; data may be filtered by default upon loading; each row will have actions available specific to that row in the last column of the table; all rows should have checkboxes on the left to allow for multiselect; when multiple rows have been selected, buttons should appear that allow the user to bulk edit, bulk email, and merge documents
- In kanban view, the data will be organized by a specific field for each page type and the individual rows will show up on small cards; there should be a set of drop down filters to filter which records show up on cards; each card should have a three vertical button menu that shows the actions for a record (same as the actions from the end of the row in table view); and cards should be draggable from column to column
- In combo view, the left column of the page should be a filterable/sortable view of the records from the page, and whichever one is selected should have its detailed record view show up to the right, using the same approach for the detailed pages described below
- In all views, any record that is marked as archived should not be shown - as that is the "soft delete" indicator

### 3. Detail pages for Educators/Schools/Charters
- There is a lot of information that needs to be displayed on these so they will need a tabbed or collapsible interface that allow the user to see a managable amount of information at once
- Information should be organized in cards and tables. Every card should have its own edit button for inline editing with save/cancel. Every table should have action buttons including view record, edit inline with save/cancel, delete (archive). Some will have other actions too. The view record for these types of entities/data should be popup modals/forms, not full detail views like we have for educators/schools/charters

### 4. Educators Module

#### List Page
- “Add New” opens a creation form or modal for a new teacher.
- Actions for each row are open detail page for that record, edit record inline, mark inactive, create note, create task, log interaction, delete record (which should mark the record as archived)
- Clicking a row opens the detail page.
- Default columns should be Name, current role/school (which should be populated for any educator that is currently active at a school whether that school is open or not, and should say the name of the school, the educator's role(s), and the stage_status of the school), whether they are montessori certified, their race/ethnicity, the discovery status, and their individual type
- Kanban field is "Kanban"

#### Detail Page
- Shows core fields (name, contact info, status)
- Show Montessori training history
- Show history of association with individual schools. From here, we need to be able to create a new school record that the educator is planning, or link the educator up to an existing school
- Show any online forms that the educator submitted through our website
- Show details of their early cultivation conversations with us, what interests they've expressed about the school they might create, etc.
- Sections for notes, interactions, tasks, associated emails and events.

### 5. Schools Module

#### List Page
- "Add New" opens a creation form or modal for a new school
- Actions for each row are open detail page for that record, edit record inline, mark inactive, create note, create task, log interaction, delete record (mark archived)
- Clicking a row opens the detail page
- Default columns include school name, school stage_status, current TLs, membership_status, ages_served, governance model .
- Kanban field is Stage_Status

#### Detail Page
- Displays school information including multiple versions of logo, 
- Show history of educators who have or do work there with their roles
- Show location history
- Show details of their process through the school startup journey
- Shows their board
- Sections for notes, interactions, tasks, documents (governance documents and 990s), associated grants and loans, linked emails and events.

### 6. Charters Module

#### List Page
- Add New opens a creation form or modal for a new charter
- Actions for each row are open detail page for that record, edit record inline, mark inactive, create note, create task, log interaction, delete record (mark archived)
- Clicking a row opens the detail page
- Default columns are short name, full name, initial target community, projected open, initial target ages, status
- Kanban field status

#### Detail Page
- Shows charter information
- Show information about authorization and authorizer contract
- Show associated schools
- Show associated educators
- Show board
- Sections for notes, interactions, tasks, documents (governance docs and 990s), associated grants and loans, and linked emails and events.

### 7. Settings

### Google Sync
- Each user gets to enter a start date for when they want to begin syncing their email and calendar into the system - default is to their first login to the overall app
- App gets permissions for syncing with gmail, calendar, and drive (for attachments) from each user. App handles exchange codes and token refreshes for every user
- Performs a batch sync to catch up between their chosen start date and the present and after that performs a daily sync of the last 24 hours
- For gmail sync, downloads the headers of every email in the user's inbox for the specified dates and puts them into a database which has fields for the parts of the email and also an array matched_educator_ids field.
- For gcal sync, downloads all events in the user's calendar for the specified dates and puts them into a database which has fields for the parts of the event and also an array matched_educator_ids field and a boolean field called full_download_complete that defaults to false
- At the end of the batch sync and at the end of a daily incremental sync, the server compares each record (email / cal) to a list of emails that includes all emails from all educators in the database except for those that have a @wildflowerschools.org or @blackwildflowers.org address and those that are flagged as exclude from logging in their educator record. Whenever there's a match, that educator_id is inserted into email/event's array. Then, the server looks through gmails to see where there are records with matched_educator_ids but not subject/body/attachments downloaded, and it downloads the full email from google. Similarly, it looks through events to see where are records with matched_educator_ids but where full_download_complete is false and it downloads attachments for that event
- Because syncing with google can be finicky, it carefully logs which emails/events it has attempted to download and which it has succeeded in downloaded and any errors it hit and therefore what time range it is up to date on syncing and when the last sync was
- Users should be able to mark any email or event as private that they want to and that will not show up in the system anymore (subject/body/attachments should be deleted but the header info with the private flag should stay)
- Data for this module may live outside Airtable

### Set user name and upload pictures

### 9. Error & Fallback Pages

- Unauthenticated users are redirected to the Login page.
- A generic error state handles unexpected failures with a retry option.
- 404 page for unknown routes.

### 10. Dashboard
- Initial login page except when they were directed to login by trying to go to another page
- Shows all the educators/schools/charters associated with the user
- Shows all of the users tasks that are not yet complete

## Non‑Functional Considerations

- **Airtable Integrity**: all create, update, and delete operations must reflect in Airtable and maintain relationships between tables.
- **Performance**: list pages should handle data sets of a few thousand records efficiently
- **Accessibility**: pages and controls should follow basic accessibility practices (semantic headings, labels, keyboard navigation).
- **Responsiveness**: layouts adapt to various screen sizes, prioritizing desktop but functioning on tablets. There should be an alternative interface to access the app in mobile with a dark background, a footer instead of a header, and page layouts designed for phones.





### Loans Module - to come later

Needs to be able to handle:
- Applications from schools
- Review of applications by staff
- Billing and recording of payments
- Accounting for the overall loan fund and for individual loans
- Creation of closing other documents and workflow for getting everything signed
- Committee reviews of final applications with workflow for questions and signoff
