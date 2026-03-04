"// ═══════════════════════════════════════════════════════════════════
// EVENTS MODULE - Supabase Repository Implementation
// ═══════════════════════════════════════════════════════════════════

import { supabase } from '@/lib/supabase';
import { normalizeApiError } from '@/lib/normalizeApiError';
import { IEventsRepository } from './repository';
import { CalendarEvent, CreateEventInput, UpdateEventInput, EventFilters } from './types';

/**
 * Supabase DB row type for events table (snake_case)
 */
interface EventRow {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color?: string;
  description?: string;
  notes?: string;
  task_id?: string;
  user_id?: string;
  created_at?: string;
}

/**
 * DB input type for insert/update operations (snake_case)
 */
interface EventDbInput {
  title?: string;
  start_time?: string;
  end_time?: string;
  color?: string;
  description?: string;
  notes?: string;
  task_id?: string;
  user_id?: string;
}

export class SupabaseEventsRepository implements IEventsRepository {
  // ═══════════════════════════════════════════════════════════════════
  // READ OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  async getAll(): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start', { ascending: true });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapFromDb);
  }

  async getById(id: string): Promise<CalendarEvent | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw normalizeApiError(error);
    }
    return data ? this.mapFromDb(data) : null;
  }

  async getByTaskId(taskId: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('task_id', taskId)
      .order('start', { ascending: true });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapFromDb);
  }

  async getFiltered(filters: EventFilters): Promise<CalendarEvent[]> {
    let query = supabase.from('events').select('*');

    if (filters.taskId) {
      query = query.eq('task_id', filters.taskId);
    }

    if (filters.startAfter) {
      query = query.gte('start', filters.startAfter);
    }

    if (filters.startBefore) {
      query = query.lte('start', filters.startBefore);
    }

    if (filters.endAfter) {
      query = query.gte('end', filters.endAfter);
    }

    if (filters.endBefore) {
      query = query.lte('end', filters.endBefore);
    }

    const { data, error } = await query.order('start', { ascending: true });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapFromDb);
  }

  // ═══════════════════════════════════════════════════════════════════
  // WRITE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  async create(input: CreateEventInput): Promise<CalendarEvent> {
    const dbInput = this.mapToDb(input);

    const { data, error } = await supabase
      .from('events')
      .insert([dbInput])
      .select()
      .single();

    if (error) throw normalizeApiError(error);
    return this.mapFromDb(data);
  }

  async update(id: string, updates: UpdateEventInput): Promise<CalendarEvent> {
    const dbUpdates = this.mapToDb(updates);

    const { data, error } = await supabase
      .from('events')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw normalizeApiError(error);
    return this.mapFromDb(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw normalizeApiError(error);
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAPPING (snake_case <-> camelCase)
  // ═══════════════════════════════════════════════════════════════════

  private mapFromDb(row: EventRow): CalendarEvent {
    return {
      id: row.id,
      title: row.title,
      start: row.start,
      end: row.end,
      color: row.color,
      description: row.description,
      taskId: row.task_id,
    };
  }

  private mapToDb(input: Partial<CalendarEvent>): EventDbInput {
    const result: EventDbInput = {};
    if (input.title !== undefined) result.title = input.title;
    if (input.start !== undefined) result.start = input.start;
    if (input.end !== undefined) result.end = input.end;
    if (input.color !== undefined) result.color = input.color;
    if (input.description !== undefined) result.description = input.description;
    if (input.taskId !== undefined) result.task_id = input.taskId;
    return result;
  }
}
"
