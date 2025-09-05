# Wildflower Schools Teacher Management System

## Overview
The Wildflower Schools Teacher Management System is a comprehensive educational management platform designed for the Wildflower Schools network. Its primary purpose is to manage teachers, schools, charters, and integrate a full loan origination and management system. Key capabilities include managing educational records, tracking relationships between educators and schools, and handling the entire loan lifecycle from application to servicing. The system aims to provide robust support for educational operations and financial management within the network.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS with shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite
- **Data Tables**: AG Grid Community Edition

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Caching**: Server-side in-memory cache with 5-minute TTL
- **Error Handling**: Centralized error handling with custom classes

### Code Organization
- Centralized constants (`shared/constants.ts`) and utility functions (`shared/utils.ts`).
- Reusable AG Grid configurations (`client/src/utils/ag-grid-utils.ts`).
- Consistent API data fetching patterns (`client/src/hooks/use-api-query.ts`).
- Centralized error handling (`server/error-handler.ts`).

### Database Schema
- **Educational Data (Airtable)**: `teachers`, `schools`, `teacher_school_associations`, `charters`.
- **Loan Management System (PostgreSQL)**: `borrowers`, `loan_applications`, `loans`, `loan_payments`, `loan_documents`, `loan_covenants`, `loan_committee_reviews`, `capital_sources`, `quarterly_reports`.

### Key Components
- **Frontend**: Educational and Loan Management pages with shared components like data tables, modal forms, and navigation. Extensive use of shadcn/ui components.
- **Backend**: RESTful API endpoints for both educational and loan data. Dual storage system (Airtable for educational, PostgreSQL for loan) with Drizzle ORM and Zod validation for all requests.

### Data Flow
Client requests made via TanStack Query are handled by Express routes with validation. An abstract storage interface processes business logic, interacting with PostgreSQL via Drizzle ORM. JSON responses are sent back to the client.

### Deployment Strategy
- **Development**: Node.js with tsx for server, Vite for client with proxy to backend.
- **Production (Node host)**: Client static assets built by Vite, server bundled by esbuild. Single Node.js process serves both API and static files.
- **Production (Vercel)**: Client built to `dist/public` and served as static. API runs as a Vercel Function at `/api/*` via `api/index.ts` (Express embedded).

## Vercel Deployment (Static Client + Serverless API)

- Build command: `npm run build:vercel` (skips bundling the Node server)
- Output directory: `dist/public`

### Environment Variables on Vercel

- Client (used at build/runtime in the browser):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

- Serverless API (set in Vercel env; used by `/api/*`):
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (or `SERVICE_ROLE_KEY`)
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `STRIPE_SECRET_KEY` (required by server init)
  - Airtable credentials used by `server/simple-storage.ts`
  - `NODE_ENV=production`

### Auth Redirects
- Supabase → Authentication → URL Configuration
  - Site URL: `https://<your-vercel-domain>`
  - Additional Redirect URLs: include `/reset`, `/google-sync`, and localhost equivalents.
- Google OAuth client: add JS origin `https://<your-vercel-domain>`; keep redirect `https://<PROJECT>.supabase.co/auth/v1/callback`.

### Notes
- The client automatically attaches the Supabase JWT to `/api/*` requests, enabling stateless auth in serverless.
- If grids show “No rows”, check Vercel Function logs and verify server envs are present (notably `STRIPE_SECRET_KEY`).

### Architecture Standards
- **Schema-First Development**: Prioritizing alignment between TypeScript interfaces, Zod schemas, and Airtable field mappings.
- **Field Mapping Consistency**: Ensuring identical field names for read and write operations.
- **Component Type Matching**: Matching UI input types with underlying data types.

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider.
- **Drizzle ORM**: Type-safe database toolkit.

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Accessible component primitives.

### Development Tools
- **Vite**: Fast build tool.
- **TypeScript**: Static type checking.
- **ESLint**: Code linting.
