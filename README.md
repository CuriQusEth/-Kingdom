# Kingdom Sable

**Establish Your Kingdom** is a satisfying medieval kingdom-building strategy game. Start as a humble lord with a small village and grow it into a mighty kingdom. Build structures, manage resources, expand territory, defend against threats, and lead your people to prosperity.

## Project Overview
Kingdom Sable natively leverages on-chain utilities. It integrates strategic governance, resource management, and multi-realm dynasty operations. It features an ERC-8004 compliant AI agent (**Kingdom Sable Orchestrator**) to handle kingdom operations and process MCP commands intelligently.

## Tech Stack
- **Frontend:** Next.js 14 / React
- **Styling:** Tailwind CSS
- **Web3:** Wagmi, Viem, Base Mainnet
- **Agent Protocol:** ERC-8004, Model Context Protocol (MCP)

## How to Run Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit the application locally to test out the gameplay UI and components.

## Agent Registration Info
Our on-chain AI Agent, the **Kingdom Sable Orchestrator**, is fully ERC-8004 compliant. The agent profile is publicly discoverable via the standard `.well-known` path:

- **Endpoint:** `https://kingdom-sable.vercel.app/.well-known/agent-card.json`
- **Capabilities:** `kingdom-management`, `dynasty-operations`, `strategic-rulership`, `multi-realm-governance`, `resource-management`, `political-orchestration`, `mcp-command-execution`

## MCP Connection Guide
The agent uses the standard Model Context Protocol (MCP) for command execution.

- **MCP Endpoint:** `https://kingdom-sable.vercel.app/api/mcp`
- **Supported Methods:** `tools/list`, `tools/call`, `prompts/list`, `resources/list`

To integrate, your MCP client should send `POST` requests with JSON-RPC-like structures defining the tool and parameters you want the orchestrator to execute.

