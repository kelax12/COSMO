import { supabase } from '@/lib/supabase';
import { normalizeApiError } from '@/lib/normalizeApiError';
import { IHabitsRepository } from './habits.repository';
import { Habit, CreateHabitInput, UpdateHabitInput } from './habits.types';

export class SupabaseHabitsRepository implements IHabitsRepository {
  async fetchHabits(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw normalizeApiError(error);
    
    // Map snake_case to camelCase
    return (data || []).map(this.mapFromDb);
  }

  async createHabit(input: CreateHabitInput): Promise<Habit> {
    const dbInput = this.mapToDb(input);
    
    const { data, error } = await supabase
      .from('habits')
      .insert([dbInput])
      .select()
      .single();

    if (error) throw normalizeApiError(error);
    return this.mapFromDb(data);
  }

  async updateHabit(id: string, updates: UpdateHabitInput): Promise<Habit> {
    const dbUpdates = this.mapToDb(updates);
    
    const { data, error } = await supabase
      .from('habits')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw normalizeApiError(error);
    return this.mapFromDb(data);
  }

  async deleteHabit(id: string): Promise<void> {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) throw normalizeApiError(error);
  }

  async toggleCompletion(id: string, date: string): Promise<Habit> {
    // First fetch current completions
    const { data: habit, error: fetchError } = await supabase
      .from('habits')
      .select('completions')
      .eq('id', id)
      .single();

    if (fetchError) throw normalizeApiError(fetchError);

    const completions = habit?.completions || {};
    completions[date] = !completions[date];

    const { data, error } = await supabase
      .from('habits')
      .update({ completions })
      .eq('id', id)
      .select()
      .single();

    if (error) throw normalizeApiError(error);
    return this.mapFromDb(data);
  }

  // Map from Supabase snake_case to app camelCase
  private mapFromDb(row: any): Habit {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      frequency: row.frequency,
      estimatedTime: row.estimated_time,
      color: row.color,
      icon: row.icon,
      completions: row.completions || {},
      createdAt: row.created_at,
      userId: row.user_id,
    };
  }

  // Map from app camelCase to Supabase snake_case
  private mapToDb(input: Partial<Habit>): any {
    const result: any = {};
    if (input.name !== undefined) result.name = input.name;
    if (input.description !== undefined) result.description = input.description;
    if (input.frequency !== undefined) result.frequency = input.frequency;
    if (input.estimatedTime !== undefined) result.estimated_time = input.estimatedTime;
    if (input.color !== undefined) result.color = input.color;
    if (input.icon !== undefined) result.icon = input.icon;
    if (input.completions !== undefined) result.completions = input.completions;
    if (input.userId !== undefined) result.user_id = input.userId;
    return result;
  }
}
