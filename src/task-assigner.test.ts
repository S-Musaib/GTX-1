import { AgentManager } from './agent-manager';
import { TaskManager } from './task-manager';
import { TaskAssigner } from './task-assigner';
import { TaskPriority, TaskStatus, AgentStatus } from './types';

describe('TaskAssigner', () => {
  let agentManager: AgentManager;
  let taskManager: TaskManager;
  let taskAssigner: TaskAssigner;

  beforeEach(() => {
    agentManager = new AgentManager();
    taskManager = new TaskManager();
    taskAssigner = new TaskAssigner(agentManager, taskManager);
  });

  describe('assignTaskToAgent', () => {
    it('should successfully assign task to capable agent', () => {
      const agent = agentManager.registerAgent('Agent-1', ['code', 'review']);
      const task = taskManager.createTask('Task', 'Desc', TaskPriority.HIGH, ['code']);

      const result = taskAssigner.assignTaskToAgent(task.id, agent.id);

      expect(result.success).toBe(true);
      expect(result.task.status).toBe(TaskStatus.ASSIGNED);
      expect(result.task.assignedAgentId).toBe(agent.id);
      expect(result.agent?.status).toBe(AgentStatus.BUSY);
      expect(result.agent?.currentTaskId).toBe(task.id);
    });

    it('should fail if task not found', () => {
      const agent = agentManager.registerAgent('Agent-1', []);
      const result = taskAssigner.assignTaskToAgent('non-existent', agent.id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });

    it('should fail if agent not found', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const result = taskAssigner.assignTaskToAgent(task.id, 'non-existent');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });

    it('should fail if task is not pending', () => {
      const agent = agentManager.registerAgent('Agent-1', []);
      const task = taskManager.createTask('Task', 'Desc');
      taskManager.startTask(task.id);

      const result = taskAssigner.assignTaskToAgent(task.id, agent.id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('not in pending status');
    });

    it('should fail if agent is not available', () => {
      const agent = agentManager.registerAgent('Agent-1', []);
      agentManager.updateAgentStatus(agent.id, AgentStatus.BUSY);
      const task = taskManager.createTask('Task', 'Desc');

      const result = taskAssigner.assignTaskToAgent(task.id, agent.id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('not available');
    });

    it('should fail if agent lacks required capabilities', () => {
      const agent = agentManager.registerAgent('Agent-1', ['code']);
      const task = taskManager.createTask('Task', 'Desc', TaskPriority.HIGH, ['review']);

      const result = taskAssigner.assignTaskToAgent(task.id, agent.id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('lacks required capabilities');
    });
  });

  describe('autoAssignTask', () => {
    it('should automatically assign task to best available agent', () => {
      agentManager.registerAgent('Agent-1', ['code', 'review']);
      const task = taskManager.createTask('Task', 'Desc', TaskPriority.HIGH, ['code']);

      const result = taskAssigner.autoAssignTask(task.id);

      expect(result.success).toBe(true);
      expect(result.task.status).toBe(TaskStatus.ASSIGNED);
    });

    it('should fail if no agent has required capabilities', () => {
      agentManager.registerAgent('Agent-1', ['code']);
      const task = taskManager.createTask('Task', 'Desc', TaskPriority.HIGH, ['review']);

      const result = taskAssigner.autoAssignTask(task.id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('No available agent');
    });

    it('should fail if task not found', () => {
      const result = taskAssigner.autoAssignTask('non-existent');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });
  });

  describe('processPendingTasks', () => {
    it('should process multiple pending tasks', () => {
      agentManager.registerAgent('Agent-1', ['code']);
      agentManager.registerAgent('Agent-2', ['code']);
      taskManager.createTask('Task 1', 'Desc', TaskPriority.HIGH, ['code']);
      taskManager.createTask('Task 2', 'Desc', TaskPriority.LOW, ['code']);

      const results = taskAssigner.processPendingTasks();

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });

    it('should stop when no agents available', () => {
      agentManager.registerAgent('Agent-1', ['code']);
      taskManager.createTask('Task 1', 'Desc', TaskPriority.HIGH, ['code']);
      taskManager.createTask('Task 2', 'Desc', TaskPriority.LOW, ['code']);
      taskManager.createTask('Task 3', 'Desc', TaskPriority.MEDIUM, ['code']);

      const results = taskAssigner.processPendingTasks();

      // Should process first task, fail on second due to no agents
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].success).toBe(true);
    });

    it('should process tasks in priority order', () => {
      agentManager.registerAgent('Agent-1', ['code']);
      const lowTask = taskManager.createTask('Low', 'Desc', TaskPriority.LOW, ['code']);
      const highTask = taskManager.createTask('High', 'Desc', TaskPriority.HIGH, ['code']);

      const results = taskAssigner.processPendingTasks();

      // High priority task should be assigned first
      expect(results[0].task.title).toBe('High');
    });
  });

  describe('releaseAgentFromTask', () => {
    it('should release agent and complete task', () => {
      const agent = agentManager.registerAgent('Agent-1', ['code']);
      const task = taskManager.createTask('Task', 'Desc', TaskPriority.HIGH, ['code']);
      taskAssigner.assignTaskToAgent(task.id, agent.id);

      const result = taskAssigner.releaseAgentFromTask(agent.id, true);

      expect(result).toBe(true);
      expect(agentManager.getAgent(agent.id)?.status).toBe(AgentStatus.IDLE);
      expect(taskManager.getTask(task.id)?.status).toBe(TaskStatus.COMPLETED);
    });

    it('should release agent without completing task', () => {
      const agent = agentManager.registerAgent('Agent-1', ['code']);
      const task = taskManager.createTask('Task', 'Desc', TaskPriority.HIGH, ['code']);
      taskAssigner.assignTaskToAgent(task.id, agent.id);

      const result = taskAssigner.releaseAgentFromTask(agent.id, false);

      expect(result).toBe(true);
      expect(taskManager.getTask(task.id)?.status).toBe(TaskStatus.PENDING);
    });

    it('should return false if agent not found', () => {
      const result = taskAssigner.releaseAgentFromTask('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      agentManager.registerAgent('Agent-1', ['code']);
      agentManager.registerAgent('Agent-2', ['code']);
      const task1 = taskManager.createTask('Task 1', 'Desc');
      const task2 = taskManager.createTask('Task 2', 'Desc');
      taskManager.createTask('Task 3', 'Desc');
      
      taskAssigner.autoAssignTask(task1.id);
      taskManager.completeTask(task2.id);

      const stats = taskAssigner.getStats();

      expect(stats.totalAgents).toBe(2);
      expect(stats.availableAgents).toBe(1);
      expect(stats.busyAgents).toBe(1);
      expect(stats.totalTasks).toBe(3);
      expect(stats.pendingTasks).toBe(1);
      expect(stats.assignedTasks).toBe(1);
      expect(stats.completedTasks).toBe(1);
    });
  });
});
