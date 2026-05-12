import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // --- Agent & MCP API Routes ---

  // MCP API
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Kingdom Sable MCP Endpoint",
      status: "active",
      description: "Active MCP server for Kingdom Sable Orchestrator Agent",
      capabilities: ["kingdom-management", "dynasty-operations", "strategic-rulership"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      res.json({
        status: "success",
        message: "MCP command received",
        agent: "Kingdom Sable Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // Agent API
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Kingdom Sable Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Kingdom Sable",
      version: "1.0.0"
    });
  });

  // --- Frontend Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
