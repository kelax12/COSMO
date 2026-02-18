import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LocalStorageHabitsRepository } from './local.repository';
import { IHabitsRepository } from './habits.repository';
import { Habit, CreateHabitInput, UpdateHabitInput } from './habits.types';

// Query keys for cache management
export const habitKeys = {
  all: ['habits'] as const,
  lists: () => [...habitKeys.all, 'list'] as const,
  detail: (id: string) => [...habitKeys.all, 'detail', id] as const,
};

// Repository factory - Default to Local Storage for demo mode
const useHabitsRepository = (): IHabitsRepository => {
  return useMemo(() => new LocalStorageHabitsRepository(), []);
};

/**
 * Fetch all habits
 */
export const useHabits = () => {
  const repository = useHabitsRepository();
  return useQuery({
    queryKey: habitKeys.lists(),
    queryFn: () => repository.fetchHabits(),
  });
};

/**
 * Create a new habit
 */
export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  const repository = useHabitsRepository();
  
  return useMutation({
    mutationFn: (input: CreateHabitInput) => repository.createHabit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

/**
 * Update an existing habit
 */
export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  const repository = useHabitsRepository();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateHabitInput }) =>
      repository.updateHabit(id, updates),
    onSuccess: (updatedHabit) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

/**
 * Delete a habit
 */
export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  const repository = useHabitsRepository();
  
  return useMutation({
    mutationFn: (id: string) => repository.deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

/**
 * Toggle habit completion for a specific date
 */
export const useToggleHabitCompletion = () => {
  const queryClient = useQueryClient();
  const repository = useHabitsRepository();
  
  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      repository.toggleCompletion(id, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

// Re-export types for convenience
export type { Habit, CreateHabitInput, UpdateHabitInput } from './habits.types';
