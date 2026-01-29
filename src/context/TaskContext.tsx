import React, { createContext, useContext, useState, useEffect } from 'react';
imimport React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authClient } from '../lib/auth-client';
import { toast } from 'sonner';
import * as mockData from '../lib/mockData';

export type Task = {
  id: string;
  name: string;
  priority: number;
  category: string;
  deadline: string;
  estimatedTime: number;
  createdAt: string;
  bookmarked: boolean;
  completed: boolean;
  completedAt?: string;
  isCollaborative?: boolean;
  collaborators?: string[];
  sharedBy?: string;
  permissions?: 'responsible' | 'editor' | 'observer';
  collaboratorValidations?: { [key: string]: boolean };
  pendingInvites?: string[];
};

export type TaskList = {
  id: string;
  name: string;
  taskIds: string[];
  color: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  notes?: string;
  taskId: string;
};

export type ColorSettings = {
  [key: string]: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  premiumTokens: number;
  premiumWinStreak: number;
  lastTokenConsumption: string;
  subscriptionEndDate?: string;
  autoValidation: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  taskId?: string;
};

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  sender?: User;
};

export type Habit = {
  id: string;
  name: string;
  estimatedTime: number;
  completions: { [date: string]: boolean };
  streak: number;
  color: string;
  createdAt: string;
};

export type OKRCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type OKR = {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  keyResults: KeyResult[];
  completed: boolean;
  estimatedTime: number;
};

