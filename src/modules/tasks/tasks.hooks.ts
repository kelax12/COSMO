import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/AuthContext';
import { SupabaseTasksRepository } from './supabase.repository';
import { LocalStorageTasksRepository } from './local.repository';
import { Task } from './tasks.repository';

const useTasksRepository = () => {
  const { isDemo } = useAuth();
  return useMemo(
    () => (isDemo ? new LocalStorageTasksRepository() : new SupabaseTasksRepository()),
    [isDemo]
  );
};

export const useTasks = () => {
  const repository = useTasksRepository();
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => repository.fetchTasks(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const repository = useTasksRepository();
  return useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'createdAt'>) => repository.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const repository = useTasksRepository();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      repository.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const repository = useTasksRepository();
  return useMutation({
    mutationFn: (id: string) => repository.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
