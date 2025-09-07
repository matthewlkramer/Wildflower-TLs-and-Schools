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
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared": path.resolve(import.meta.dirname, "..", "shared"),
      "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
      // Ensure dependencies imported from files outside client root (e.g., shared/) resolve
      "zod": path.resolve(import.meta.dirname, "node_modules", "zod"),
      // Stub server-only libs referenced from shared/* so client build doesn't fail
      "drizzle-orm/pg-core": path.resolve(import.meta.dirname, "src", "shims", "drizzle-pg-core.ts"),
      "drizzle-orm": path.resolve(import.meta.dirname, "src", "shims", "drizzle-orm.ts"),
      "drizzle-zod": path.resolve(import.meta.dirname, "src", "shims", "drizzle-zod.ts"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    // Always emit to dist/public; Vercel/Render static output can point here
    outDir: path.resolve(import.meta.dirname, "..", "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
