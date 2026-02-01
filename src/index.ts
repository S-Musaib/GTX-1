/**
 * Agent Task Assignment System
 * 
 * A system for assigning tasks to agents based on availability and capabilities.
 */

// Export types
export {
  Agent,
  Task,
  AgentStatus,
  TaskStatus,
  TaskPriority,
  TaskAssignmentResult
} from './types';

// Export managers
export { AgentManager } from './agent-manager';
export { TaskManager } from './task-manager';
export { TaskAssigner } from './task-assigner';

// Convenience function to create a complete task assignment system
import { AgentManager } from './agent-manager';
import { TaskManager } from './task-manager';
import { TaskAssigner } from './task-assigner';

export interface TaskAssignmentSystem {
  agentManager: AgentManager;
  taskManager: TaskManager;
  taskAssigner: TaskAssigner;
}

/**
 * Create a new task assignment system
 */
export function createTaskAssignmentSystem(): TaskAssignmentSystem {
  const agentManager = new AgentManager();
  const taskManager = new TaskManager();
  const taskAssigner = new TaskAssigner(agentManager, taskManager);

  return {
    agentManager,
    taskManager,
    taskAssigner
  };
}
