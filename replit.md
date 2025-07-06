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

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Development**: In-memory storage implementation for development/testing

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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```