/**
 * Task Manager
 * 
 * Manages tasks and their lifecycle.
 */

import { Task, TaskStatus, TaskPriority } from './types';

/**
 * Generates a unique ID
 */
function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * TaskManager class for managing tasks
 */
export class TaskManager {
  private tasks: Map<string, Task> = new Map();

  /**
   * Create a new task
   */
  createTask(
    title: string,
    description: string,
    priority: TaskPriority = TaskPriority.MEDIUM,
    requiredCapabilities: string[] = []
  ): Task {
    const now = new Date();
    const task: Task = {
      id: generateId(),
      title,
      description,
      status: TaskStatus.PENDING,
      priority,
      requiredCapabilities,
      assignedAgentId: null,
      createdAt: now,
      updatedAt: now,
      completedAt: null
    };
    
    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Get a task by ID
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get pending tasks sorted by priority
   */
  getPendingTasks(): Task[] {
    return this.getAllTasks()
      .filter(task => task.status === TaskStatus.PENDING)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.getAllTasks().filter(task => task.status === status);
  }

  /**
   * Assign task to an agent
   */
  assignTask(taskId: string, agentId: string): Task | undefined {
    const task = this.tasks.get(taskId);
    if (task && task.status === TaskStatus.PENDING) {
      task.status = TaskStatus.ASSIGNED;
      task.assignedAgentId = agentId;
      task.updatedAt = new Date();
      this.tasks.set(taskId, task);
      return task;
    }
    return undefined;
  }

  /**
   * Update task status
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Task | undefined {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date();
      if (status === TaskStatus.COMPLETED) {
        task.completedAt = new Date();
      }
      this.tasks.set(taskId, task);
    }
    return task;
  }

  /**
   * Mark task as in progress
   */
  startTask(taskId: string): Task | undefined {
    return this.updateTaskStatus(taskId, TaskStatus.IN_PROGRESS);
  }

  /**
   * Mark task as completed
   */
  completeTask(taskId: string): Task | undefined {
    return this.updateTaskStatus(taskId, TaskStatus.COMPLETED);
  }

  /**
   * Mark task as failed
   */
  failTask(taskId: string): Task | undefined {
    return this.updateTaskStatus(taskId, TaskStatus.FAILED);
  }

  /**
   * Unassign task from agent
   */
  unassignTask(taskId: string): Task | undefined {
    const task = this.tasks.get(taskId);
    if (task && task.status === TaskStatus.ASSIGNED) {
      task.status = TaskStatus.PENDING;
      task.assignedAgentId = null;
      task.updatedAt = new Date();
      this.tasks.set(taskId, task);
    }
    return task;
  }

  /**
   * Remove a task
   */
  removeTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  /**
   * Get task count
   */
  getTaskCount(): number {
    return this.tasks.size;
  }
}
