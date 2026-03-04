"// ═══════════════════════════════════════════════════════════════════
// TASKS MODULE - Public API
// ═══════════════════════════════════════════════════════════════════

// Types
export type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from './types';

// Constants
export { taskKeys, TASKS_STORAGE_KEY } from './constants';

// Repository interface
export type { ITasksRepository } from './tasks.repository';

// Repository implementations
export { LocalStorageTasksRepository } from './local.repository';
export { SupabaseTasksRepository } from './supabase.repository';

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
} from './hooks';

// ═══════════════════════════════════════════════════════════════════
// WRITE HOOKS (Phase 2)
// ═══════════════════════════════════════════════════════════════════
export {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleTaskComplete,
  useToggleTaskBookmark,
} from './hooks';
"
