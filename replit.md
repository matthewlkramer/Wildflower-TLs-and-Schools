# Wildflower Schools Teacher Management System

## Overview

This is a full-stack web application for managing teachers and schools in the Wildflower Schools network. The system allows users to create, read, update, and delete teacher and school records, as well as manage associations between teachers and schools.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite
- **Data Tables**: AG Grid Community Edition with custom utilities

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Development**: In-memory storage implementation for development/testing
- **Caching**: Server-side in-memory cache with 5-minute TTL
- **Error Handling**: Centralized error handling with custom error classes

### Code Organization (Refactored)
- **Shared Constants**: `shared/constants.ts` - Centralized constants for tables, colors, errors
- **Shared Utilities**: `shared/utils.ts` - Common utility functions
- **AG Grid Utilities**: `client/src/utils/ag-grid-utils.ts` - Reusable grid configurations
- **API Hooks**: `client/src/hooks/use-api-query.ts` - Consistent data fetching patterns
- **Error Handler**: `server/error-handler.ts` - Centralized error handling

### Database Schema
- **teachers**: Teacher profiles with personal and professional information
- **schools**: School information including location and type
- **teacher_school_associations**: Many-to-many relationship between teachers and schools

## Key Components

### Frontend Components
- **Pages**: Teachers list, Schools list, Teacher detail, School detail
- **Shared Components**: Header navigation, data tables, modal forms, delete confirmations
- **UI Components**: Complete shadcn/ui component library implementation
- **Form Components**: Add teacher/school modals with validation

### Backend Components
- **Routes**: RESTful API endpoints for teachers, schools, and associations
- **Storage Layer**: Abstract storage interface with in-memory implementation
- **Database Integration**: Drizzle ORM with PostgreSQL schema definitions
- **Validation**: Zod schemas for request/response validation

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle HTTP requests with validation
3. **Storage Layer**: Abstract storage interface processes business logic
4. **Database**: Drizzle ORM manages PostgreSQL queries and transactions
5. **Response**: JSON responses sent back to client with proper error handling

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database toolkit
- **Connection**: Uses DATABASE_URL environment variable

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Static type checking
- **ESLint**: Code linting (configured via package.json)

## Deployment Strategy

### Development
- **Server**: Node.js with tsx for TypeScript execution
- **Client**: Vite development server with proxy to backend
- **Database**: Direct connection to Neon Database

### Production
- **Build Process**: 
  - Client: Vite builds static assets to `dist/public`
  - Server: esbuild bundles server code to `dist/index.js`
