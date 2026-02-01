/**
 * Agent Manager
 * 
 * Manages agents and their lifecycle.
 */

import { Agent, AgentStatus } from './types';

/**
 * Generates a unique ID
 */
function generateId(): string {
  return `agent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * AgentManager class for managing agents
 */
export class AgentManager {
  private agents: Map<string, Agent> = new Map();

  /**
   * Register a new agent
   */
  registerAgent(name: string, capabilities: string[]): Agent {
    const now = new Date();
    const agent: Agent = {
      id: generateId(),
      name,
      status: AgentStatus.IDLE,
      capabilities,
      currentTaskId: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.agents.set(agent.id, agent);
    return agent;
  }

  /**
   * Get an agent by ID
   */
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get available agents (idle status)
   */
  getAvailableAgents(): Agent[] {
    return this.getAllAgents().filter(agent => agent.status === AgentStatus.IDLE);
  }

  /**
   * Get agents with specific capabilities
   */
  getAgentsWithCapabilities(requiredCapabilities: string[]): Agent[] {
    return this.getAllAgents().filter(agent => 
      requiredCapabilities.every(cap => agent.capabilities.includes(cap))
    );
  }

  /**
   * Update agent status
   */
  updateAgentStatus(id: string, status: AgentStatus): Agent | undefined {
    const agent = this.agents.get(id);
    if (agent) {
      agent.status = status;
      agent.updatedAt = new Date();
      this.agents.set(id, agent);
    }
    return agent;
  }

  /**
   * Assign task to agent
   */
  assignTaskToAgent(agentId: string, taskId: string): Agent | undefined {
    const agent = this.agents.get(agentId);
    if (agent && agent.status === AgentStatus.IDLE) {
      agent.status = AgentStatus.BUSY;
      agent.currentTaskId = taskId;
      agent.updatedAt = new Date();
      this.agents.set(agentId, agent);
      return agent;
    }
    return undefined;
  }

  /**
   * Release agent from current task
   */
  releaseAgent(agentId: string): Agent | undefined {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = AgentStatus.IDLE;
      agent.currentTaskId = null;
      agent.updatedAt = new Date();
      this.agents.set(agentId, agent);
    }
    return agent;
  }

  /**
   * Remove an agent
   */
  removeAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  /**
   * Get agent count
   */
  getAgentCount(): number {
    return this.agents.size;
  }
}