export type KeyResult = {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  estimatedTime: number;
  history?: { date: string, increment: number }[];
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

type TaskContextType = {
  tasks: Task[];
  lists: TaskList[];
  events: CalendarEvent[];
  colorSettings: ColorSettings;
  categories: Category[];
  priorityRange: [number, number];
  searchTerm: string;
  selectedCategories: string[];
  user: User | null;
  loading: boolean;
  messages: Message[];
  friendRequests: FriendRequest[];
  habits: Habit[];
  okrs: OKR[];
  okrCategories: OKRCategory[];
  friends: User[];
  favoriteColors: string[];
  setFavoriteColors: (colors: string[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleBookmark: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  addList: (list: TaskList) => void;
  addTaskToList: (taskId: string, listId: string) => void;
  removeTaskFromList: (taskId: string, listId: string) => void;
  deleteList: (listId: string) => void;
  updateList: (listId: string, updates: Partial<TaskList>) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  updateColorSettings: (colors: ColorSettings) => void;
  setPriorityRange: (range: [number, number]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  logout: () => void;
  watchAd: () => void;
  consumePremiumToken: () => void;
  isPremium: () => boolean;
  sendMessage: (receiverId: string, content: string, taskId?: string) => void;
  sendFriendRequest: (receiverId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  shareTask: (taskId: string, userId: string, permission: 'responsible' | 'editor' | 'observer') => void;
  addHabit: (habit: Habit) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  addOKR: (okr: OKR) => void;
  updateOKR: (id: string, updates: Partial<OKR>) => void;
  updateKeyResult: (okrId: string, keyResultId: string, updates: Partial<KeyResult>) => void;
  deleteOKR: (id: string) => void;
  updateUserSettings: (updates: Partial<User>) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addOKRCategory: (category: OKRCategory) => void;
    updateOKRCategory: (id: string, updates: Partial<OKRCategory>) => void;
    deleteOKRCategory: (id: string) => void;
    markMessagesAsRead: () => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: () => Promise<void>;
  };


const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [okrCategories, setOkrCategories] = useState<OKRCategory[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [priorityRange, setPriorityRange] = useState<[number, number]>([1, 5]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F97316', '#F59E0B', '#EC4899', '#6366F1']);

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const isDemoMode = session?.user?.email === 'demo@cosmo.app';

  const STORAGE_KEYS = {
    TASKS: 'cosmo_demo_tasks',
    HABITS: 'cosmo_demo_habits',
    OKRS: 'cosmo_demo_okrs',
    CATEGORIES: 'cosmo_demo_categories',
    OKR_CATEGORIES: 'cosmo_demo_okr_categories',
    LISTS: 'cosmo_demo_lists',
    EVENTS: 'cosmo_demo_events',
  };

  const getDemoData = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const saveDemoData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const colorSettings: ColorSettings = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as ColorSettings);

  const mapBetterAuthUserToAppUser = (authUser: any): User => ({
    id: authUser.id,
    name: authUser.name || 'Utilisateur',
    email: authUser.email,
    avatar: authUser.image,
    premiumTokens: 0,
    premiumWinStreak: 0,
    lastTokenConsumption: new Date().toISOString(),
    autoValidation: false,
  });

  const fetchData = async (userId: string, isDemo?: boolean) => {
    try {
      if (isDemo) {
        const cats = getDemoData(STORAGE_KEYS.CATEGORIES, mockData.INITIAL_CATEGORIES);
        const okrCats = getDemoData(STORAGE_KEYS.OKR_CATEGORIES, mockData.INITIAL_OKR_CATEGORIES);
        const demoTasks = getDemoData(STORAGE_KEYS.TASKS, mockData.INITIAL_TASKS);
        const demoHabits = getDemoData(STORAGE_KEYS.HABITS, mockData.INITIAL_HABITS);
        const demoOkrs = getDemoData(STORAGE_KEYS.OKRS, mockData.INITIAL_OKRS);
        const demoLists = getDemoData(STORAGE_KEYS.LISTS, []);
        const demoEvents = getDemoData(STORAGE_KEYS.EVENTS, []);

        setCategories(cats);
        setOkrCategories(okrCats);
        setTasks(demoTasks);
        setHabits(demoHabits);
        setOkrs(demoOkrs);
        setLists(demoLists);
        setEvents(demoEvents);
        return;
      }

      // Fetch from Supabase based on Better Auth userId
      const { data: tasksRes } = await supabase.from('tasks').select('*').eq('user_id', userId);
      const { data: habitsRes } = await supabase.from('habits').select('*').eq('user_id', userId);
      // ... Add other fetches as needed ...

      if (tasksRes) setTasks(tasksRes.map(t => ({ ...t, estimatedTime: t.estimated_time })));
      // ... Map other data ...
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      if (session?.user) {
        setUser(mapBetterAuthUserToAppUser(session.user));
        fetchData(session.user.id, session.user.email === 'demo@cosmo.app');
      } else {
        setUser(null);
        setTasks([]);
      }
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const addTask = async (task: Task) => {
    if (isDemoMode) {
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      saveDemoData(STORAGE_KEYS.TASKS, newTasks);
      return;
    }
    if (user) {
      const { error } = await supabase.from('tasks').insert({
        id: task.id,
        user_id: user.id,
        name: task.name,
        priority: task.priority,
        estimated_time: task.estimatedTime,
      });
      if (!error) setTasks(prev => [...prev, task]);
    }
  };

  const deleteTask = async (id: string) => {
    if (isDemoMode) {
      const newTasks = tasks.filter(t => t.id !== id);
      setTasks(newTasks);
      saveDemoData(STORAGE_KEYS.TASKS, newTasks);
      return;
    }
    if (user) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (!error) setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const toggleBookmark = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, bookmarked: !t.bookmarked } : t));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addList = (list: TaskList) => setLists(prev => [...prev, list]);
  const addTaskToList = (taskId: string, listId: string) => {
    setLists(prev => prev.map(l => l.id === listId && !l.taskIds.includes(taskId) ? { ...l, taskIds: [...l.taskIds, taskId] } : l));
  };
  const removeTaskFromList = (taskId: string, listId: string) => {
    setLists(prev => prev.map(l => l.id === listId ? { ...l, taskIds: l.taskIds.filter(id => id !== taskId) } : l));
  };
  const deleteList = (id: string) => setLists(prev => prev.filter(l => l.id !== id));
  const updateList = (id: string, updates: Partial<TaskList>) => setLists(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
    setEvents(prev => [...prev, newEvent]);
  };
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  const updateColorSettings = (colors: ColorSettings) => setCategories(prev => prev.map(cat => ({ ...cat, name: colors[cat.id] || cat.name })));

  const logout = async () => {
    await authClient.signOut();
  };

  const watchAd = () => setUser(prev => prev ? { ...prev, premiumTokens: prev.premiumTokens + 1 } : null);
  const consumePremiumToken = () => {
    if (user && user.premiumTokens > 0) {
      setUser({ ...user, premiumTokens: user.premiumTokens - 1, lastTokenConsumption: new Date().toISOString() });
    }
  };
  const isPremium = () => user ? (user.subscriptionEndDate && new Date() <= new Date(user.subscriptionEndDate)) || user.premiumTokens > 0 : false;

  const sendMessage = (receiverId: string, content: string, taskId?: string) => {
    const newMessage: Message = { id: Math.random().toString(36).substr(2, 9), senderId: user?.id || '', receiverId, content, timestamp: new Date().toISOString(), read: false, taskId };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendFriendRequest = (receiverId: string) => {
    const newRequest: FriendRequest = { id: Math.random().toString(36).substr(2, 9), senderId: user?.id || '', receiverId, status: 'pending', timestamp: new Date().toISOString() };
    setFriendRequests(prev => [...prev, newRequest]);
  };
  const acceptFriendRequest = (id: string) => setFriendRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  const rejectFriendRequest = (id: string) => setFriendRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  const shareTask = (taskId: string, userId: string, permission: 'responsible' | 'editor' | 'observer') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCollaborative: true, collaborators: [...(t.collaborators || []), userId], permissions: permission } : t));
  };

  const addHabit = (habit: Habit) => setHabits(prev => [...prev, habit]);
  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, completions: { ...h.completions, [date]: !h.completions[date] } } : h));
  };
  const updateHabit = (id: string, updates: Partial<Habit>) => setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const addOKR = (okr: OKR) => setOkrs(prev => [...prev, okr]);
  const updateOKR = (id: string, updates: Partial<OKR>) => setOkrs(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  const updateKeyResult = (okrId: string, keyResultId: string, updates: Partial<KeyResult>) => {
    setOkrs(prev => prev.map(okr => okr.id === okrId ? { ...okr, keyResults: okr.keyResults.map(kr => kr.id === keyResultId ? { ...kr, ...updates } : kr) } : okr));
  };
  const deleteOKR = (id: string) => setOkrs(prev => prev.filter(o => o.id !== id));
  const updateUserSettings = (updates: Partial<User>) => setUser(prev => prev ? { ...prev, ...updates } : null);

  const addCategory = (category: Category) => setCategories(prev => [...prev, category]);
  const updateCategory = (id: string, updates: Partial<Category>) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const addOKRCategory = (category: OKRCategory) => setOkrCategories(prev => [...prev, category]);
  const updateOKRCategory = (id: string, updates: Partial<OKRCategory>) => setOkrCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteOKRCategory = (id: string) => setOkrCategories(prev => prev.filter(c => c.id !== id));

  const markMessagesAsRead = () => setMessages(prev => prev.map(msg => ({ ...msg, read: true })));

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message || 'Erreur de connexion' };
      }

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Une erreur est survenue' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        return { success: false, error: error.message || "Erreur lors de l'inscription" };
      }

      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'Une erreur est survenue' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard'
      });
    } catch (err) {
      console.error('Google login error:', err);
      toast.error('Erreur lors de la connexion avec Google');
    }
  };

  const contextValue = {
    tasks, lists, events, colorSettings, categories, priorityRange, searchTerm, selectedCategories,
    user, messages, friendRequests, habits, okrs, okrCategories, friends, favoriteColors, setFavoriteColors,
    addTask, deleteTask, toggleBookmark, toggleComplete, updateTask,
    addList, addTaskToList, removeTaskFromList, deleteList, updateList,
    addEvent, deleteEvent, updateEvent, updateColorSettings,
    setPriorityRange, setSearchTerm, setSelectedCategories,
    logout, watchAd, consumePremiumToken, isPremium,
    sendMessage, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, shareTask,
    addHabit, toggleHabitCompletion, updateHabit, deleteHabit,
    addOKR, updateOKR, updateKeyResult, deleteOKR, updateUserSettings,
    addCategory, updateCategory, deleteCategory,
    addOKRCategory, updateOKRCategory, deleteOKRCategory,
    markMessagesAsRead,
    login,
    register,
    loginWithGoogle
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
