import { AgentManager } from './agent-manager';
import { AgentStatus } from './types';

describe('AgentManager', () => {
  let agentManager: AgentManager;

  beforeEach(() => {
    agentManager = new AgentManager();
  });

  describe('registerAgent', () => {
    it('should register a new agent with correct properties', () => {
      const agent = agentManager.registerAgent('Agent-1', ['code', 'review']);

      expect(agent.name).toBe('Agent-1');
      expect(agent.capabilities).toEqual(['code', 'review']);
      expect(agent.status).toBe(AgentStatus.IDLE);
      expect(agent.currentTaskId).toBeNull();
      expect(agent.id).toBeDefined();
    });

    it('should generate unique IDs for agents', () => {
      const agent1 = agentManager.registerAgent('Agent-1', []);
      const agent2 = agentManager.registerAgent('Agent-2', []);

      expect(agent1.id).not.toBe(agent2.id);
    });
  });

  describe('getAgent', () => {
    it('should return agent by ID', () => {
      const registered = agentManager.registerAgent('Agent-1', []);
      const retrieved = agentManager.getAgent(registered.id);

      expect(retrieved).toEqual(registered);
    });

    it('should return undefined for non-existent ID', () => {
      const result = agentManager.getAgent('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllAgents', () => {
    it('should return all registered agents', () => {
      agentManager.registerAgent('Agent-1', []);
      agentManager.registerAgent('Agent-2', []);

      const agents = agentManager.getAllAgents();
      expect(agents).toHaveLength(2);
    });

    it('should return empty array when no agents', () => {
      const agents = agentManager.getAllAgents();
      expect(agents).toEqual([]);
    });
  });

  describe('getAvailableAgents', () => {
    it('should return only idle agents', () => {
      const agent1 = agentManager.registerAgent('Agent-1', []);
      agentManager.registerAgent('Agent-2', []);
      agentManager.updateAgentStatus(agent1.id, AgentStatus.BUSY);

      const available = agentManager.getAvailableAgents();
      expect(available).toHaveLength(1);
      expect(available[0].name).toBe('Agent-2');
    });
  });

  describe('getAgentsWithCapabilities', () => {
    it('should return agents with all required capabilities', () => {
      agentManager.registerAgent('Agent-1', ['code', 'review', 'test']);
      agentManager.registerAgent('Agent-2', ['code']);

      const capable = agentManager.getAgentsWithCapabilities(['code', 'review']);
      expect(capable).toHaveLength(1);
      expect(capable[0].name).toBe('Agent-1');
    });

    it('should return empty array if no agents match', () => {
      agentManager.registerAgent('Agent-1', ['code']);

      const capable = agentManager.getAgentsWithCapabilities(['review']);
      expect(capable).toHaveLength(0);
    });
  });

  describe('assignTaskToAgent', () => {
    it('should assign task to idle agent', () => {
      const agent = agentManager.registerAgent('Agent-1', []);
      const result = agentManager.assignTaskToAgent(agent.id, 'task-123');

      expect(result).toBeDefined();
      expect(result?.status).toBe(AgentStatus.BUSY);
      expect(result?.currentTaskId).toBe('task-123');
    });

    it('should not assign task to busy agent', () => {
      const agent = agentManager.registerAgent('Agent-1', []);
      agentManager.assignTaskToAgent(agent.id, 'task-1');
      const result = agentManager.assignTaskToAgent(agent.id, 'task-2');

      expect(result).toBeUndefined();
    });
  });

  describe('releaseAgent', () => {
    it('should release agent and clear task', () => {
      const agent = agentManager.registerAgent('Agent-1', []);
      agentManager.assignTaskToAgent(agent.id, 'task-123');
      const released = agentManager.releaseAgent(agent.id);

      expect(released?.status).toBe(AgentStatus.IDLE);
      expect(released?.currentTaskId).toBeNull();
    });
  });

  describe('removeAgent', () => {
    it('should remove agent from registry', () => {
      const agent = agentManager.registerAgent('Agent-1', []);
      const result = agentManager.removeAgent(agent.id);

      expect(result).toBe(true);
      expect(agentManager.getAgent(agent.id)).toBeUndefined();
    });

    it('should return false for non-existent agent', () => {
      const result = agentManager.removeAgent('non-existent');
      expect(result).toBe(false);
    });
  });
});
