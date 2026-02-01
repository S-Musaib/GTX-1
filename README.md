# GTX-1 Agent Task Assignment System

A TypeScript-based system for assigning tasks to agents based on availability and capabilities. Part of the GTX-1 AI assistant platform.

## Features

- **Agent Management**: Register, track, and manage agents with different capabilities
- **Task Management**: Create, prioritize, and track tasks through their lifecycle
- **Smart Assignment**: Automatically assign tasks to agents based on capabilities and availability
- **Priority Queue**: Tasks are processed in priority order
- **Statistics**: Get real-time statistics on agents and tasks

## Installation

```bash
npm install
```

## Usage

### Quick Start

```typescript
import { createTaskAssignmentSystem, TaskPriority } from './src';

// Create the system
const { agentManager, taskManager, taskAssigner } = createTaskAssignmentSystem();

// Register an agent with capabilities
const agent = agentManager.registerAgent('Code Agent', ['code', 'review', 'test']);

// Create a task
const task = taskManager.createTask(
  'Implement Feature',
  'Implement the new authentication feature',
  TaskPriority.HIGH,
  ['code']
);

// Automatically assign the task to the best available agent
const result = taskAssigner.autoAssignTask(task.id);

if (result.success) {
  console.log(`Task assigned to ${result.agent?.name}`);
}

// When done, release the agent
taskAssigner.releaseAgentFromTask(agent.id, true);
```

### Agent Management

```typescript
import { AgentManager } from './src';

const agentManager = new AgentManager();

// Register agents
const agent = agentManager.registerAgent('My Agent', ['capability1', 'capability2']);

// Get available agents
const available = agentManager.getAvailableAgents();

// Get agents with specific capabilities
const capable = agentManager.getAgentsWithCapabilities(['code', 'review']);

// Update agent status
agentManager.updateAgentStatus(agent.id, AgentStatus.OFFLINE);
```

### Task Management

```typescript
import { TaskManager, TaskPriority } from './src';

const taskManager = new TaskManager();

// Create tasks with different priorities
const task = taskManager.createTask(
  'Task Title',
  'Task description',
  TaskPriority.HIGH,
  ['required', 'capabilities']
);

// Get pending tasks (sorted by priority)
const pending = taskManager.getPendingTasks();

// Update task status
taskManager.startTask(task.id);
taskManager.completeTask(task.id);
```

### Task Assignment

```typescript
import { AgentManager, TaskManager, TaskAssigner } from './src';

const agentManager = new AgentManager();
const taskManager = new TaskManager();
const taskAssigner = new TaskAssigner(agentManager, taskManager);

// Manual assignment
const result = taskAssigner.assignTaskToAgent(taskId, agentId);

// Auto assignment
const autoResult = taskAssigner.autoAssignTask(taskId);

// Process all pending tasks
const results = taskAssigner.processPendingTasks();

// Get statistics
const stats = taskAssigner.getStats();
console.log(`Available agents: ${stats.availableAgents}`);
console.log(`Pending tasks: ${stats.pendingTasks}`);
```

## API Reference

### Types

- `AgentStatus`: IDLE | BUSY | OFFLINE
- `TaskStatus`: PENDING | ASSIGNED | IN_PROGRESS | COMPLETED | FAILED
- `TaskPriority`: LOW (1) | MEDIUM (2) | HIGH (3) | CRITICAL (4)

### AgentManager

| Method | Description |
|--------|-------------|
| `registerAgent(name, capabilities)` | Register a new agent |
| `getAgent(id)` | Get agent by ID |
| `getAllAgents()` | Get all agents |
| `getAvailableAgents()` | Get idle agents |
| `getAgentsWithCapabilities(caps)` | Get agents with capabilities |
| `updateAgentStatus(id, status)` | Update agent status |
| `assignTaskToAgent(agentId, taskId)` | Assign task to agent |
| `releaseAgent(id)` | Release agent from task |
| `removeAgent(id)` | Remove agent |

### TaskManager

| Method | Description |
|--------|-------------|
| `createTask(title, desc, priority, caps)` | Create a new task |
| `getTask(id)` | Get task by ID |
| `getAllTasks()` | Get all tasks |
| `getPendingTasks()` | Get pending tasks (sorted by priority) |
| `getTasksByStatus(status)` | Get tasks by status |
| `assignTask(taskId, agentId)` | Assign task |
| `updateTaskStatus(id, status)` | Update task status |
| `startTask(id)` | Mark as in progress |
| `completeTask(id)` | Mark as completed |
| `failTask(id)` | Mark as failed |
| `unassignTask(id)` | Unassign task |
| `removeTask(id)` | Remove task |

### TaskAssigner

| Method | Description |
|--------|-------------|
| `assignTaskToAgent(taskId, agentId)` | Manual assignment |
| `autoAssignTask(taskId)` | Auto assignment |
| `processPendingTasks()` | Process task queue |
| `releaseAgentFromTask(agentId, complete)` | Release agent |
| `getStats()` | Get statistics |

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## License

MIT
