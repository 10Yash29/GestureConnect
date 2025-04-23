import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated and an admin
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }
    next();
  };

  // Admin-only routes
  app.get("/api/admin/check", requireAdmin, (req, res) => {
    res.json({ isAdmin: true });
  });

  // Other application routes would go here

  const httpServer = createServer(app);

  return httpServer;
}
