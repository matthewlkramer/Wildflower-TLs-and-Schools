# Overview

The Wildflower TLs & Schools application is a comprehensive management system for supporting Wildflower Montessori schools, educators (Teacher Leaders), and charter organizations. The system uses Airtable as the primary data source and system of record, with optional PostgreSQL database for enhanced features like email/calendar sync and loan management. The application provides end-to-end management capabilities for the entire Wildflower school ecosystem.

# User Preferences

Preferred communication style: Simple, everyday language.
Database management: Prefers making database changes via Supabase dashboard rather than using migrations.

# System Architecture

## Frontend Architecture
- **Technology**: React 18 with Vite for development and building
- **UI Framework**: Tailwind CSS with shadcn/ui component library and Radix UI primitives
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state, React Context for local state
- **Data Grid**: AG Grid Community and Enterprise for complex data tables
- **Authentication**: Supabase Auth with Google SSO, restricted to `@wildflowerschools.org` domain

## Backend Architecture
- **Server**: Express.js REST API
- **Data Sources**: 
  - Primary: Airtable (system of record for all core entities)
  - Secondary: PostgreSQL via Drizzle ORM for loans, payments, and email sync
- **Code Generation**: Metadata-driven approach generating TypeScript types, Zod schemas, storage transformers, and CRUD API routes from Airtable metadata
- **Caching**: In-memory request caching for improved performance
- **Authentication**: Supabase integration for user management

## Database Design
- **Airtable Tables**: 49+ tables including Schools, Educators, Charter Organizations, Notes, Interactions, Tasks, Certifications, Locations, and more
- **PostgreSQL Extensions**: Loan management system with borrowers, applications, payments, documents, covenants, and quarterly reporting
- **Metadata System**: Airtable "Metadata" table defines field configurations, types, validation rules, and options for automatic code generation

## Code Generation System
The application uses a sophisticated metadata-driven architecture:
- **Metadata Source**: Airtable "Metadata" table with field definitions
- **Generated Files**: 
  - `shared/schema.generated.ts` - TypeScript interfaces, Zod schemas, field mappings
  - `server/generic-storage.generated.ts` - Database transformers and convenience methods
  - `server/routes.generated.ts` - Complete CRUD API routes (245 endpoints)
- **Generation Script**: `scripts/generate-from-metadata.cjs` creates type-safe code from Airtable metadata
- **Benefits**: Automatic camelCase conversion, type safety, validation, and API endpoint generation

## Authentication & Authorization
- **Google SSO**: Supabase Auth with domain restriction to `@wildflowerschools.org`
- **User Context**: Per-user filtering available via "My records" toggle
- **Access Control**: Role-based access implied through organizational email domain

## Optional Email/Calendar Integration
- **Technology**: Supabase Edge Functions (Deno) for Gmail and Google Calendar sync
- **OAuth Flow**: Google OAuth2 with refresh token management
- **Storage**: Supabase PostgreSQL for storing synced emails and calendar events
- **Matching**: Automated email/event association with educators and schools
- **Scope**: Optional per-user Gmail/Calendar sync stored separately from Airtable

# External Dependencies

## Primary Data Services
- **Airtable**: Primary database and system of record for all core entities
- **Supabase**: Authentication, PostgreSQL database, and Edge Functions hosting
- **Google APIs**: Gmail and Calendar APIs for optional email/calendar sync

## Development & Hosting
- **Vercel**: Primary hosting platform with monorepo deployment
- **Vite**: Frontend build tool and development server
- **pnpm**: Package manager with workspace support
- **TypeScript**: Type safety across client and server

## Third-Party Integrations
- **Stripe**: ACH payment processing for loan management
- **AG Grid Enterprise**: Advanced data grid with filtering, sorting, and export capabilities
- **Google Maps**: Location services and mapping functionality

## UI & Component Libraries
- **Radix UI**: Headless UI primitives for accessibility
- **shadcn/ui**: Pre-built component library with Tailwind CSS
- **Lucide React**: Icon system
- **Framer Motion**: Animation library

## Development Tools
- **Drizzle ORM**: Type-safe PostgreSQL query builder
- **Drizzle Kit**: Database migrations and schema management  
- **Zod**: Runtime type validation
- **React Hook Form**: Form validation and state management
- **TanStack React Query**: Server state management and caching

## Build & Deployment
- **esbuild**: Fast JavaScript bundler for server builds
- **PostCSS**: CSS processing with Tailwind CSS
- **tsx**: TypeScript execution for development and scripts