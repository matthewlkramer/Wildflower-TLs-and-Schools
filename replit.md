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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```