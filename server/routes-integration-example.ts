// Example: How to integrate generated routes with custom business logic
// This file demonstrates the pattern for using the generated CRUD routes
// alongside custom routes for specific business requirements.

import type { Express } from "express";
import { registerGeneratedRoutes } from './routes.generated';
import { requireAuth } from './auth';

export async function registerAllRoutes(app: Express) {
  console.log('🚀 Setting up API routes...');

  // Apply authentication middleware to all /api routes
  app.use("/api", (req, res, next) => {
    const path = req.path || "";
    if (
      path.startsWith("/auth") ||
      path.startsWith("/_auth") ||
      path.startsWith("/_probe")
    ) {
      return next();
    }
    return requireAuth(req, res, next);
  });

  // Register all the auto-generated CRUD routes
  // This gives you 5 routes per table: GET all, GET by ID, POST, PUT, DELETE
  registerGeneratedRoutes(app);

  // Add custom routes for specific business logic
  // Example: Custom query endpoints that don't fit the standard CRUD pattern
  
  app.get("/api/schools/user/:userId", async (req, res) => {
    // Custom endpoint for user-specific schools
    // This type of specialized query would be added here
    res.json({ message: "Custom user schools endpoint - implement as needed" });
  });

  app.get("/api/educators/by-status/:status", async (req, res) => {
    // Custom endpoint for educators by status
    res.json({ message: "Custom educator status endpoint - implement as needed" });
  });

  app.post("/api/schools/:schoolId/assign-educator", async (req, res) => {
    // Custom business logic for assigning educators to schools
    res.json({ message: "Custom educator assignment endpoint - implement as needed" });
  });

  // Loan-specific routes (these use the database, not Airtable)
  // These would remain as custom routes since they have different storage logic
  app.get("/api/loans", async (req, res) => {
    res.json({ message: "Database loan routes - implement as needed" });
  });

  console.log('✅ All routes registered successfully');
  console.log('   📊 Generated CRUD routes for all Airtable tables');
  console.log('   🔧 Custom routes for specialized business logic');
}

/*
BENEFITS OF THIS APPROACH:

1. **Dramatic Code Reduction**: 2424 lines → ~500 lines (80% reduction)

2. **Automatic Schema Sync**: When Airtable metadata changes, routes update automatically

3. **Consistent API**: All tables get the same standardized endpoints:
   - GET /api/{resource}          (get all)
   - GET /api/{resource}/:id      (get by ID) 
   - POST /api/{resource}         (create)
   - PUT /api/{resource}/:id      (update)
   - DELETE /api/{resource}/:id   (delete)

4. **Maintainable**: Custom business logic is clearly separated from generated CRUD

5. **Type Safe**: Full TypeScript support with generated types and Zod validation

MIGRATION STRATEGY:

1. Start using `registerGeneratedRoutes()` alongside existing routes
2. Test the generated endpoints for each table
3. Gradually remove manual CRUD routes that are now redundant  
4. Keep custom routes for specialized business logic
5. Eventually replace `routes.ts` with this integration approach

GENERATED ROUTES INCLUDE:
- Partners, Schools, Educators, Locations, Events, Grants
- Action Steps, Charters, Governance Docs, Training Grants
- All 49 Airtable tables with full CRUD operations
- Automatic validation using generated Zod schemas
- Consistent error handling and cache invalidation
*/