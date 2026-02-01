import { createTaskAssignmentSystem, TaskPriority } from './index';

describe('Task Assignment System Integration', () => {
  it('should create a complete task assignment system', () => {
    const system = createTaskAssignmentSystem();

    expect(system.agentManager).toBeDefined();
    expect(system.taskManager).toBeDefined();
    expect(system.taskAssigner).toBeDefined();
  });

  it('should support full workflow', () => {
    const { agentManager, taskManager, taskAssigner } = createTaskAssignmentSystem();

    // Register agents
    const agent1 = agentManager.registerAgent('Code Agent', ['code', 'review']);
    const agent2 = agentManager.registerAgent('Test Agent', ['test', 'qa']);

    // Create tasks
    const codeTask = taskManager.createTask(
      'Implement Feature',
      'Implement the new feature',
      TaskPriority.HIGH,
      ['code']
    );

    const testTask = taskManager.createTask(
      'Write Tests',
      'Write unit tests',
      TaskPriority.MEDIUM,
      ['test']
    );

    // Assign tasks
    const codeResult = taskAssigner.autoAssignTask(codeTask.id);
    const testResult = taskAssigner.autoAssignTask(testTask.id);

    expect(codeResult.success).toBe(true);
    expect(codeResult.agent?.name).toBe('Code Agent');

    expect(testResult.success).toBe(true);
    expect(testResult.agent?.name).toBe('Test Agent');

    // Get stats
    const stats = taskAssigner.getStats();
    expect(stats.busyAgents).toBe(2);
    expect(stats.assignedTasks).toBe(2);

    // Complete tasks
    taskAssigner.releaseAgentFromTask(agent1.id, true);
    taskAssigner.releaseAgentFromTask(agent2.id, true);

    const finalStats = taskAssigner.getStats();
    expect(finalStats.availableAgents).toBe(2);
    expect(finalStats.completedTasks).toBe(2);
  });
});
