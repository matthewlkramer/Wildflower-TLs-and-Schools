# Wildflower Schools App Testing & Debugging Plan

## Overview
This plan systematically tests every interactive element (create, edit, delete buttons and forms) in the application without modifying production data.

## Setup Options for Safe Testing

### Option 1: Test Mode Implementation (Recommended)
- Add a "TEST MODE" toggle in the app that simulates operations without saving to Airtable
- All forms work normally but show success messages without actual data changes
- Easiest to implement and use

### Option 2: Airtable Base Copy
- Duplicate your Airtable base with a "_TEST" suffix
- Update environment variables to point to test base
- Test freely on copied data

### Option 3: Local Testing Environment
- Create mock data that mirrors your real data structure
- Test all functionality with fake data

## Testing Checklist

### 1. Main Navigation & Global Elements
- [ ] Header navigation between Charters, Schools, Teachers
- [ ] Search functionality on each main page
- [ ] Tour guide system (Flora mascot)

### 2. Schools Page Testing
#### List View
- [ ] Schools table loads correctly
- [ ] Sorting by each column (name, status, location, etc.)
- [ ] Search/filter functionality
- [ ] Column resize and organization

#### Add New School
- [ ] "Add School" button opens modal
- [ ] All form fields accept input
- [ ] Form validation works (required fields)
- [ ] Cancel button closes modal without saving
- [ ] Save button shows success message
- [ ] New school appears in list (if not in test mode)

### 3. School Detail Page Testing
Navigate to any school to test detail functionality:

#### Summary Tab
- [ ] All information displays correctly
- [ ] Logo display works
- [ ] Google Maps integration
- [ ] Address display
- [ ] Status badges and information cards

#### Details Tab
- [ ] "Edit Details" button activates edit mode
- [ ] All form fields become editable
- [ ] Input validation works
- [ ] "Save Changes" button processes correctly
- [ ] "Cancel" button discards changes
- [ ] All sections display correctly:
  - [ ] Program Details
  - [ ] Legal Entity  
  - [ ] Business & Financial Systems
  - [ ] Contact Information

#### TLs (Teachers) Tab
- [ ] Teacher associations table loads
- [ ] "Create New Educator" button opens form
- [ ] "Associate Existing Educator" dropdown works
- [ ] Edit icons on each row activate inline editing
- [ ] Start/End date fields work
- [ ] Role dropdown functions
- [ ] Active status toggle works
- [ ] "End Stint" button shows confirmation
- [ ] Delete icon shows confirmation modal
- [ ] Founder column displays correctly

#### Locations Tab
- [ ] Locations table loads
- [ ] "Add Location" button opens form
- [ ] Address field accepts input
- [ ] Checkbox fields work (Physical/Mailing address)
- [ ] Date fields work
- [ ] Edit icons activate inline editing
- [ ] Delete confirmations work

#### Docs (Governance) Tab
- [ ] Governance documents table loads
- [ ] 990s table loads
- [ ] "Add Governance Document" dropdown option
- [ ] "Add 990" dropdown option
- [ ] Document type becomes clickable link
- [ ] Edit icons work for both tables
- [ ] Delete confirmations for both tables
- [ ] Year field clickable for 990s

#### Guides Tab
- [ ] Guide assignments table loads
- [ ] "Add Guide Assignment" button works
- [ ] Edit icons activate editing
- [ ] Delete confirmations work
- [ ] Date fields function correctly

#### SSJ Tab
- [ ] All overview cards display
- [ ] Edit buttons for each section work
- [ ] Timeline & Milestones section
- [ ] Facility & Infrastructure section
- [ ] Funding & Financial Planning section
- [ ] Albums & Cohorts section

#### Grants/Loans Tab
- [ ] Grants table loads
- [ ] Loans table loads
- [ ] "Add Grant" button works
- [ ] "Add Loan" button works
- [ ] Edit icons for both tables
- [ ] Delete confirmations for both tables

#### Membership Fees Tab
- [ ] Membership Fee by Year table loads
- [ ] Membership Fee Updates table loads
- [ ] Calculated Fields section displays
- [ ] School year filtering works

