export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: "MCP Server Active. Use POST for JSON-RPC." });
  }

  if (req.method === 'POST') {
    try {
      const { jsonrpc, id, method, params } = req.body;
      let result = null;

      if (method === "initialize") {
        result = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: {
            name: "Kingdom Sable Orchestrator",
            version: "1.0.0"
          }
        };
      } else if (method === "tools/list") {
        result = {
          tools: [
            { name: "get_race_status", description: "Get current race status", inputSchema: { type: "object", properties: {} } },
            { name: "start_race", description: "Start a new race", inputSchema: { type: "object", properties: {} } },
            { name: "get_leaderboard", description: "Get the current leaderboard", inputSchema: { type: "object", properties: {} } },
            { name: "optimize_speed", description: "Optimize speed for current track", inputSchema: { type: "object", properties: {} } },
            { name: "get_track_info", description: "Get information about the track", inputSchema: { type: "object", properties: {} } }
          ]
        };
      } else if (method === "tools/call") {
        const toolName = params?.name;
        result = {
          content: [
            {
              type: "text",
              text: `Tool ${toolName} executed successfully`
            }
          ]
        };
      } else if (method === "prompts/list") {
        result = { prompts: [] };
      } else if (method === "resources/list") {
        result = { resources: [] };
      } else {
        return res.status(200).json({
          jsonrpc: jsonrpc || "2.0",
          id,
          error: { code: -32601, message: "Method not found" }
        });
      }

      return res.status(200).json({
        jsonrpc: jsonrpc || "2.0",
        id,
        result
      });
    } catch (error) {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" }
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
