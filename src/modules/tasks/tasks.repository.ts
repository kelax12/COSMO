export interface Task {
  id: string;
  name: string;
  priority: number;
  category: string;
  deadline: string;
  estimatedTime: number;
  createdAt?: string;
  bookmarked: boolean;
  completed: boolean;
  completedAt?: string;
  isCollaborative?: boolean;
  collaborators?: string[];
  pendingInvites?: string[];
  collaboratorValidations?: Record<string, boolean>;
  userId?: string;
}

export interface ITasksRepository {
  fetchTasks(): Promise<Task[]>;
  createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
