// ═══════════════════════════════════════════════════════════════════
// TASKS MODULE - Public API
// ═══════════════════════════════════════════════════════════════════

// Types
export type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from './tasks.types';

// Repository interface
export type { ITasksRepository } from './tasks.repository';

// Repository implementations
export { LocalStorageTasksRepository } from './local.repository';
export { SupabaseTasksRepository } from './supabase.repository';

// Query keys (for cache management)
export { taskKeys } from './tasks.hooks';

// ═══════════════════════════════════════════════════════════════════
// READ HOOKS (Phase 1)
// ═══════════════════════════════════════════════════════════════════
export {
  useTasks,
  useTask,
  useTasksByDate,
  useFilteredTasks,
  useTodaysTasks,
  usePendingTasks,
  useBookmarkedTasks,
  useCompletedTasks,
} from './tasks.hooks';

// ═══════════════════════════════════════════════════════════════════
// WRITE HOOKS (Phase 2 - À implémenter)
// ═══════════════════════════════════════════════════════════════════
// export { useCreateTask } from './tasks.hooks';
// export { useUpdateTask } from './tasks.hooks';
// export { useDeleteTask } from './tasks.hooks';
// export { useToggleTaskComplete } from './tasks.hooks';
// export { useToggleTaskBookmark } from './tasks.hooks';
