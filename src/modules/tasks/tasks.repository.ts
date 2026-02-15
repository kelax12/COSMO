import { Task, TaskFilters } from './tasks.types';

/**
 * Interface for Tasks Repository
 * Phase 1: READ-ONLY operations
 * Phase 2: Will add create/update/delete
 */
export interface ITasksRepository {
  // ═══════════════════════════════════════════════════════════════════
  // READ OPERATIONS (Phase 1)
  // ═══════════════════════════════════════════════════════════════════
  
  /**
   * Fetch all tasks
   */
  getAll(): Promise<Task[]>;
  
  /**
   * Fetch a single task by ID
   */
  getById(id: string): Promise<Task | null>;
  
  /**
   * Fetch tasks by date (deadline)
   */
  getByDate(date: string): Promise<Task[]>;
  
  /**
   * Fetch tasks with filters
   */
  getFiltered(filters: TaskFilters): Promise<Task[]>;

  // ═══════════════════════════════════════════════════════════════════
  // WRITE OPERATIONS (Phase 2 - À implémenter plus tard)
  // ═══════════════════════════════════════════════════════════════════
  // createTask(task: CreateTaskInput): Promise<Task>;
  // updateTask(id: string, updates: UpdateTaskInput): Promise<Task>;
  // deleteTask(id: string): Promise<void>;
  // toggleComplete(id: string): Promise<Task>;
  // toggleBookmark(id: string): Promise<Task>;
}