#### Notes/Actions Tab
- [ ] School Notes table loads
- [ ] Action Steps table loads
- [ ] "Add Note" button works
- [ ] Headlines are clickable (open note modal)
- [ ] Action step status toggle works
- [ ] Edit icons work for both tables
- [ ] Delete confirmations work
- [ ] Note detail modal displays correctly
- [ ] Action step detail modal displays correctly

### 4. Teachers Page Testing
#### List View
- [ ] Teachers table loads
- [ ] Combined role/school column displays correctly
- [ ] Sorting and filtering work
- [ ] Search functionality

#### Add New Teacher
- [ ] "Add Educator" button opens modal
- [ ] All form fields work
- [ ] Validation functions
- [ ] Save/Cancel buttons work

### 5. Teacher Detail Page Testing
Test similar functionality as schools but for teachers:

#### Contact Info Tab
- [ ] Email addresses table
- [ ] Edit/delete functionality

#### Demographics Tab
- [ ] All fields display correctly
- [ ] Conditional "other" fields appear when needed

#### Cultivation Tab
- [ ] All 12 data points display
- [ ] Geographic interest information
- [ ] Follow-up management data

#### Certs Tab
- [ ] Montessori certifications table
- [ ] Edit/delete functionality

#### Events Tab
- [ ] Event attendance table
- [ ] Proper data filtering

#### Notes Tab
- [ ] Educator notes table
- [ ] Add/edit/delete functionality

### 6. Charters Page Testing
#### List View
- [ ] Charters table loads correctly
- [ ] Short Name column clickable navigation
- [ ] All charter fields display

#### Add New Charter
- [ ] "Add Charter" button works
- [ ] Form validation
- [ ] Save functionality

### 7. Charter Detail Page Testing
Test all 10 tabs:
- [ ] Summary tab
- [ ] Sites tab
- [ ] Staff/Roles tab
- [ ] Application(s) tab
- [ ] Contract tab
- [ ] Authorizer tab
- [ ] Reports tab
- [ ] Assessments tab
- [ ] Notes/Action Steps tab
- [ ] Linked Emails/Meetings tab

### 8. Error Handling Testing
- [ ] Test with invalid data inputs
- [ ] Test network error scenarios
- [ ] Verify error messages are user-friendly
- [ ] Check loading states during operations

### 9. Performance Testing
- [ ] Large table loading performance
- [ ] Search responsiveness
- [ ] Edit form responsiveness
- [ ] Cache effectiveness (5-minute TTL)

### 10. Mobile/Responsive Testing
- [ ] Horizontal scrolling tabs work on mobile
- [ ] Tables are readable on small screens
- [ ] Forms work on mobile devices
- [ ] Navigation is accessible

## Testing Execution Strategy

### Phase 1: Basic Functionality (30 minutes)
1. Test main navigation and page loading
2. Test one complete CRUD cycle on each main entity
3. Verify all "Add New" buttons open forms

### Phase 2: Detailed Form Testing (45 minutes)
1. Test all form fields in each modal/section
2. Test validation rules
3. Test save/cancel functionality
4. Test edit modes

### Phase 3: Edge Cases & Error Handling (30 minutes)
1. Test with empty fields
2. Test with invalid data
3. Test cancellation at various stages
4. Test rapid clicking scenarios

### Phase 4: Integration Testing (15 minutes)
1. Test data relationships (teacher-school associations)
2. Test dependent dropdowns
3. Test cascading updates

## Bug Reporting Template
When issues are found, report with:
- **Location**: Which page/tab/section
- **Action**: What button/field was clicked
- **Expected**: What should happen
- **Actual**: What actually happened
- **Browser**: Chrome/Firefox/Safari version
- **Device**: Desktop/Mobile/Tablet

## Post-Testing Actions
- [ ] Document all confirmed working features
- [ ] Create priority list for any bugs found
- [ ] Update user documentation based on test results
- [ ] Consider automated testing implementation for critical paths