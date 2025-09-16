import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Read env from this client directory so Vite picks up client/.env.local
  envDir: path.resolve(import.meta.dirname),
  plugins: [
    react(),
    // Replit plugins will be added when available
  ],
  resolve: {
    alias: [
      // Put the more specific alias first so it wins over "@shared"
      { find: "@shared/loan-schema", replacement: path.resolve(import.meta.dirname, "src", "shims", "loan-schema.ts") },
      { find: "@shared/loan-schema.ts", replacement: path.resolve(import.meta.dirname, "src", "shims", "loan-schema.ts") },
      // Map legacy shared schema types to client app schema (post-Express/Airtable)
      { find: "@shared/schema.generated", replacement: path.resolve(import.meta.dirname, "src", "types", "ui-schema.ts") },
      // Also replace the direct relative import inside shared/schema.ts
      // Catch absolute ids with or without .ts (Vercel/Posix)
      { find: /\/shared\/loan-schema(\.ts)?$/, replacement: path.resolve(import.meta.dirname, "src", "shims", "loan-schema-runtime.ts") },
      { find: "@", replacement: path.resolve(import.meta.dirname, "src") },
      { find: "@shared", replacement: path.resolve(import.meta.dirname, "..", "shared") },
      { find: "@assets", replacement: path.resolve(import.meta.dirname, "..", "attached_assets") },
      // Ensure dependencies imported from files outside client root (e.g., shared/) resolve
      { find: "zod", replacement: path.resolve(import.meta.dirname, "node_modules", "zod") },
      // Stub server-only libs referenced from shared/* so client build doesn't fail
      { find: "drizzle-orm/pg-core", replacement: path.resolve(import.meta.dirname, "src", "shims", "drizzle-pg-core.ts") },
      { find: "drizzle-orm", replacement: path.resolve(import.meta.dirname, "src", "shims", "drizzle-orm.ts") },
      { find: "drizzle-zod", replacement: path.resolve(import.meta.dirname, "src", "shims", "drizzle-zod.ts") },
    ],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    // Emit inside client/ so Vercel (Root=client) can find it as "dist"
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    // Increase chunk size warning limit for ag-grid
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'wouter'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-toggle', '@radix-ui/react-tooltip'],
          'ag-grid': ['ag-grid-community', 'ag-grid-react', 'ag-grid-enterprise'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge', 'zod'],
          'query': ['@tanstack/react-query'],
          'supabase': ['@supabase/supabase-js'],
          'forms': ['react-hook-form', '@hookform/resolvers']
        }
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
