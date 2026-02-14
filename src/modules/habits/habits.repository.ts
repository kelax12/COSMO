import { Habit, CreateHabitInput, UpdateHabitInput } from './habits.types';

export interface IHabitsRepository {
  fetchHabits(): Promise<Habit[]>;
  createHabit(habit: CreateHabitInput): Promise<Habit>;
  updateHabit(id: string, updates: UpdateHabitInput): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;
  toggleCompletion(id: string, date: string): Promise<Habit>;
}
