import { TaskManager } from './task-manager';
import { TaskStatus, TaskPriority } from './types';

describe('TaskManager', () => {
  let taskManager: TaskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  describe('createTask', () => {
    it('should create a task with correct properties', () => {
      const task = taskManager.createTask(
        'Test Task',
        'A test task description',
        TaskPriority.HIGH,
        ['code']
      );

      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('A test task description');
      expect(task.priority).toBe(TaskPriority.HIGH);
      expect(task.requiredCapabilities).toEqual(['code']);
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.assignedAgentId).toBeNull();
      expect(task.id).toBeDefined();
    });

    it('should use default values when not provided', () => {
      const task = taskManager.createTask('Simple Task', 'Description');

      expect(task.priority).toBe(TaskPriority.MEDIUM);
      expect(task.requiredCapabilities).toEqual([]);
    });

    it('should generate unique IDs', () => {
      const task1 = taskManager.createTask('Task 1', 'Desc');
      const task2 = taskManager.createTask('Task 2', 'Desc');

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('getTask', () => {
    it('should return task by ID', () => {
      const created = taskManager.createTask('Task', 'Desc');
      const retrieved = taskManager.getTask(created.id);

      expect(retrieved).toEqual(created);
    });

    it('should return undefined for non-existent ID', () => {
      const result = taskManager.getTask('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getPendingTasks', () => {
    it('should return only pending tasks sorted by priority', () => {
      taskManager.createTask('Low', 'Desc', TaskPriority.LOW);
      taskManager.createTask('High', 'Desc', TaskPriority.HIGH);
      taskManager.createTask('Medium', 'Desc', TaskPriority.MEDIUM);

      const pending = taskManager.getPendingTasks();

      expect(pending).toHaveLength(3);
      expect(pending[0].title).toBe('High');
      expect(pending[1].title).toBe('Medium');
      expect(pending[2].title).toBe('Low');
    });

    it('should not include non-pending tasks', () => {
      const task = taskManager.createTask('Task', 'Desc');
      taskManager.assignTask(task.id, 'agent-1');

      const pending = taskManager.getPendingTasks();
      expect(pending).toHaveLength(0);
    });
  });

  describe('assignTask', () => {
    it('should assign task to agent', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const assigned = taskManager.assignTask(task.id, 'agent-123');

      expect(assigned?.status).toBe(TaskStatus.ASSIGNED);
      expect(assigned?.assignedAgentId).toBe('agent-123');
    });

    it('should not assign non-pending task', () => {
      const task = taskManager.createTask('Task', 'Desc');
      taskManager.assignTask(task.id, 'agent-1');
      const result = taskManager.assignTask(task.id, 'agent-2');

      expect(result).toBeUndefined();
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const updated = taskManager.updateTaskStatus(task.id, TaskStatus.IN_PROGRESS);

      expect(updated?.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('should set completedAt when status is COMPLETED', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const completed = taskManager.updateTaskStatus(task.id, TaskStatus.COMPLETED);

      expect(completed?.completedAt).not.toBeNull();
    });
  });

  describe('startTask', () => {
    it('should mark task as in progress', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const started = taskManager.startTask(task.id);

      expect(started?.status).toBe(TaskStatus.IN_PROGRESS);
    });
  });

  describe('completeTask', () => {
    it('should mark task as completed with timestamp', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const completed = taskManager.completeTask(task.id);

      expect(completed?.status).toBe(TaskStatus.COMPLETED);
      expect(completed?.completedAt).toBeDefined();
    });
  });

  describe('failTask', () => {
    it('should mark task as failed', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const failed = taskManager.failTask(task.id);

      expect(failed?.status).toBe(TaskStatus.FAILED);
    });
  });

  describe('unassignTask', () => {
    it('should unassign task and set to pending', () => {
      const task = taskManager.createTask('Task', 'Desc');
      taskManager.assignTask(task.id, 'agent-1');
      const unassigned = taskManager.unassignTask(task.id);

      expect(unassigned?.status).toBe(TaskStatus.PENDING);
      expect(unassigned?.assignedAgentId).toBeNull();
    });
  });

  describe('removeTask', () => {
    it('should remove task', () => {
      const task = taskManager.createTask('Task', 'Desc');
      const result = taskManager.removeTask(task.id);

      expect(result).toBe(true);
      expect(taskManager.getTask(task.id)).toBeUndefined();
    });
  });
});
