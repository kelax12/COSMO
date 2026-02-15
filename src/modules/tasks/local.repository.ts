import { ITasksRepository } from './tasks.repository';
import { Task, TaskFilters } from './tasks.types';

const STORAGE_KEY = 'cosmo_demo_tasks';

// Helper pour générer des dates
const getDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Données de démonstration
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
  {
    id: 'task-6',
    name: 'Code review PR #42',
    description: 'Review des nouvelles fonctionnalités',
    priority: 4,
    category: 'cat-1',
    deadline: getDate(0),
    estimatedTime: 45,
    createdAt: getDate(-1),
    bookmarked: false,
    completed: false,
    isCollaborative: true,
    collaborators: ['friend-2'],
    pendingInvites: [],
  },
  {
    id: 'task-7',
    name: 'Répondre aux emails',
    description: 'Emails en attente depuis lundi',
    priority: 3,
    category: 'cat-1',
    deadline: getDate(0),
    estimatedTime: 30,
    createdAt: getDate(-2),
    bookmarked: false,
    completed: false,
    isCollaborative: false,
    collaborators: [],
    pendingInvites: [],
  },
];

export class LocalStorageTasksRepository implements ITasksRepository {
  private getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.saveTasks(DEMO_TASKS);
      return DEMO_TASKS;
    }
    return JSON.parse(data);
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // ═══════════════════════════════════════════════════════════════════
  // READ OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  async getAll(): Promise<Task[]> {
    return this.getTasks();
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = this.getTasks();
    return tasks.find(t => t.id === id) || null;
  }

  async getByDate(date: string): Promise<Task[]> {
    const tasks = this.getTasks();
    const targetDate = date.split('T')[0];
    return tasks.filter(t => t.deadline.split('T')[0] === targetDate);
  }

  async getFiltered(filters: TaskFilters): Promise<Task[]> {
    let tasks = this.getTasks();

    if (filters.completed !== undefined) {
      tasks = tasks.filter(t => t.completed === filters.completed);
    }

    if (filters.bookmarked !== undefined) {
      tasks = tasks.filter(t => t.bookmarked === filters.bookmarked);
    }

    if (filters.category) {
      tasks = tasks.filter(t => t.category === filters.category);
    }

    if (filters.priorityMin !== undefined) {
      tasks = tasks.filter(t => t.priority >= filters.priorityMin!);
    }

    if (filters.priorityMax !== undefined) {
      tasks = tasks.filter(t => t.priority <= filters.priorityMax!);
    }

    if (filters.deadlineBefore) {
      tasks = tasks.filter(t => t.deadline <= filters.deadlineBefore!);
    }

    if (filters.deadlineAfter) {
      tasks = tasks.filter(t => t.deadline >= filters.deadlineAfter!);
    }

    return tasks;
  }
}
