import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { storage } from "./simple-storage";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await setupAuth(app);
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Let the client app (Supabase Auth) control authentication and routing.
  // Do not force a server-side auth redirect on '/'.

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Prefer PORT/HOST from environment, fallback to 5000/localhost
  let port = Number(process.env.PORT) || 5000;
  const host = process.env.HOST || "localhost";

  // Warm core datasets into in-memory cache for first-user snappiness
  (async () => {
    try {
      await Promise.allSettled([
        storage.getTeachers?.(),
        storage.getEducators?.(),
        storage.getSchools?.(),
        storage.getCharters?.(),
      ]);
      log("cache warm complete", "express");
    } catch (e) {
      log("cache warm error", "express");
    }
  })();

  const startListening = (startPort: number) => {
    return new Promise<void>((resolve, reject) => {
      const tryListen = (p: number) => {
        const onError = (err: any) => {
          if (err && (err.code === "EADDRINUSE" || err.errno === -4091)) {
            log(`port ${p} in use, trying ${p + 1}`, "express");
            server.off("error", onError);
            tryListen(p + 1);
          } else {
            reject(err);
          }
        };

        server.once("error", onError);
        server.listen(p, host, () => {
          server.off("error", onError);
          port = p;
          log(`serving on http://${host}:${p}`);
          resolve();
        });
      };

      tryListen(startPort);
    });
  };

  await startListening(port);
})();
