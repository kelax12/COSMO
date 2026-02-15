import { supabase } from '@/lib/supabase';
import { normalizeApiError } from '@/lib/normalizeApiError';
import { ITasksRepository } from './tasks.repository';
import { Task, TaskFilters } from './tasks.types';

export class SupabaseTasksRepository implements ITasksRepository {
  // ═══════════════════════════════════════════════════════════════════
  // READ OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapFromDb);
  }

  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw normalizeApiError(error);
    }
    return data ? this.mapFromDb(data) : null;
  }

  async getByDate(date: string): Promise<Task[]> {
    const targetDate = date.split('T')[0];
    const startOfDay = `${targetDate}T00:00:00.000Z`;
    const endOfDay = `${targetDate}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('deadline', startOfDay)
      .lte('deadline', endOfDay)
      .order('deadline', { ascending: true });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapFromDb);
  }

  async getFiltered(filters: TaskFilters): Promise<Task[]> {
    let query = supabase.from('tasks').select('*');

    if (filters.completed !== undefined) {
      query = query.eq('completed', filters.completed);
    }

    if (filters.bookmarked !== undefined) {
      query = query.eq('bookmarked', filters.bookmarked);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.priorityMin !== undefined) {
      query = query.gte('priority', filters.priorityMin);
    }

    if (filters.priorityMax !== undefined) {
      query = query.lte('priority', filters.priorityMax);
    }

    if (filters.deadlineBefore) {
      query = query.lte('deadline', filters.deadlineBefore);
    }

    if (filters.deadlineAfter) {
      query = query.gte('deadline', filters.deadlineAfter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapFromDb);
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAPPING (snake_case <-> camelCase)
  // ═══════════════════════════════════════════════════════════════════

  private mapFromDb(row: any): Task {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      priority: row.priority,
      category: row.category,
      deadline: row.deadline,
      estimatedTime: row.estimated_time,
      createdAt: row.created_at,
      bookmarked: row.bookmarked ?? false,
      completed: row.completed ?? false,
      completedAt: row.completed_at,
      isCollaborative: row.is_collaborative ?? false,
      collaborators: row.collaborators || [],
      pendingInvites: row.pending_invites || [],
      collaboratorValidations: row.collaborator_validations || {},
      userId: row.user_id,
    };
  }
}
