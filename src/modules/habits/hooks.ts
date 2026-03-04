"import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabitsRepository } from '@/lib/repository.factory';
import { IHabitsRepository } from './repository';
import { CreateHabitInput, UpdateHabitInput } from './types';
import { habitKeys } from './constants';

// Repository - Via centralized factory (demo/production mode)
const useHabitsRepository = (): IHabitsRepository => {
  return useMemo(() => getHabitsRepository(), []);
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
 * Fetch a single habit by ID
 */
export const useHabit = (id: string) => {
  const repository = useHabitsRepository();
  return useQuery({
    queryKey: habitKeys.detail(id),
    queryFn: () => repository.getById(id),
    enabled: !!id,
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
    onSuccess: () => {
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
export type { Habit, CreateHabitInput, UpdateHabitInput } from './types';
"
