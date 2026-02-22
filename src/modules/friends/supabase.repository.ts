// ═══════════════════════════════════════════════════════════════════
// FRIENDS MODULE - Supabase Repository Implementation
// ═══════════════════════════════════════════════════════════════════

import { supabase } from '@/lib/supabase';
import { normalizeApiError } from '@/lib/normalizeApiError';
import { IFriendsRepository } from './repository';
import { Friend, FriendRequestInput, ShareTaskInput, PendingFriendRequest } from './types';

export class SupabaseFriendsRepository implements IFriendsRepository {
  // ═══════════════════════════════════════════════════════════════════
  // READ OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  async getAll(): Promise<Friend[]> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapFromDb);
  }

  async getById(id: string): Promise<Friend | null> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw normalizeApiError(error);
    }
    return data ? this.mapFromDb(data) : null;
  }

  async getByEmail(email: string): Promise<Friend | null> {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .ilike('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw normalizeApiError(error);
    }
    return data ? this.mapFromDb(data) : null;
  }

  async getPendingRequests(): Promise<PendingFriendRequest[]> {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('status', 'pending')
      .order('sent_at', { ascending: false });

    if (error) throw normalizeApiError(error);
    return (data || []).map(this.mapRequestFromDb);
  }

  // ═══════════════════════════════════════════════════════════════════
  // WRITE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  async sendFriendRequest(input: FriendRequestInput): Promise<PendingFriendRequest> {
    const { data, error } = await supabase
      .from('friend_requests')
      .insert([{ email: input.email, status: 'pending', sent_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw normalizeApiError(error);
    return this.mapRequestFromDb(data);
  }

  async acceptFriendRequest(requestId: string): Promise<Friend> {
    // Update request status
    const { data: request, error: requestError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId)
      .select()
      .single();

    if (requestError) throw normalizeApiError(requestError);

    // Create friend from request
    const { data: friend, error: friendError } = await supabase
      .from('friends')
      .insert([{ 
        name: request.email.split('@')[0], 
        email: request.email, 
        avatar: '👤' 
      }])
      .select()
      .single();

    if (friendError) throw normalizeApiError(friendError);
    return this.mapFromDb(friend);
  }

  async rejectFriendRequest(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) throw normalizeApiError(error);
  }

  async removeFriend(id: string): Promise<void> {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id);

    if (error) throw normalizeApiError(error);
  }

  // ═══════════════════════════════════════════════════════════════════
  // TASK SHARING OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  async shareTask(input: ShareTaskInput): Promise<void> {
    const { error } = await supabase
      .from('shared_tasks')
      .upsert([{ 
        task_id: input.taskId, 
        friend_id: input.friendId, 
        role: input.role || 'viewer' 
      }]);

    if (error) throw normalizeApiError(error);
  }

  async unshareTask(taskId: string, friendId: string): Promise<void> {
    const { error } = await supabase
      .from('shared_tasks')
      .delete()
      .eq('task_id', taskId)
      .eq('friend_id', friendId);

    if (error) throw normalizeApiError(error);
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAPPING
  // ═══════════════════════════════════════════════════════════════════

  private mapFromDb(row: Record<string, unknown>): Friend {
    return {
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      avatar: row.avatar as string | undefined,
    };
  }

  private mapRequestFromDb(row: Record<string, unknown>): PendingFriendRequest {
    return {
      id: row.id as string,
      email: row.email as string,
      status: row.status as PendingFriendRequest['status'],
      sentAt: row.sent_at as string,
    };
  }
}
