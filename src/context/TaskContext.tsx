import React, { createContext, useContext, useState } from 'react';
import type { Task } from '@/modules/tasks/tasks.types';

// Helper pour générer des dates
const getDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Données de démonstration Tasks
const DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    name: 'Finaliser le rapport mensuel',
    description: 'Rapport Q4 pour la direction',
    priority: 5,
    category: 'cat-1',
    deadline: getDate(1),
    estimatedTime: 120,
    createdAt: getDate(-2),
    bookmarked: true,
    completed: false,
    isCollaborative: false,
    collaborators: [],
    pendingInvites: [],
  },
  {
    id: 'task-2',
    name: 'Préparer la présentation client',
    description: 'Présentation pour le client XYZ',
    priority: 4,
    category: 'cat-1',
    deadline: getDate(3),
    estimatedTime: 90,
    createdAt: getDate(-1),
    bookmarked: false,
    completed: false,
    isCollaborative: true,
    collaborators: ['friend-1'],
    pendingInvites: [],
  },
  {
    id: 'task-3',
    name: 'Réviser les cours de React',
    description: 'Hooks avancés et Context API',
    priority: 3,
    category: 'cat-4',
    deadline: getDate(5),
    estimatedTime: 60,
    createdAt: getDate(-3),
    bookmarked: true,
    completed: false,
    isCollaborative: false,
    collaborators: [],
    pendingInvites: [],
  },
  {
    id: 'task-4',
    name: 'Rendez-vous médecin',
    description: 'Bilan annuel',
    priority: 2,
    category: 'cat-3',
    deadline: getDate(0),
    estimatedTime: 45,
    createdAt: getDate(-5),
    bookmarked: false,
    completed: true,
    completedAt: getDate(0),
    isCollaborative: false,
    collaborators: [],
    pendingInvites: [],
  },
  {
    id: 'task-5',
    name: 'Planifier les vacances',
    description: 'Réserver hôtel et billets',
    priority: 2,
    category: 'cat-2',
    deadline: getDate(14),
    estimatedTime: 30,
    createdAt: getDate(-7),
    bookmarked: false,
    completed: false,
    isCollaborative: false,
    collaborators: [],
    pendingInvites: [],
  },
];

// Données de démonstration pour les autres domaines
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

export const TaskContext = createContext<any>(undefined);

/**
 * TaskProvider - Provider hybride
 * 
 * TASKS: Utilise useState legacy (mutations seront migrées en Phase 2)
 *        READ-ONLY hooks disponibles via: import { useTasks } from '@/modules/tasks'
 * HABITS: Migré vers /modules/habits (complètement indépendant)
 * AUTRES: Reste sur useState legacy (okr, events, lists, categories, etc.)
 * 
 * Migration incrémentale en cours
 */
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // TASKS - Legacy useState (mutations Phase 2)
  // READ: import { useTasks } from '@/modules/tasks'
  // ═══════════════════════════════════════════════════════════════════
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [loading, setLoading] = useState(false);

  const addTask = (taskData: any) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskData.name || '',
      description: taskData.description || '',
      category: taskData.category || 'cat-1',
      priority: taskData.priority || 3,
      deadline: taskData.deadline || new Date().toISOString(),
      estimatedTime: taskData.estimatedTime || 60,
      createdAt: new Date().toISOString(),
      completed: false,
      bookmarked: false,
      isCollaborative: taskData.isCollaborative || false,
      collaborators: taskData.collaborators || [],
      pendingInvites: taskData.pendingInvites || [],
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleBookmark = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, bookmarked: !t.bookmarked } : t
    ));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        completed: !t.completed,
        completedAt: !t.completed ? new Date().toISOString() : undefined
      } : t
    ));
  };

  // ═══════════════════════════════════════════════════════════════════
  // LEGACY - Reste sur useState (à migrer plus tard)
  // Note: HABITS a été migré vers /modules/habits
  // ═══════════════════════════════════════════════════════════════════
  const [messages, setMessages] = useState<any[]>([]);
  const [okrs, setOkrs] = useState<any[]>(DEMO_OKRS);
  const [events, setEvents] = useState<any[]>(DEMO_EVENTS);
  const [lists, setLists] = useState<any[]>(DEMO_LISTS);
  const [categories, setCategories] = useState<any[]>(DEMO_CATEGORIES);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>(DEMO_FRIENDS);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(DEMO_FAVORITE_COLORS);
  const [user] = useState({ id: 'demo-user', name: 'Demo', email: 'demo@cosmo.app', avatar: '👤' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priorityRange, setPriorityRange] = useState<[number, number]>([0, 5]);

  const markMessagesAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
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

  const isPremium = () => true;
  const sendFriendRequest = (email: string) => console.log('Friend request sent to:', email);
  const shareTask = (taskId: string, friendId: string) => console.log('Task shared:', taskId, friendId);

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
    loading,
    isAuthenticated: true,
    isDemo: true,
    isPremium,
    
    // Messages
    messages,
    markMessagesAsRead,
    
    // ═══════════════════════════════════════════════════════════════════
    // TASKS - Legacy (mutations), READ via @/modules/tasks
    // ═══════════════════════════════════════════════════════════════════
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleBookmark,
    toggleComplete,
    
    // ═══════════════════════════════════════════════════════════════════
    // HABITS - REMOVED (now in /modules/habits)
    // Use: import { useHabits, useCreateHabit, ... } from '@/modules/habits'
    // ═══════════════════════════════════════════════════════════════════
    
    // Legacy domains (not migrated yet)
    okrs,
    events,
    lists,
    categories,
    collaborators,
    friends,
    colorSettings,
    favoriteColors,
    setFavoriteColors,
    
    // Filters (UI state)
    searchTerm,
    setSearchTerm,
    selectedCategories,
    setSelectedCategories,
    priorityRange,
    setPriorityRange,
    
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
