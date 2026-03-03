import React, { createContext, useContext, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TYPE IMPORTÉ DEPUIS MODULE FRIENDS (SOURCE UNIQUE)
// ═══════════════════════════════════════════════════════════════════
import { Friend } from '@/modules/friends';

// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMONSTRATION (domaines NON migrés)
// ═══════════════════════════════════════════════════════════════════

const DEMO_FRIENDS: Friend[] = [
  { id: 'friend-1', name: 'Marie Dupont', email: 'marie.dupont@email.com', avatar: '👩' },
  { id: 'friend-2', name: 'Jean Martin', email: 'jean.martin@email.com', avatar: '👨' },
  { id: 'friend-3', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', avatar: '👩‍💼' },
];

const DEMO_FAVORITE_COLORS = [
  '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F97316', '#EC4899'
];

// ═══════════════════════════════════════════════════════════════════
// CONTEXT TYPE (domaines NON migrés uniquement)
// ═══════════════════════════════════════════════════════════════════

interface TaskContextType {
  // User & Auth
  user: { id: string; name: string; email: string; avatar: string };
  loading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  isPremium: () => boolean;
  
  // Messages
  messages: { id: string; read: boolean; content: string }[];
  markMessagesAsRead: () => void;
  
  // Colors (UI state only)
  colorSettings: Record<string, string>;
  favoriteColors: string[];
  setFavoriteColors: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Friends
  friends: Friend[];
  sendFriendRequest: (email: string) => void;
  shareTask: (taskId: string, friendId: string, role?: string) => void;
  
  // Priority Range (UI state)
  priorityRange: [number, number];
  setPriorityRange: (range: [number, number]) => void;
  
  // Auth stubs
  login: () => Promise<void>;
  register: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * TaskProvider - Provider pour domaines NON migrés
 * 
 * ═══════════════════════════════════════════════════════════════════
 * DOMAINES MIGRÉS (NE PLUS UTILISER ICI):
 * - TASKS: import { useTasks, useCreateTask, ... } from '@/modules/tasks'
 * - HABITS: import { useHabits, useCreateHabit, ... } from '@/modules/habits'
 * - EVENTS: import { useEvents, useCreateEvent, ... } from '@/modules/events'
 * - CATEGORIES: import { useCategories, useCreateCategory, ... } from '@/modules/categories'
 * - LISTS: import { useLists, useCreateList, ... } from '@/modules/lists'
 * - OKRS: import { useOkrs, useCreateOkr, ... } from '@/modules/okrs'
 * ═══════════════════════════════════════════════════════════════════
 * 
 * DOMAINES RESTANTS (à migrer ultérieurement):
 * - friends
 * - priorityRange (UI state)
 */
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // STATE - Domaines NON migrés uniquement
  // ═══════════════════════════════════════════════════════════════════
  const [loading] = useState(false);
  const [messages, setMessages] = useState<{ id: string; read: boolean; content: string }[]>([]);
  const [friends] = useState<Friend[]>(DEMO_FRIENDS);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(DEMO_FAVORITE_COLORS);
  const [user] = useState({ id: 'demo-user', name: 'Demo', email: 'demo@cosmo.app', avatar: '👤' });
  const [priorityRange, setPriorityRange] = useState<[number, number]>([1, 5]);

  const markMessagesAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  // ═══════════════════════════════════════════════════════════════════
  // Utilities
  // ═══════════════════════════════════════════════════════════════════
  const isPremium = () => true;
  const sendFriendRequest = (email: string) => console.log('Friend request sent to:', email);
  const shareTask = (taskId: string, friendId: string, _role?: string) => console.log('Task shared:', taskId, friendId);

  const colorSettings: Record<string, string> = {
    'cat-1': 'Travail',
    'cat-2': 'Personnel',
    'cat-3': 'Santé',
    'cat-4': 'Apprentissage',
    'cat-5': 'Projets',
  };

  // ═══════════════════════════════════════════════════════════════════
  // CONTEXT VALUE - Domaines NON migrés uniquement
  // ═══════════════════════════════════════════════════════════════════
  const value: TaskContextType = {
    // User & Auth
    user,
    loading,
    isAuthenticated: true,
    isDemo: true,
    isPremium,
    
    // Messages
    messages,
    markMessagesAsRead,
    
    // Colors (UI state only - categories now in @/modules/categories)
    colorSettings,
    favoriteColors,
    setFavoriteColors,
    
    // Friends
    friends,
    sendFriendRequest,
    shareTask,
    
    // Priority Range (UI state)
    priorityRange,
    setPriorityRange,
    
    // Auth stubs
    login: async () => {},
    register: async () => {},
    loginWithGoogle: async () => {},
    logout: async () => {},
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
"
