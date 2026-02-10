import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTasksBridge } from '@/modules/tasks/useTasksBridge';
import type { Task } from '@/modules/tasks/tasks.repository';

// Helper pour générer des dates
const getDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

// Données de démonstration pour les autres domaines (non-tasks)
const DEMO_CATEGORIES = [
  { id: 'cat-1', name: 'Travail', color: '#3B82F6' },
  { id: 'cat-2', name: 'Personnel', color: '#10B981' },
  { id: 'cat-3', name: 'Santé', color: '#EF4444' },
  { id: 'cat-4', name: 'Apprentissage', color: '#8B5CF6' },
  { id: 'cat-5', name: 'Projets', color: '#F97316' },
];

const DEMO_HABITS = [
  {
    id: 'habit-1',
    name: 'Méditation',
    description: '15 minutes de méditation le matin',
    frequency: 'daily',
    estimatedTime: 15,
    color: '#8B5CF6',
    icon: '🧘',
    completions: {
      [today]: true,
      [yesterday]: true,
      [twoDaysAgo]: false,
    },
  },
  {
    id: 'habit-2',
    name: 'Sport',
    description: '30 minutes d\'exercice',
    frequency: 'daily',
    estimatedTime: 30,
    color: '#EF4444',
    icon: '🏃',
    completions: {
      [today]: false,
      [yesterday]: true,
      [twoDaysAgo]: true,
    },
  },
  {
    id: 'habit-3',
    name: 'Lecture',
    description: 'Lire 20 pages',
    frequency: 'daily',
    estimatedTime: 30,
    color: '#3B82F6',
    icon: '📚',
    completions: {
      [today]: true,
      [yesterday]: false,
      [twoDaysAgo]: true,
    },
  },
  {
    id: 'habit-4',
    name: 'Apprentissage langue',
    description: '15 minutes de pratique',
    frequency: 'daily',
    estimatedTime: 15,
    color: '#10B981',
    icon: '🌍',
    completions: {
      [today]: false,
      [yesterday]: true,
      [twoDaysAgo]: true,
    },
  },
  {
    id: 'habit-5',
    name: 'Journaling',
    description: 'Écrire dans mon journal',
    frequency: 'daily',
    estimatedTime: 10,
    color: '#F97316',
    icon: '✏️',
    completions: {
      [today]: true,
      [yesterday]: true,
      [twoDaysAgo]: false,
    },
  },
];

const DEMO_OKRS = [
  {
    id: 'okr-1',
    title: 'Améliorer ma productivité',
    description: 'Devenir plus efficace dans mes tâches quotidiennes',
    category: 'Personnel',
    progress: 65,
    completed: false,
    keyResults: [
      { id: 'kr-1', title: 'Compléter 90% des tâches planifiées', progress: 75 },
      { id: 'kr-2', title: 'Réduire les distractions de 50%', progress: 60 },
      { id: 'kr-3', title: 'Utiliser la méthode Pomodoro quotidiennement', progress: 55 },
    ],
    startDate: getDate(-30),
    endDate: getDate(60),
  },
  {
    id: 'okr-2',
    title: 'Apprendre React avancé',
    description: 'Maîtriser les concepts avancés de React',
    category: 'Apprentissage',
    progress: 40,
    completed: false,
    keyResults: [
      { id: 'kr-4', title: 'Terminer le cours sur les hooks', progress: 80 },
      { id: 'kr-5', title: 'Créer 3 projets pratiques', progress: 33 },
      { id: 'kr-6', title: 'Contribuer à un projet open source', progress: 10 },
    ],
    startDate: getDate(-20),
    endDate: getDate(70),
  },
  {
    id: 'okr-3',
    title: 'Améliorer ma santé',
    description: 'Adopter un mode de vie plus sain',
    category: 'Santé',
    progress: 55,
    completed: false,
    keyResults: [
      { id: 'kr-7', title: 'Faire du sport 4x par semaine', progress: 70 },
      { id: 'kr-8', title: 'Dormir 8h par nuit', progress: 45 },
      { id: 'kr-9', title: 'Manger 5 fruits/légumes par jour', progress: 50 },
    ],
    startDate: getDate(-15),
    endDate: getDate(75),
  },
];

