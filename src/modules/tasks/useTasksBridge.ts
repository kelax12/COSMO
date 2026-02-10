/**
 * Bridge Hook: useTasksBridge
 * 
 * Ce hook expose la même API que useTasks() legacy du TaskContext
 * mais utilise les hooks React Query modernes en arrière-plan.
 * 
 * Permet une migration incrémentale des composants.
 */
import { useTasksQuery, useCreateTask, useUpdateTask, useDeleteTask, useToggleComplete, useToggleBookmark } from './tasks.hooks';
import { Task } from './tasks.repository';

export interface UseTasksBridgeReturn {
  // Data
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  
  // Mutations
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

export const useTasksBridge = (): UseTasksBridgeReturn => {
  // Query
  const { data: tasks = [], isLoading, error } = useTasksQuery();
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleCompleteMutation = useToggleComplete();
  const toggleBookmarkMutation = useToggleBookmark();

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    return createTaskMutation.mutateAsync(task);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({ id, updates });
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const toggleComplete = (id: string) => {
    toggleCompleteMutation.mutate(id);
  };

  const toggleBookmark = (id: string) => {
    toggleBookmarkMutation.mutate(id);
  };

  return {
    tasks,
    isLoading,
    error: error as Error | null,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleBookmark,
  };
};

export default useTasksBridge;
