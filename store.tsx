
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, Workspace, Project, Task, Sprint, 
  TimeEntry, Comment, WikiPage, Notification, AuditLog, WorkflowStatus
} from './types';

interface AppState {
  currentUser: User;
  workspace: Workspace;
  users: User[];
  projects: Project[];
  tasks: Task[];
  sprints: Sprint[];
  timeEntries: TimeEntry[];
  comments: Comment[];
  wikiPages: WikiPage[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

interface AppContextType extends AppState {
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTimeEntry: (entry: Partial<TimeEntry>) => void;
  markNotificationAsRead: (id: string) => void;
  createWikiPage: (page: Partial<WikiPage>) => void;
  updateWikiPage: (id: string, updates: Partial<WikiPage>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_WORKFLOW: WorkflowStatus[] = [
  { id: 'backlog', label: 'Backlog', category: 'TODO' },
  { id: 'todo', label: 'To Do', category: 'TODO' },
  { id: 'in_progress', label: 'In Progress', category: 'IN_PROGRESS', wipLimit: 5 },
  { id: 'review', label: 'Review', category: 'IN_PROGRESS', wipLimit: 3 },
  { id: 'done', label: 'Done', category: 'DONE' }
];

const INITIAL_DATA: AppState = {
  currentUser: {
    id: 'u1',
    name: 'Aslam Admin',
    email: 'admin@aslam.pm',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aslam',
    role: 'OWNER',
    timezone: 'UTC',
    status: 'ACTIVE'
  },
  workspace: {
    id: 'w1',
    name: 'Engineering Hub',
    slug: 'eng-hub',
    ownerId: 'u1',
    settings: {
      workingDays: [1, 2, 3, 4, 5],
      defaultTimezone: 'UTC'
    }
  },
  users: [
    { id: 'u1', name: 'Aslam Admin', email: 'admin@aslam.pm', role: 'OWNER', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aslam' },
    { id: 'u2', name: 'Jane Dev', email: 'jane@aslam.pm', role: 'MEMBER', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
    { id: 'u3', name: 'Bob Product', email: 'bob@aslam.pm', role: 'ADMIN', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' }
  ],
  projects: [
    { 
      id: 'p1', workspaceId: 'w1', name: 'Mobile App Revamp', key: 'MAR', status: 'ACTIVE', leadId: 'u1', members: ['u1', 'u2', 'u3'],
      workflow: DEFAULT_WORKFLOW,
      issueTypes: ['STORY', 'BUG', 'TASK', 'EPIC']
    },
    { 
      id: 'p2', workspaceId: 'w1', name: 'Internal API', key: 'API', status: 'ACTIVE', leadId: 'u3', members: ['u1', 'u2'],
      workflow: DEFAULT_WORKFLOW,
      issueTypes: ['TASK', 'EPIC']
    }
  ],
  tasks: [
    { id: 't1', projectId: 'p1', number: 1, title: 'Core UI Components', description: 'Design system elements.', type: 'EPIC', status: 'in_progress', priority: 'HIGH', reporterId: 'u3', assigneeId: 'u1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), labels: ['design'], links: [] },
    { id: 't2', projectId: 'p1', epicId: 't1', number: 2, title: 'Button Variants', description: 'Primary, secondary, ghost.', type: 'STORY', status: 'done', priority: 'MEDIUM', reporterId: 'u1', assigneeId: 'u2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), labels: ['ui'], links: [], completedAt: new Date().toISOString() },
    { id: 't3', projectId: 'p1', epicId: 't1', number: 3, title: 'Navigation Bug', description: 'Menu overlaps on mobile.', type: 'BUG', status: 'todo', priority: 'URGENT', reporterId: 'u2', assigneeId: 'u1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), labels: ['mobile'], links: [] },
  ],
  sprints: [
    { id: 's1', projectId: 'p1', name: 'Q1 Sprint 1', startDate: '2024-01-01', endDate: '2024-01-14', status: 'ACTIVE', capacity: { 'u1': 40, 'u2': 40 } }
  ],
  timeEntries: [],
  comments: [],
  wikiPages: [],
  notifications: [],
  auditLogs: []
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aslam_pm_enterprise_state');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('aslam_pm_enterprise_state', JSON.stringify(state));
  }, [state]);

  const addTask = useCallback((task: Partial<Task>) => {
    setState(prev => {
      const newTask = {
        ...task,
        id: `t${Date.now()}`,
        number: prev.tasks.length + 1,
        links: task.links || [],
        labels: task.labels || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Task;
      return { ...prev, tasks: [...prev.tasks, newTask] };
    });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => {
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === id) {
          const newStatus = updates.status || t.status;
          const completedAt = newStatus === 'done' ? new Date().toISOString() : (newStatus !== t.status ? undefined : t.completedAt);
          return { ...t, ...updates, completedAt, updatedAt: new Date().toISOString() };
        }
        return t;
      });
      return { ...prev, tasks: updatedTasks };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  const addProject = useCallback((project: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, { 
        ...project, 
        id: `p${Date.now()}`, 
        workflow: DEFAULT_WORKFLOW,
        issueTypes: ['STORY', 'BUG', 'TASK', 'EPIC']
      } as Project]
    }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.filter(t => t.projectId !== id)
    }));
  }, []);

  const addTimeEntry = useCallback((entry: Partial<TimeEntry>) => {
    setState(prev => ({
      ...prev,
      timeEntries: [...prev.timeEntries, { ...entry, id: `te${Date.now()}`, status: 'PENDING' } as TimeEntry]
    }));
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  }, []);

  const createWikiPage = useCallback((page: Partial<WikiPage>) => {
    setState(prev => ({
      ...prev,
      wikiPages: [...prev.wikiPages, { ...page, id: `wiki${Date.now()}`, updatedAt: new Date().toISOString() } as WikiPage]
    }));
  }, []);

  const updateWikiPage = useCallback((id: string, updates: Partial<WikiPage>) => {
    setState(prev => ({
      ...prev,
      wikiPages: prev.wikiPages.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    }));
  }, []);

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    addProject,
    updateProject,
    deleteProject,
    addTimeEntry,
    markNotificationAsRead,
    createWikiPage,
    updateWikiPage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