const DEMO_EVENTS = [
  {
    id: 'event-1',
    title: 'Réunion d\'équipe',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    color: '#3B82F6',
    description: 'Point hebdomadaire avec l\'équipe',
  },
  {
    id: 'event-2',
    title: 'Déjeuner client',
    start: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    color: '#10B981',
    description: 'Restaurant Le Petit Bistrot',
  },
  {
    id: 'event-3',
    title: 'Formation React',
    start: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    color: '#8B5CF6',
    description: 'Module avancé sur les hooks',
  },
  {
    id: 'event-4',
    title: 'Sport',
    start: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(19, 30, 0, 0)).toISOString(),
    color: '#EF4444',
    description: 'Séance de running',
  },
];

const DEMO_LISTS = [
  {
    id: 'list-1',
    name: 'Urgent',
    color: 'red',
    taskIds: ['task-1', 'task-2', 'task-6'],
  },
  {
    id: 'list-2',
    name: 'Cette semaine',
    color: 'blue',
    taskIds: ['task-3', 'task-4', 'task-5'],
  },
  {
    id: 'list-3',
    name: 'Professionnel',
    color: 'purple',
    taskIds: ['task-1', 'task-2', 'task-6', 'task-7'],
  },
];

const DEMO_FRIENDS = [
  { id: 'friend-1', name: 'Marie Dupont', email: 'marie.dupont@email.com', avatar: '👩' },
  { id: 'friend-2', name: 'Jean Martin', email: 'jean.martin@email.com', avatar: '👨' },
  { id: 'friend-3', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', avatar: '👩‍💼' },
];

// Re-export Task type for backward compatibility
export type { Task };
export interface TaskList {
  id: string;
  name: string;
  color: string;
  taskIds: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: string;
  description?: string;
  taskId?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  estimatedTime: number;
  color: string;
  icon: string;
  completions: Record<string, boolean>;
}

export const TaskContext = createContext<any>(undefined);

/**
 * TaskProvider - Provider hybride
 * 
 * TASKS: Utilise les hooks modernes (React Query + Repository Pattern)
 * AUTRES: Reste sur useState legacy (habits, okr, events, etc.)
 * 
 * Migration incrémentale: les tasks sont maintenant persistées via LocalStorage/Supabase
 */
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // TASKS - MODERNISÉ via React Query + Repository Pattern
  // ═══════════════════════════════════════════════════════════════════
  const tasksBridge = useTasksBridge();
  
  // Wrapper pour compatibilité avec l'ancienne API
  const addTask = async (taskData: any) => {
    const task = {
      name: taskData.name || '',
      description: taskData.description || '',
      category: taskData.category || 'cat-1',
      priority: taskData.priority || 3,
      deadline: taskData.deadline || new Date().toISOString(),
      estimatedTime: taskData.estimatedTime || 60,
      completed: false,
      bookmarked: false,
      isCollaborative: taskData.isCollaborative || false,
      collaborators: taskData.collaborators || [],
      pendingInvites: taskData.pendingInvites || [],
    };
    return tasksBridge.addTask(task);
  };

  // ═══════════════════════════════════════════════════════════════════
  // LEGACY - Reste sur useState (à migrer plus tard)
  // ═══════════════════════════════════════════════════════════════════
  const [messages, setMessages] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>(DEMO_HABITS);
  const [okrs, setOkrs] = useState<any[]>(DEMO_OKRS);
  const [events, setEvents] = useState<any[]>(DEMO_EVENTS);
  const [lists, setLists] = useState<any[]>(DEMO_LISTS);
  const [categories, setCategories] = useState<any[]>(DEMO_CATEGORIES);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>(DEMO_FRIENDS);
  const [user] = useState({ id: 'demo-user', name: 'Demo', email: 'demo@cosmo.app', avatar: '👤' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priorityRange, setPriorityRange] = useState<[number, number]>([0, 5]);

  const markMessagesAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  // Habit CRUD operations (legacy)
  const addHabit = (habit: any) => {
    const newHabit = { ...habit, id: Date.now().toString(), completions: {} };
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  const updateHabit = (id: string, updates: any) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completions = { ...h.completions };
        completions[date] = !completions[date];
        return { ...h, completions };
      }
      return h;
    }));
  };

  // OKR CRUD operations (legacy)
  const addOKR = (okr: any) => {
    const newOKR = { ...okr, id: Date.now().toString(), progress: 0, completed: false };
    setOkrs(prev => [...prev, newOKR]);
    return newOKR;
  };

  const updateOKR = (id: string, updates: any) => {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOKR = (id: string) => {
    setOkrs(prev => prev.filter(o => o.id !== id));
  };

  const updateKeyResult = (objectiveId: string, keyResultId: string, updates: any) => {
    setOkrs(prev => prev.map(okr => {
      if (okr.id === objectiveId) {
        return {
          ...okr,
          keyResults: okr.keyResults.map((kr: any) =>
            kr.id === keyResultId ? { ...kr, ...updates } : kr
          ),
        };
      }
      return okr;
    }));
  };

  // Event CRUD operations (legacy)
  const addEvent = (event: any) => {
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: any) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // List operations (legacy)
  const addList = (list: any) => {
    const newList = { ...list, id: Date.now().toString(), taskIds: [] };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const updateList = (id: string, updates: any) => {
    setLists(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteList = (id: string) => {
    setLists(prev => prev.filter(l => l.id !== id));
  };

  const addTaskToList = (taskId: string, listId: string) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId && !list.taskIds.includes(taskId)) {
        return { ...list, taskIds: [...list.taskIds, taskId] };
      }
      return list;
    }));
  };

  const removeTaskFromList = (taskId: string, listId: string) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        return { ...list, taskIds: list.taskIds.filter((id: string) => id !== taskId) };
      }
      return list;
    }));
  };

  // Category operations (legacy)
  const addCategory = (category: any) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: any) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const isPremium = () => true; // Demo user has premium features
  const sendFriendRequest = (email: string) => console.log('Friend request sent to:', email);
  const shareTask = (taskId: string, friendId: string) => console.log('Task shared:', taskId, friendId);

  // Color settings mapping category id to name for display
  const colorSettings: Record<string, string> = {
    'cat-1': 'Travail',
    'cat-2': 'Personnel',
    'cat-3': 'Santé',
    'cat-4': 'Apprentissage',
    'cat-5': 'Projets',
  };

  const value = {
    // User & Auth
    user,
    loading: tasksBridge.isLoading,
    isAuthenticated: true,
    isDemo: true,
    isPremium,
    
    // Messages
    messages,
    markMessagesAsRead,
    
    // ═══════════════════════════════════════════════════════════════════
    // TASKS - NOW USING MODERN HOOKS (React Query + Repository)
    // ═══════════════════════════════════════════════════════════════════
    tasks: tasksBridge.tasks,
    addTask,
    updateTask: tasksBridge.updateTask,
    deleteTask: tasksBridge.deleteTask,
    toggleBookmark: tasksBridge.toggleBookmark,
    toggleComplete: tasksBridge.toggleComplete,
    
    // Legacy domains (not migrated yet)
    habits,
    okrs,
    events,
    lists,
    categories,
    collaborators,
    friends,
    colorSettings,
    
    // Filters (UI state)
    searchTerm,
    setSearchTerm,
    selectedCategories,
    setSelectedCategories,
    priorityRange,
    setPriorityRange,
    
    // Habits
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    
    // OKRs
    addOKR,
    updateOKR,
    deleteOKR,
    updateKeyResult,
    
    // Events
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Lists
    addList,
    updateList,
    deleteList,
    addTaskToList,
    removeTaskFromList,
    
    // Categories
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Social
    sendFriendRequest,
    shareTask,
    
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

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
