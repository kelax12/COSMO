"// ═══════════════════════════════════════════════════════════════════
// HABITS MODULE - Public API
// ═══════════════════════════════════════════════════════════════════

// Types
export type { Habit, CreateHabitInput, UpdateHabitInput } from './types';

// Constants
export { habitKeys, HABITS_STORAGE_KEY } from './constants';

// Repository interface
export type { IHabitsRepository } from './habits.repository';

// Repository implementations
export { LocalStorageHabitsRepository } from './local.repository';
export { SupabaseHabitsRepository } from './supabase.repository';

// React Query hooks
export {
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useToggleHabitCompletion,
} from './hooks';
"
