/**
 * Task Assigner
 * 
 * Handles the assignment of tasks to agents based on availability and capabilities.
 */

import { AgentManager } from './agent-manager';
import { TaskManager } from './task-manager';
import { Agent, Task, TaskAssignmentResult, AgentStatus, TaskStatus, TaskPriority } from './types';

/**
 * TaskAssigner class for assigning tasks to agents
 */
export class TaskAssigner {
  private agentManager: AgentManager;
  private taskManager: TaskManager;

  constructor(agentManager: AgentManager, taskManager: TaskManager) {
    this.agentManager = agentManager;
    this.taskManager = taskManager;
  }

  /**
   * Find the best available agent for a task
   */
  private findBestAgent(task: Task): Agent | undefined {
    // Get available agents with required capabilities
    const availableAgents = this.agentManager.getAvailableAgents();
    
    // Filter agents that have all required capabilities
    const capableAgents = availableAgents.filter(agent =>
      task.requiredCapabilities.every(cap => agent.capabilities.includes(cap))
    );

    if (capableAgents.length === 0) {
      return undefined;
    }

    // Return the first capable agent (could be enhanced with more sophisticated selection)
    return capableAgents[0];
  }

  /**
   * Assign a specific task to a specific agent
   */
  assignTaskToAgent(taskId: string, agentId: string): TaskAssignmentResult {
    const task = this.taskManager.getTask(taskId);
    const agent = this.agentManager.getAgent(agentId);

    if (!task) {
      return {
        success: false,
        task: task as unknown as Task,
        agent: null,
        message: `Task with ID ${taskId} not found`
      };
    }

    if (!agent) {
      return {
        success: false,
        task,
        agent: null,
        message: `Agent with ID ${agentId} not found`
      };
    }

    if (task.status !== TaskStatus.PENDING) {
      return {
        success: false,
        task,
        agent,
        message: `Task is not in pending status (current: ${task.status})`
      };
    }

    if (agent.status !== AgentStatus.IDLE) {
      return {
        success: false,
        task,
        agent,
        message: `Agent is not available (current status: ${agent.status})`
      };
    }

    // Check if agent has required capabilities
    const hasCapabilities = task.requiredCapabilities.every(
      cap => agent.capabilities.includes(cap)
    );

    if (!hasCapabilities) {
      return {
        success: false,
        task,
        agent,
        message: `Agent lacks required capabilities: ${task.requiredCapabilities.join(', ')}`
      };
    }

    // Perform the assignment
    const updatedTask = this.taskManager.assignTask(taskId, agentId);
    const updatedAgent = this.agentManager.assignTaskToAgent(agentId, taskId);

    if (!updatedTask || !updatedAgent) {
      return {
        success: false,
        task,
        agent,
        message: 'Failed to complete assignment'
      };
    }

    return {
      success: true,
      task: updatedTask,
      agent: updatedAgent,
      message: `Task "${task.title}" assigned to agent "${agent.name}"`
    };
  }

  /**
   * Automatically assign a task to the best available agent
   */
  autoAssignTask(taskId: string): TaskAssignmentResult {
    const task = this.taskManager.getTask(taskId);

    if (!task) {
      return {
        success: false,
        task: task as unknown as Task,
        agent: null,
        message: `Task with ID ${taskId} not found`
      };
    }

    if (task.status !== TaskStatus.PENDING) {
      return {
        success: false,
        task,
        agent: null,
        message: `Task is not in pending status (current: ${task.status})`
      };
    }

    const bestAgent = this.findBestAgent(task);

    if (!bestAgent) {
      return {
        success: false,
        task,
        agent: null,
        message: 'No available agent with required capabilities'
      };
    }

    return this.assignTaskToAgent(taskId, bestAgent.id);
  }

  /**
   * Process pending tasks queue and assign to available agents
   */
  processPendingTasks(): TaskAssignmentResult[] {
    const results: TaskAssignmentResult[] = [];
    const pendingTasks = this.taskManager.getPendingTasks();

    for (const task of pendingTasks) {
      const result = this.autoAssignTask(task.id);
      results.push(result);
      
      // If assignment failed due to no agents, stop processing
      if (!result.success && result.message.includes('No available agent')) {
        break;
      }
    }

    return results;
  }

  /**
   * Release an agent from their current task
   */
  releaseAgentFromTask(agentId: string, markComplete: boolean = true): boolean {
    const agent = this.agentManager.getAgent(agentId);
    
    if (!agent || !agent.currentTaskId) {
      return false;
    }

    const taskId = agent.currentTaskId;
    
    // Update task status
    if (markComplete) {
      this.taskManager.completeTask(taskId);
    } else {
      this.taskManager.unassignTask(taskId);
    }

    // Release the agent
    this.agentManager.releaseAgent(agentId);
    
    return true;
  }

  /**
   * Get assignment statistics
   */
  getStats(): {
    totalAgents: number;
    availableAgents: number;
    busyAgents: number;
    totalTasks: number;
    pendingTasks: number;
    assignedTasks: number;
    completedTasks: number;
  } {
    const agents = this.agentManager.getAllAgents();
    const tasks = this.taskManager.getAllTasks();

    return {
      totalAgents: agents.length,
      availableAgents: agents.filter(a => a.status === AgentStatus.IDLE).length,
      busyAgents: agents.filter(a => a.status === AgentStatus.BUSY).length,
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === TaskStatus.PENDING).length,
      assignedTasks: tasks.filter(t => t.status === TaskStatus.ASSIGNED).length,
      completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length
    };
  }
}