- **Deployment**: Single Node.js process serving both API and static files
- **Database**: Production Neon Database instance

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment setting (development/production)

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
- July 03, 2025. Removed pagination from data grids - now shows full scrollable lists
- July 03, 2025. Removed initials from name columns, replaced "Not specified" with blank cells
- July 03, 2025. Improved layout: moved search to header, removed sub-headers, expanded horizontal space usage
- July 03, 2025. Fixed Current TLs field mapping from Airtable and changed display to plain text
- July 03, 2025. Fixed Stage_Status field mapping for both schools and teachers from Airtable
- July 03, 2025. Implemented color-coded Stage/Status badges: red for closed states, green gradient for progression stages, gray for placeholders
- July 03, 2025. Replaced AG Grid SetFilter with agTextColumnFilter for Community edition compatibility
- July 04, 2025. Fixed "School not found" error by removing parseInt from Airtable ID handling
- July 04, 2025. Implemented comprehensive school detail tabs: Summary, Details, Teachers, Locations, Guides, Governance
- July 04, 2025. Added inline editing functionality for Teacher associations and Locations with CRUD operations
- July 04, 2025. Created Teachers tab with inline editable start/end dates, roles, active status, "End Stint" and "Delete Stint" actions
- July 04, 2025. Implemented Guides tab with guide assignments table showing guide short name, type, dates, and active status
- July 04, 2025. Added full-width detail pages with breadcrumb navigation format ("Wildflower > [Entity Name]")
- July 04, 2025. Added logo display area to school summary tab with proper Airtable field mapping and placeholder when no logo is present
- July 04, 2025. Implemented horizontal scrolling tabs for mobile devices on both school and teacher detail pages to prevent tab cramming
- July 04, 2025. Fixed location checkbox fields to use boolean values instead of strings for "Current Physical Address" and "Current Mailing Address"
- July 04, 2025. Updated governance documents table name from "Governance documents" to "Governance docs" to match actual Airtable table name
- July 04, 2025. Added improved error handling for missing or unauthorized Airtable tables with informative warning messages
- July 04, 2025. Fixed governance documents field mappings to correctly extract "Document type", "Date", and "Document PDF" attachment filenames from Airtable
- July 04, 2025. Updated guide assignments table name from "Guide assignments" to "Guides Assignments" to match actual Airtable table name
- July 04, 2025. Fixed comprehensive schema and TypeScript errors by adding all missing properties to School and Educator interfaces, including SSJ data fields, systems fields, and additional contact information
- July 04, 2025. Corrected checkbox field types from string to boolean for currentPhysicalAddress and currentMailingAddress properties
- July 04, 2025. Migrated from "Teacher" to "Educator" terminology throughout the application for consistency with Wildflower Schools naming conventions, including component names, API endpoints, and form schemas while maintaining backward compatibility
- July 05, 2025. Implemented Notes/Actions tab with two-column layout: School Notes table on left, Action Steps placeholder on right, matching Grants/Loans design pattern
- July 05, 2025. Created separate Systems tab and moved all systems-related fields from Support tab to new dedicated Systems tab for better organization
- July 05, 2025. Implemented Membership Fees tab with three-column layout: Membership Fee by Year table, Membership Fee Updates table with school year filtering, and Calculated Fields section
- July 05, 2025. Reorganized school detail tabs by moving Contact Information and Legal Entity sections from Summary tab to Details tab for better information architecture
- July 05, 2025. Enhanced Summary tab with Google Maps integration using latitude/longitude coordinates, current physical address display, Current Guide(s) field, SSJ Stage badges, risk factors and watchlist information, conditional SSJ Projected Open date for visioning/planning/startup stages, and conditional left network date/reason fields for schools that have exited the network
- July 05, 2025. Updated Teacher demographics tab to remove name fields, add conditional "other" fields (gender other, race/ethnicity other, pronouns other) that only display when respective field is set to "other", and moved educational attainment field to demographics section
- July 05, 2025. Implemented Email Addresses table in Teacher Contact Info tab with full AG Grid integration and Airtable backend support
- July 06, 2025. Fixed all subtable filtering to use correct Airtable field names: {school_id} for school-related tables and {educator_id} for educator-related tables - email addresses functionality now working correctly
- July 06, 2025. Implemented comprehensive early cultivation data tracking in Teacher detail Cultivation tab with 12 key data points including computed most recent fillout form date, geographic interest, SendGrid tracking, follow-up management, and organized layout with proper Airtable field mappings
- July 06, 2025. Converted all static teacher tabs to dynamic filtered tables: Certs tab now shows MontessoriCertificationsTable, Events tab shows EventAttendanceTable, and Notes tab shows EducatorNotesTable - all filtered by educator_id following consistent AG Grid pattern
- July 06, 2025. Successfully implemented dynamic data tables for teacher detail tabs: Notes tab and Events tab now working with real Airtable data, Certs tab has Airtable permission restrictions on "Montessori Certs" table that need to be resolved at the database access level
- July 06, 2025. Implemented server-side caching system to optimize performance: added 5-minute TTL cache for educators and schools data, reducing Airtable API calls from ~6000ms to ~50ms for cached requests, created cache monitoring endpoint at /api/cache/stats for performance tracking
- July 06, 2025. Major refactoring for code maintainability: created shared/constants.ts for centralized constants, shared/utils.ts for common utility functions, client/src/utils/ag-grid-utils.ts for reusable AG Grid configurations, client/src/hooks/use-api-query.ts for consistent data fetching patterns, server/error-handler.ts for centralized error handling
- July 06, 2025. Comprehensive TypeScript error resolution: fixed missing interface implementation by adding all MembershipFeeUpdate methods, resolved property mapping errors for Grant, MontessoriCertification, EventAttendance, and MembershipFeeByYear interfaces, fixed client-side type issues in teachers.tsx and schools.tsx, removed invalid properties from object transformations to ensure type safety
- July 06, 2025. Fixed Montessori certifications loading issue by creating missing subtable route in server/routes.ts to handle generic table queries with proper filtering parameters
- July 06, 2025. Resolved Google Maps and current physical address display issues by adding missing field mappings (activeLatitude, activeLongitude, activePhysicalAddress) to school transformation and implementing fallback address display when coordinates unavailable
- July 06, 2025. Updated school summary tab: removed city/state field, removed all section headers (Location, School Information), and fixed public funding to display linked multi-select publicFundingSources field instead of boolean publicFunding field, removed redundant school name display that appeared after the address field
- July 06, 2025. Fixed critical Airtable filtering bug: corrected field names from {schoolId} to {school_id} in getGovernanceDocumentsBySchoolId, getGuideAssignmentsBySchoolId, getGrantsBySchoolId, getLoansBySchoolId, and getSchoolNotesBySchoolId methods - resolving empty tabs issue for governance docs, guides, grants, loans, and school notes
- July 06, 2025. Created comprehensive "Add New" forms throughout application: implemented AddSchoolModal with validation and integrated into schools page with Add School button, leveraging existing AddEducatorModal for complete CRUD functionality
- July 06, 2025. Provided 22 comprehensive UI improvement suggestions covering navigation, data presentation, forms, visual hierarchy, mobile responsiveness, and performance optimizations for enhanced user experience
- July 06, 2025. Resolved Google Maps loading issue: identified that Airtable database lacks latitude/longitude coordinate data for schools, fixed address array formatting, updated Google Maps component to show informative address display with clear messaging about adding coordinates to Airtable for map functionality
- July 07, 2025. Implemented AG Grid v34 Material Design theme across all data tables: migrated from legacy CSS themes to new Theming API using themeMaterial, removed old CSS imports and theme wrapper classes, achieved consistent Material Design v2 styling throughout application
- July 07, 2025. Optimized table layout and spacing: reduced row heights from 35px to 30px (40px for notes tables), vertically centered all badges and pills in grid cells, removed redundant "Add School" button from schools page for cleaner interface
- July 07, 2025. Enhanced data table visual consistency: applied Material theme to all 8 AG Grid components (teachers, schools, associations, certifications, events, notes, emails, forms), improved content alignment and spacing for better readability
- July 07, 2025. Added four new logo fields to School schema: logoMainSquare, logoFlowerOnly, logoMainRectangle, logoUrl - mapped from new Airtable attachment fields "Logo - main square", "Logo - flower only", "Logo - main rectangle", and "Logo URL"
- July 07, 2025. Enhanced Google Maps flower markers to prioritize logoFlowerOnly field when available, with fallback to original logo field for custom school branding on map markers
- July 07, 2025. Updated school summary logo display to prioritize logoMainSquare field for better square format display in summary section, maintaining fallback chain for compatibility
- July 07, 2025. Updated logo fallback logic per user preferences: Google Maps now uses logoFlowerOnly → logoMainSquare → logo; School summary now uses logoMainRectangle → logoMainSquare → logo for optimal display formats
- July 07, 2025. Added Program Details section to school details tab with program focus, school calendar, school schedule, ages served, number of classrooms, and enrollment capacity fields
- July 07, 2025. Added governance model field to Legal Entity section in school details tab
- July 07, 2025. Enhanced Support tab with improved visual design: created Overview cards with gradient backgrounds, organized sections for Timeline & Milestones, Facility & Infrastructure, Funding & Financial Planning, and Albums & Cohorts with proper icons and structured layouts
- July 07, 2025. Fixed membership fees API integration by updating table name from "Membership Fee by Year" to "Membership Fee overview" in Airtable configuration
- July 07, 2025. Fixed membership fee updates API filtering by correcting field name from {school_id} to {Schools} for proper Airtable data retrieval
- July 07, 2025. Resolved JSX syntax errors in school detail page by removing duplicate content sections and ensuring proper component structure
- July 07, 2025. Fixed school notes table showing IDs instead of names by correcting createdBy field mapping to extract .name property from Airtable records
- July 07, 2025. Implemented comprehensive inline editing for 990s table: created Tax990Row component with edit/delete actions, added API routes (PATCH/DELETE), and integrated delete confirmation modal
- July 07, 2025. Enhanced governance documents table with open action: added external link button to open documents in new tab, completing the open/edit/delete action pattern
- July 07, 2025. Standardized table actions across governance and financial tabs: 990s table sorted by year descending with edit/delete, governance docs sorted alphabetically by type with open/edit/delete
- July 07, 2025. Redesigned governance documents and 990s tables for better UX: removed document name columns, made document type and year fields clickable links to open attachments directly, simplified table structure with cleaner inline editing experience
- July 07, 2025. Enhanced multi-table tabs with improved Add New functionality: governance tab now has dropdown for "Add Governance Document" or "Add 990", updated column headers ("Governance documents", "990 year"), removed redundant subheaders and bottom Add button for cleaner interface
- July 07, 2025. Improved Add New button behavior: grayed out button on summary, details, support, systems, and membership tabs where no creation functionality exists, providing clearer visual feedback for user interface state
- July 07, 2025. Standardized governance documents table layout: matched row heights (h-8) and padding (py-1) with 990s table for consistent visual design across both tables in the governance tab
- July 07, 2025. Fixed school notes table displaying IDs instead of names: successfully mapped to "Partner Short Name" field in Airtable, removed debugging code, cleaned up field transformation to properly display creator names instead of record IDs
- July 07, 2025. Implemented live Action Steps table: replaced placeholder with fully functional table displaying real Airtable data including item descriptions, assignees, due dates, and status badges with smart sorting (incomplete items first, then by due date)
- July 07, 2025. Fixed membership fees data source: updated to use correct Airtable table "Membership fee school x year" instead of "Membership Fee overview", added proper field mappings for fee amount, status, and due date
- July 07, 2025. Fixed action steps not loading: discovered missing API route in server/routes.ts, added proper /api/action-steps/school/:schoolId endpoint to handle action steps requests
- July 07, 2025. Implemented headline-based notes display system: added "Headline (Notes)" field to SchoolNote schema and Airtable mapping, updated Notes table to show headlines instead of full text, made headlines clickable to open detailed note modal, added open icon button for full record viewing, created comprehensive note view modal displaying all fields including headline, full notes, metadata, and record ID
- July 07, 2025. Enhanced table layouts for mobile responsiveness: optimized both Notes and Action Steps tables with percentage-based column widths, added text truncation with hover tooltips, implemented table-fixed layout to prevent horizontal scrolling, added hover tooltips to all action icons explaining their functions (Edit, Open, Mark as private/complete, Delete)
- July 07, 2025. Fixed critical runtime error: resolved React Query object rendering issue by ensuring all table cell content is properly converted to strings, preventing "Objects are not valid as a React child" errors
- July 07, 2025. Fixed Airtable headline field object parsing: resolved "[object Object]" display issue by properly extracting value property from Airtable's generated field objects with structure {state, value, isStale}, headlines now display correctly as text strings
- July 07, 2025. Enhanced Action Steps table with comprehensive functionality: added open icon for viewing full action step details in modal, implemented toggle complete/incomplete status with appropriate icons (checkmark for incomplete items, rotate icon for completed items), created detailed action step view modal showing all fields including description, dates, status, and record metadata
- July 07, 2025. Fixed membership fees loading issue: corrected Airtable filtering to use proper "School" field array search instead of non-existent "school_id" or "Schools" fields, updated field mappings to use correct Airtable field names ("Initial fee", "Revised amount", "Current exemption status", etc.), implemented fallback manual filtering when Airtable FIND formula fails, successfully loading membership fee records for schools
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```