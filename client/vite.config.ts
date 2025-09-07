import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Read env from this client directory so Vite picks up client/.env.local
  envDir: path.resolve(import.meta.dirname),
  plugins: [
    react(),
    ...(process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
            m.default(),
          ),
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: [
      // Put the more specific alias first so it wins over "@shared"
      { find: "@shared/loan-schema", replacement: path.resolve(import.meta.dirname, "src", "shims", "loan-schema.ts") },
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
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
