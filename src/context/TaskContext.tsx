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

const DEMO_CATEGORIES = [
  { id: 'cat-1', name: 'Travail', color: '#3B82F6' },
  { id: 'cat-2', name: 'Personnel', color: '#10B981' },
  { id: 'cat-3', name: 'Santé', color: '#EF4444' },
  { id: 'cat-4', name: 'Apprentissage', color: '#8B5CF6' },
  { id: 'cat-5', name: 'Projets', color: '#F97316' },
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
    taskIds: ['task-1', 'task-2'],
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
    taskIds: ['task-1', 'task-2'],
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

export interface Category {
  id: string;
  name: string;
  color: string;
}

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
  progress: number;
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
  
  // Categories
  categories: Category[];
  addCategory: (category: Partial<Category>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  colorSettings: Record<string, string>;
  favoriteColors: string[];
  setFavoriteColors: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Friends
  friends: Friend[];
  sendFriendRequest: (email: string) => void;
  shareTask: (taskId: string, friendId: string, role?: string) => void;
  
  // Lists
  lists: TaskList[];
  addList: (list: Partial<TaskList>) => TaskList;
  updateList: (id: string, updates: Partial<TaskList>) => void;
  deleteList: (id: string) => void;
  addTaskToList: (taskId: string, listId: string) => void;
  removeTaskFromList: (taskId: string, listId: string) => void;
  
  // Priority Range (UI state)
  priorityRange: [number, number];
  setPriorityRange: (range: [number, number]) => void;
  
  // OKRs
  okrs: OKR[];
  addOKR: (okr: Partial<OKR>) => OKR;
  updateOKR: (id: string, updates: Partial<OKR>) => void;
  deleteOKR: (id: string) => void;
  updateKeyResult: (objectiveId: string, keyResultId: string, updates: Partial<KeyResult>) => void;
  
  // Events
  events: CalendarEvent[];
  addEvent: (event: Partial<CalendarEvent>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
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
 * ═══════════════════════════════════════════════════════════════════
 * 
 * DOMAINES RESTANTS (à migrer ultérieurement):
 * - categories
 * - friends
 * - lists
 * - priorityRange
 * - events
 * - okrs
 */
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // STATE - Domaines NON migrés uniquement
  // ═══════════════════════════════════════════════════════════════════
  const [loading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [okrs, setOkrs] = useState<OKR[]>(DEMO_OKRS);
  const [events, setEvents] = useState<CalendarEvent[]>(DEMO_EVENTS);
  const [lists, setLists] = useState<TaskList[]>(DEMO_LISTS);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
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
  // Event CRUD operations
  // ═══════════════════════════════════════════════════════════════════
  const addEvent = (event: Partial<CalendarEvent>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: event.title || '',
      start: event.start || new Date().toISOString(),
      end: event.end || new Date().toISOString(),
      color: event.color,
      description: event.description,
      taskId: event.taskId,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // ═══════════════════════════════════════════════════════════════════
  // List operations
  // ═══════════════════════════════════════════════════════════════════
  const addList = (list: Partial<TaskList>): TaskList => {
    const newList: TaskList = {
      id: crypto.randomUUID(),
      name: list.name || '',
      color: list.color || 'blue',
      taskIds: [],
    };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const updateList = (id: string, updates: Partial<TaskList>) => {
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

  // ═══════════════════════════════════════════════════════════════════
  // Category operations
  // ═══════════════════════════════════════════════════════════════════
  const addCategory = (category: Partial<Category>): Category => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: category.name || '',
      color: category.color || '#3B82F6',
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
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
    
    // Categories
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    colorSettings,
    favoriteColors,
    setFavoriteColors,
    
    // Friends
    friends,
    sendFriendRequest,
    shareTask,
    
    // Lists
    lists,
    addList,
    updateList,
    deleteList,
    addTaskToList,
    removeTaskFromList,
    
    // Priority Range (UI state)
    priorityRange,
    setPriorityRange,
    
    // OKRs
    okrs,
    addOKR,
    updateOKR,
    deleteOKR,
    updateKeyResult,
    
    // Events
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    
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
