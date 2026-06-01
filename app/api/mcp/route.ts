// @ts-ignore
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({ status: "MCP Server Active. Use POST for JSON-RPC." }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

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
      return NextResponse.json({
        jsonrpc: jsonrpc || "2.0",
        id,
        error: { code: -32601, message: "Method not found" }
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      jsonrpc: jsonrpc || "2.0",
      id,
      result
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" }
    }, { status: 400, headers: corsHeaders });
  }
}
