/**
 * Agent Task Assignment Types
 * 
 * Type definitions for the agent task assignment system.
 */

/**
 * Agent status enum
 */
export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

/**
 * Task status enum
 */
export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Task priority enum
 */
export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

/**
 * Agent interface
 */
export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  capabilities: string[];
  currentTaskId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task interface
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  requiredCapabilities: string[];
  assignedAgentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

/**
 * Task assignment result
 */
export interface TaskAssignmentResult {
  success: boolean;
  task: Task;
  agent: Agent | null;
  message: string;
}
