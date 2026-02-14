// Types
export type { Habit, CreateHabitInput, UpdateHabitInput } from './habits.types';

// Repository interface
export type { IHabitsRepository } from './habits.repository';

// Repository implementations
export { LocalStorageHabitsRepository } from './local.repository';
export { SupabaseHabitsRepository } from './supabase.repository';

// React Query hooks
export {
  habitKeys,
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useToggleHabitCompletion,
} from './habits.hooks';
