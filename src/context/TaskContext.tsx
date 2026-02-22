import React, { createContext, useContext, useState } from 'react';

// Helper pour générer des dates
const getDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMONSTRATION (domaines NON migrés)
// ═══════════════════════════════════════════════════════════════════

const DEMO_OKRS = [
  {
    id: 'okr-1',
    title: 'Améliorer ma productivité',
    description: 'Devenir plus efficace dans mes tâches quotidiennes',
    category: 'personal',
    progress: 65,
    completed: false,
    keyResults: [
      { id: 'kr-1', title: 'Compléter 90% des tâches planifiées', currentValue: 68, targetValue: 90, unit: '%', completed: false, estimatedTime: 30 },
      { id: 'kr-2', title: 'Réduire les distractions de 50%', currentValue: 30, targetValue: 50, unit: '%', completed: false, estimatedTime: 15 },
      { id: 'kr-3', title: 'Utiliser la méthode Pomodoro quotidiennement', currentValue: 11, targetValue: 20, unit: 'jours', completed: false, estimatedTime: 25 },
    ],
    startDate: getDate(-30),
    endDate: getDate(60),
  },
  {
    id: 'okr-2',
    title: 'Apprendre React avancé',
    description: 'Maîtriser les concepts avancés de React',
    category: 'learning',
    progress: 40,
    completed: false,
    keyResults: [
      { id: 'kr-4', title: 'Terminer le cours sur les hooks', currentValue: 8, targetValue: 10, unit: 'modules', completed: false, estimatedTime: 60 },
      { id: 'kr-5', title: 'Créer 3 projets pratiques', currentValue: 1, targetValue: 3, unit: 'projets', completed: false, estimatedTime: 120 },
      { id: 'kr-6', title: 'Contribuer à un projet open source', currentValue: 1, targetValue: 10, unit: 'PRs', completed: false, estimatedTime: 45 },
    ],
    startDate: getDate(-20),
    endDate: getDate(70),
  },
  {
    id: 'okr-3',
    title: 'Améliorer ma santé',
    description: 'Adopter un mode de vie plus sain',
    category: 'health',
    progress: 55,
    completed: false,
    keyResults: [
      { id: 'kr-7', title: 'Faire du sport 4x par semaine', currentValue: 14, targetValue: 20, unit: 'séances', completed: false, estimatedTime: 60 },
      { id: 'kr-8', title: 'Dormir 8h par nuit', currentValue: 9, targetValue: 20, unit: 'nuits', completed: false, estimatedTime: 0 },
      { id: 'kr-9', title: 'Manger 5 fruits/légumes par jour', currentValue: 10, targetValue: 20, unit: 'jours', completed: false, estimatedTime: 10 },
    ],
    startDate: getDate(-15),
    endDate: getDate(75),
  },
];

const DEMO_FRIENDS = [
  { id: 'friend-1', name: 'Marie Dupont', email: 'marie.dupont@email.com', avatar: '👩' },
  { id: 'friend-2', name: 'Jean Martin', email: 'jean.martin@email.com', avatar: '👨' },
  { id: 'friend-3', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', avatar: '👩‍💼' },
];

const DEMO_FAVORITE_COLORS = [
  '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F97316', '#EC4899'
];

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface OKR {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  completed: boolean;
  keyResults: KeyResult[];
  startDate: string;
  endDate: string;
}

export interface KeyResult {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  estimatedTime: number;
  history?: { date: string; increment: number }[];
}

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
  messages: any[];
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
  
  // OKRs
  okrs: OKR[];
  addOKR: (okr: Partial<OKR>) => OKR;
  updateOKR: (id: string, updates: Partial<OKR>) => void;
  deleteOKR: (id: string) => void;
  updateKeyResult: (objectiveId: string, keyResultId: string, updates: Partial<KeyResult>) => void;
  
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
 * ═══════════════════════════════════════════════════════════════════
 * 
 * DOMAINES RESTANTS (à migrer ultérieurement):
 * - friends
 * - okrs
 * - priorityRange (UI state)
 */
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // STATE - Domaines NON migrés uniquement
  // ═══════════════════════════════════════════════════════════════════
  const [loading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [okrs, setOkrs] = useState<OKR[]>(DEMO_OKRS);
  const [friends] = useState<Friend[]>(DEMO_FRIENDS);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(DEMO_FAVORITE_COLORS);
  const [user] = useState({ id: 'demo-user', name: 'Demo', email: 'demo@cosmo.app', avatar: '👤' });
  const [priorityRange, setPriorityRange] = useState<[number, number]>([1, 5]);

  const markMessagesAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  // ═══════════════════════════════════════════════════════════════════
  // OKR CRUD operations
  // ═══════════════════════════════════════════════════════════════════
  const addOKR = (okr: Partial<OKR>): OKR => {
    const newOKR: OKR = {
      id: crypto.randomUUID(),
      title: okr.title || '',
      description: okr.description || '',
      category: okr.category || '',
      progress: 0,
      completed: false,
      keyResults: okr.keyResults || [],
      startDate: okr.startDate || new Date().toISOString(),
      endDate: okr.endDate || new Date().toISOString(),
    };
    setOkrs(prev => [...prev, newOKR]);
    return newOKR;
  };

  const updateOKR = (id: string, updates: Partial<OKR>) => {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOKR = (id: string) => {
    setOkrs(prev => prev.filter(o => o.id !== id));
  };

  const updateKeyResult = (objectiveId: string, keyResultId: string, updates: Partial<KeyResult>) => {
    setOkrs(prev => prev.map(okr => {
      if (okr.id === objectiveId) {
        return {
          ...okr,
          keyResults: okr.keyResults.map((kr) =>
            kr.id === keyResultId ? { ...kr, ...updates } : kr
          ),
        };
      }
      return okr;
    }));
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
    
    // OKRs
    okrs,
    addOKR,
    updateOKR,
    deleteOKR,
    updateKeyResult,
    
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
