/**
 * ERC-8004: Trustless Agents integration
 * Generates payloads for agent intent settlement on-chain.
 */

export interface AgentPayload {
  agentId: string;
  actionType: 'record_kingdom' | 'manage_assets';
  intentData: Record<string, string | number>;
  timestamp: number;
}

export function generateAgentPayload(
  agentId: string,
  actionType: AgentPayload['actionType'],
  intentData: Record<string, string | number>
): AgentPayload {
  return {
    agentId,
    actionType,
    intentData,
    timestamp: Date.now()
  };
}

export function serializeAgentPayload(payload: AgentPayload): string {
  // Simple serialization for agent settlement
  return JSON.stringify(payload);
}
