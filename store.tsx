
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, Workspace, Project, Task, Membership, Invite,
  UserPreference, AuditLog, UserRole, Notification,
  Comment, WikiPage, WorkspacePlan, WorkspaceUsage, MembershipStatus,
  PlanType, WorkspaceStatus, Sprint, WorkflowStatus
} from './types';

interface AppState {
  currentUser: User | null;
  currentWorkspaceId: string | null;
  users: User[];
  workspaces: Workspace[];
  memberships: Membership[];
  invites: Invite[];
  projects: Project[];
  tasks: Task[];
  auditLogs: AuditLog[];
  preferences: UserPreference[];
  plans: WorkspacePlan[];
  usage: WorkspaceUsage[];
  sprints: Sprint[];
  wikiPages: WikiPage[];
  comments: Comment[];
  notifications: Notification[];
}

interface AppContextType extends AppState {
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  switchWorkspace: (id: string) => void;
  createWorkspace: (name: string, slug: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  archiveWorkspace: (id: string) => void;
  deleteWorkspace: (id: string) => void;
  workspace: Workspace | undefined;
  updateWorkspaceSettings: (updates: any) => void;
  deleteProject: (id: string) => void;
  createWikiPage: (page: Partial<WikiPage>) => void;
  updateWikiPage: (id: string, updates: Partial<WikiPage>) => void;
  userRoleInWorkspace: UserRole | undefined;
  can: (action: string) => boolean;
  inviteUser: (email: string, role: UserRole) => void;
  updateMemberRole: (userId: string, role: UserRole) => void;
  updateMemberStatus: (userId: string, status: MembershipStatus) => void;
  removeMember: (userId: string) => void;
  bulkUpdateMembers: (userIds: string[], updates: Partial<Membership>) => void;
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateUserPreferences: (updates: Partial<UserPreference>) => void;
  upgradePlan: (plan: PlanType) => void;
  addAuditLog: (action: string, targetType: string, targetId: string, metadata?: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_DATA: AppState = {
  currentUser: {
    id: 'u1', name: 'Aslam Admin', email: 'admin@aslam.pm', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aslam',
    timezone: 'UTC', status: 'ACTIVE', emailVerified: true, createdAt: new Date().toISOString()
  },
  currentWorkspaceId: 'w1',
  users: [
    { id: 'u1', name: 'Aslam Admin', email: 'admin@aslam.pm', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aslam', emailVerified: true, createdAt: new Date().toISOString() },
    { id: 'u2', name: 'Jane Dev', email: 'jane@aslam.pm', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', emailVerified: true, createdAt: new Date().toISOString() },
    { id: 'u3', name: 'Bob Product', email: 'bob@aslam.pm', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', emailVerified: true, createdAt: new Date().toISOString() }
  ],
  workspaces: [
    { 
      id: 'w1', name: 'Engineering Hub', slug: 'eng-hub', ownerId: 'u1', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      branding: { primaryColor: 'ocean', surfaceStyle: 'glass' },
      localization: { timezone: 'UTC', dateFormat: 'MMM d, yyyy', timeFormat: '24h', weekStartDay: 1 },
      settings: { theme: 'light', accent: 'ocean', reduceMotion: false }
    }
  ],
  memberships: [
    { workspaceId: 'w1', userId: 'u1', role: 'OWNER', status: 'ACTIVE', joinedAt: new Date().toISOString() },
    { workspaceId: 'w1', userId: 'u2', role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date().toISOString() },
    { workspaceId: 'w1', userId: 'u3', role: 'ADMIN', status: 'ACTIVE', joinedAt: new Date().toISOString() }
  ],
  plans: [
    { workspaceId: 'w1', plan: 'PRO', status: 'ACTIVE', maxMembers: 20, maxProjects: 15, storageQuotaGb: 10 }
  ],
  usage: [
    { workspaceId: 'w1', membersCount: 3, projectsCount: 2, storageBytes: 512 * 1024 * 1024 }
  ],
  invites: [],
  projects: [
    { 
      id: 'p1', workspaceId: 'w1', name: 'Mobile App Revamp', key: 'MAR', status: 'ACTIVE', leadId: 'u1', members: ['u1', 'u2', 'u3'], issueTypes: ['STORY', 'BUG', 'TASK'],
      workflow: [
        { id: 'todo', label: 'To Do', category: 'TODO' },
        { id: 'in_progress', label: 'In Progress', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Done', category: 'DONE' }
      ]
    },
    { 
      id: 'p2', workspaceId: 'w1', name: 'Backend Infrastructure', key: 'INF', status: 'ACTIVE', leadId: 'u2', members: ['u1', 'u2'], issueTypes: ['STORY', 'BUG', 'TASK'],
      workflow: [
        { id: 'todo', label: 'Backlog', category: 'TODO' },
        { id: 'in_progress', label: 'Developing', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Deployed', category: 'DONE' }
      ]
    }
  ],
  tasks: Array.from({ length: 20 }).map((_, i) => ({
    id: `t${i + 1}`,
    projectId: i < 10 ? 'p1' : 'p2',
    number: (i % 10) + 1,
    title: [
      'Design new authentication flow', 'Fix latency on dashboard charts', 'Implement rich text for tasks', 
      'Add multi-tenant isolation', 'Set up GitHub Actions', 'Audit log implementation', 
      'User profile redesign', 'Dark mode support', 'Sprint planning UI', 'Mobile responsiveness fix',
      'Optimize database queries', 'Kubernetes cluster setup', 'Redis caching layer', 
      'S3 bucket configuration', 'Internal API documentation', 'Billing system integration',
      'Error boundary implementation', 'Unit tests for core services', 'Load balancer tuning', 'SSL certificate renewal'
    ][i],
    description: 'This is a sample task description providing context for the mission.',
    type: i % 3 === 0 ? 'BUG' : (i % 4 === 0 ? 'STORY' : 'TASK'),
    status: i % 4 === 0 ? 'done' : (i % 2 === 0 ? 'in_progress' : 'todo'),
    priority: i % 5 === 0 ? 'URGENT' : (i % 3 === 0 ? 'HIGH' : 'MEDIUM'),
    assigneeId: i % 2 === 0 ? 'u1' : (i % 3 === 0 ? 'u2' : 'u3'),
    reporterId: 'u1',
    dueDate: new Date(Date.now() + (i - 10) * 86400000).toISOString(),
    estimate: (i % 5) + 1,
    labels: i % 2 === 0 ? ['frontend'] : ['backend'],
    links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })),
  sprints: [
    { id: 's1', projectId: 'p1', name: 'Sprint 24: Core UI', status: 'ACTIVE', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 14 * 86400000).toISOString() }
  ],
  wikiPages: [
    { id: 'w1', projectId: 'p1', title: 'Onboarding Guide', content: 'Welcome to the Mobile App Revamp project...', updatedBy: 'u1', updatedAt: new Date().toISOString() }
  ],
  comments: [],
  notifications: [],
  auditLogs: [],
  preferences: [
    { userId: 'u1', theme: 'light', accent: 'ocean', notifications: { email: true, push: true, mentions: true } }
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aslam_pm_v5_final');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('aslam_pm_v5_final', JSON.stringify(state));
    const userPref = state.preferences.find(p => p.userId === state.currentUser?.id);
    const workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId);
    
    if (userPref) {
      document.documentElement.setAttribute('data-theme', userPref.theme);
      document.documentElement.setAttribute('data-accent', workspace?.branding?.primaryColor || userPref.accent);
      if (userPref.theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const addAuditLog = useCallback((action: string, targetType: string, targetId: string, metadata?: any) => {
    if (!state.currentUser || !state.currentWorkspaceId) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`, workspaceId: state.currentWorkspaceId, actorId: state.currentUser.id,
      action, targetType, targetId, metadata, createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, auditLogs: [newLog, ...prev.auditLogs] }));
  }, [state.currentUser, state.currentWorkspaceId]);

  const currentWorkspace = useMemo(() => state.workspaces.find(w => w.id === state.currentWorkspaceId), [state.workspaces, state.currentWorkspaceId]);

  const userRoleInWorkspace = useMemo(() => {
    if (!state.currentUser || !state.currentWorkspaceId) return undefined;
    return state.memberships.find(m => m.userId === state.currentUser?.id && m.workspaceId === state.currentWorkspaceId)?.role;
  }, [state.currentUser, state.currentWorkspaceId, state.memberships]);

  const can = useCallback((action: string): boolean => {
    const role = userRoleInWorkspace;
    if (!role) return false;
    if (role === 'OWNER') return true;
    if (role === 'ADMIN') return !['DELETE_WORKSPACE', 'MANAGE_BILLING', 'ARCHIVE_WORKSPACE'].includes(action);
    if (role === 'MEMBER') return ['CREATE_TASK', 'EDIT_TASK', 'COMMENT', 'VIEW_REPORTS', 'VIEW_MEMBERS'].includes(action);
    if (role === 'VIEWER') return ['VIEW_REPORTS', 'VIEW_MEMBERS'].includes(action);
    return false;
  }, [userRoleInWorkspace]);

  const login = (email: string) => {
    const user = state.users.find(u => u.email === email);
    if (user) setState(prev => ({ ...prev, currentUser: user }));
    else alert('User not found. Try admin@aslam.pm');
  };

  const logout = () => setState(prev => ({ ...prev, currentUser: null, currentWorkspaceId: null }));
  const switchWorkspace = (id: string) => setState(prev => ({ ...prev, currentWorkspaceId: id }));

  const createWorkspace = (name: string, slug: string) => {
    if (!state.currentUser) return;
    const wsId = `w${Date.now()}`;
    const newWs: Workspace = { 
      id: wsId, name, slug: slug.toLowerCase().replace(/\s+/g, '-'), ownerId: state.currentUser.id, 
      status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      branding: { primaryColor: 'ocean', surfaceStyle: 'glass' },
      localization: { timezone: 'UTC', dateFormat: 'MMM d, yyyy', timeFormat: '24h', weekStartDay: 1 },
      settings: { theme: 'light', accent: 'ocean', reduceMotion: false }
    };
    const membership: Membership = { workspaceId: wsId, userId: state.currentUser.id, role: 'OWNER', status: 'ACTIVE', joinedAt: new Date().toISOString() };
    const plan: WorkspacePlan = { workspaceId: wsId, plan: 'FREE', status: 'ACTIVE', maxMembers: 5, maxProjects: 3, storageQuotaGb: 1 };
    const usage: WorkspaceUsage = { workspaceId: wsId, membersCount: 1, projectsCount: 0, storageBytes: 0 };
    
    setState(prev => ({ 
      ...prev, workspaces: [...prev.workspaces, newWs], memberships: [...prev.memberships, membership], 
      plans: [...prev.plans, plan], usage: [...prev.usage, usage], currentWorkspaceId: wsId 
    }));
    addAuditLog('WORKSPACE_CREATE', 'WORKSPACE', wsId);
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    if (!can('MANAGE_SETTINGS')) return;
    setState(prev => ({ ...prev, workspaces: prev.workspaces.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w) }));
    addAuditLog('WORKSPACE_UPDATE', 'WORKSPACE', id, updates);
  };

  const updateWorkspaceSettings = (updates: any) => {
    if (!state.currentWorkspaceId) return;
    setState(prev => ({ ...prev, workspaces: prev.workspaces.map(w => w.id === state.currentWorkspaceId ? { ...w, settings: { ...w.settings, ...updates }, updatedAt: new Date().toISOString() } : w) }));
  };

  const archiveWorkspace = (id: string) => {
    if (!can('ARCHIVE_WORKSPACE')) return;
    setState(prev => ({ ...prev, workspaces: prev.workspaces.map(w => w.id === id ? { ...w, status: 'ARCHIVED', archivedAt: new Date().toISOString() } : w) }));
    addAuditLog('WORKSPACE_ARCHIVE', 'WORKSPACE', id);
  };

  const deleteWorkspace = (id: string) => {
    if (!can('DELETE_WORKSPACE')) return;
    setState(prev => ({ ...prev, workspaces: prev.workspaces.map(w => w.id === id ? { ...w, status: 'DELETED', deletedAt: new Date().toISOString() } : w) }));
    addAuditLog('WORKSPACE_DELETE', 'WORKSPACE', id);
  };

  const inviteUser = (email: string, role: UserRole) => {
    if (!can('INVITE_USERS')) return;
    const plan = state.plans.find(p => p.workspaceId === state.currentWorkspaceId);
    const usage = state.usage.find(u => u.workspaceId === state.currentWorkspaceId);
    if (plan && usage && usage.membersCount >= plan.maxMembers) {
      alert(`Plan limit reached! Upgrade your plan.`);
      return;
    }
    const newInvite: Invite = {
      id: `i${Date.now()}`, workspaceId: state.currentWorkspaceId!, email, role, token: Math.random().toString(36).substring(7),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(), status: 'PENDING', invitedBy: state.currentUser!.id
    };
    setState(prev => ({ ...prev, invites: [...prev.invites, newInvite] }));
    addAuditLog('USER_INVITE', 'USER', email, { role });
  };

  const updateMemberRole = (userId: string, role: UserRole) => {
    if (!can('MANAGE_ROLES')) return;
    setState(prev => ({ ...prev, memberships: prev.memberships.map(m => m.workspaceId === state.currentWorkspaceId && m.userId === userId ? { ...m, role } : m) }));
    addAuditLog('MEMBER_ROLE_CHANGE', 'USER', userId, { role });
  };

  const updateMemberStatus = (userId: string, status: MembershipStatus) => {
    if (!can('MANAGE_MEMBERS')) return;
    setState(prev => ({ ...prev, memberships: prev.memberships.map(m => m.workspaceId === state.currentWorkspaceId && m.userId === userId ? { ...m, status, suspendedAt: status === 'SUSPENDED' ? new Date().toISOString() : undefined } : m) }));
    addAuditLog(`MEMBER_${status}`, 'USER', userId);
  };

  const removeMember = (userId: string) => {
    if (!can('MANAGE_MEMBERS')) return;
    const isOwner = state.memberships.find(m => m.userId === userId && m.workspaceId === state.currentWorkspaceId)?.role === 'OWNER';
    if (isOwner) {
      const otherOwners = state.memberships.filter(m => m.workspaceId === state.currentWorkspaceId && m.role === 'OWNER' && m.userId !== userId);
      if (otherOwners.length === 0) { alert("Cannot remove the last owner."); return; }
    }
    setState(prev => ({ ...prev, memberships: prev.memberships.filter(m => !(m.workspaceId === state.currentWorkspaceId && m.userId === userId)), usage: prev.usage.map(u => u.workspaceId === state.currentWorkspaceId ? { ...u, membersCount: Math.max(0, u.membersCount - 1) } : u) }));
    addAuditLog('MEMBER_REMOVE', 'USER', userId);
  };

  const bulkUpdateMembers = (userIds: string[], updates: Partial<Membership>) => {
    if (!can('MANAGE_MEMBERS')) return;
    setState(prev => ({ ...prev, memberships: prev.memberships.map(m => userIds.includes(m.userId) && m.workspaceId === state.currentWorkspaceId ? { ...m, ...updates } : m) }));
  };

  const upgradePlan = (planName: PlanType) => {
    if (!can('MANAGE_BILLING')) return;
    const limits = { FREE: { maxMembers: 5, maxProjects: 3, storageQuotaGb: 1 }, PRO: { maxMembers: 20, maxProjects: 15, storageQuotaGb: 10 }, BUSINESS: { maxMembers: 100, maxProjects: 100, storageQuotaGb: 100 } };
    setState(prev => ({ ...prev, plans: prev.plans.map(p => p.workspaceId === state.currentWorkspaceId ? { ...p, plan: planName, ...limits[planName] } : p) }));
    addAuditLog('PLAN_UPGRADE', 'BILLING', planName);
  };

  const addProject = (project: Partial<Project>) => {
    if (!can('CREATE_PROJECT')) return;
    const plan = state.plans.find(p => p.workspaceId === state.currentWorkspaceId);
    const usage = state.usage.find(u => u.workspaceId === state.currentWorkspaceId);
    if (plan && usage && usage.projectsCount >= plan.maxProjects) { alert("Project limit reached!"); return; }
    const newProjectId = `p${Date.now()}`;
    setState(prev => ({ ...prev, projects: [...prev.projects, { ...project, id: newProjectId, workspaceId: state.currentWorkspaceId! } as Project], usage: prev.usage.map(u => u.workspaceId === state.currentWorkspaceId ? { ...u, projectsCount: u.projectsCount + 1 } : u) }));
    addAuditLog('PROJECT_CREATE', 'PROJECT', newProjectId);
  };

  const addTask = (task: Partial<Task>) => {
    const newTaskId = `t${Date.now()}`;
    const newTask: Task = { ...task, id: newTaskId, number: state.tasks.filter(t => t.projectId === task.projectId).length + 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), labels: task.labels || [], links: task.links || [] } as Task;
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    addAuditLog('TASK_CREATE', 'TASK', newTaskId);
  };

  const value = {
    ...state, workspace: currentWorkspace, login, signup: () => {}, logout, switchWorkspace, createWorkspace, updateWorkspace, archiveWorkspace, deleteWorkspace,
    userRoleInWorkspace, can, inviteUser, updateMemberRole, updateMemberStatus, removeMember, bulkUpdateMembers, upgradePlan,
    addTask, updateTask: (id: string, updates: any) => setState(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
    deleteTask: (id: string) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) })),
    addProject, updateProject: (id: string, updates: any) => setState(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p) })),
    deleteProject: (id: string) => setState(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) })),
    createWikiPage: (p: any) => setState(prev => ({ ...prev, wikiPages: [...prev.wikiPages, { ...p, id: `w${Date.now()}`, updatedAt: new Date().toISOString() }] })),
    updateWikiPage: (id: string, u: any) => setState(prev => ({ ...prev, wikiPages: prev.wikiPages.map(p => p.id === id ? { ...p, ...u } : p) })),
    updateWorkspaceSettings, updateUserPreferences: (u: any) => setState(prev => ({ ...prev, preferences: prev.preferences.map(p => p.userId === state.currentUser?.id ? { ...p, ...u } : p) })), addAuditLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
