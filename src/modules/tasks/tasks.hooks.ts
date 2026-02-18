import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocalStorageTasksRepository } from './local.repository';
import { ITasksRepository } from './tasks.repository';
import { Task, TaskFilters } from './tasks.types';

// ═══════════════════════════════════════════════════════════════════
// Query Keys
// ═══════════════════════════════════════════════════════════════════
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  byDate: (date: string) => [...taskKeys.all, 'date', date] as const,
};

// ═══════════════════════════════════════════════════════════════════
// Repository Factory - Default to Local Storage for demo mode
// ═══════════════════════════════════════════════════════════════════
const useTasksRepository = (): ITasksRepository => {
  // Use LocalStorage by default (demo mode)
  return useMemo(() => new LocalStorageTasksRepository(), []);
};
// ═══════════════════════════════════════════════════════════════════
// READ HOOKS (Phase 1)
// ═══════════════════════════════════════════════════════════════════

/**
 * Fetch all tasks
 */
export const useTasks = (options?: { enabled?: boolean }) => {
  const repository = useTasksRepository();
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: () => repository.getAll(),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Fetch a single task by ID
 */
export const useTask = (id: string, options?: { enabled?: boolean }) => {
  const repository = useTasksRepository();
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => repository.getById(id),
    enabled: (options?.enabled ?? true) && !!id,
  });
};

/**
 * Fetch tasks by date (deadline)
 */
export const useTasksByDate = (date: string, options?: { enabled?: boolean }) => {
  const repository = useTasksRepository();
  return useQuery({
    queryKey: taskKeys.byDate(date),
    queryFn: () => repository.getByDate(date),
    enabled: (options?.enabled ?? true) && !!date,
  });
};

/**
 * Fetch tasks with filters
 */
export const useFilteredTasks = (filters: TaskFilters, options?: { enabled?: boolean }) => {
  const repository = useTasksRepository();
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => repository.getFiltered(filters),
    enabled: options?.enabled ?? true,
  });
};

// ═══════════════════════════════════════════════════════════════════
// Computed Hooks (derived data)
// ═══════════════════════════════════════════════════════════════════

/**
 * Get today's tasks
 */
export const useTodaysTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  return useTasksByDate(today);
};

/**
 * Get pending tasks (not completed)
 */
export const usePendingTasks = () => {
  return useFilteredTasks({ completed: false });
};

/**
 * Get bookmarked tasks
 */
export const useBookmarkedTasks = () => {
  return useFilteredTasks({ bookmarked: true });
};

/**
 * Get completed tasks
 */
export const useCompletedTasks = () => {
  return useFilteredTasks({ completed: true });
};

// Re-export types
export type { Task, TaskFilters } from './tasks.types';
