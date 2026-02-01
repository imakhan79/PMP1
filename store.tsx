
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, Workspace, Project, Task, Membership, Invite,
  UserPreference, AuditLog, UserRole, Notification,
  Comment, WikiPage, WorkspacePlan, WorkspaceUsage, MembershipStatus,
  PlanType, WorkspaceStatus, Sprint, WorkflowStatus, TimeEntry
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
  timeEntries: TimeEntry[];
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
  markNotificationRead: (id: string) => void;
  logTime: (entry: Partial<TimeEntry>) => void;
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
    { id: 'u3', name: 'Bob Product', email: 'bob@aslam.pm', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', emailVerified: true, createdAt: new Date().toISOString() },
    { id: 'u4', name: 'Sarah Designer', email: 'sarah@aslam.pm', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', emailVerified: true, createdAt: new Date().toISOString() },
    { id: 'u5', name: 'Mike QA', email: 'mike@aslam.pm', timezone: 'UTC', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', emailVerified: true, createdAt: new Date().toISOString() }
  ],
  workspaces: [
    { 
      id: 'w1', name: 'Aslam PM Global', slug: 'aslam-global', ownerId: 'u1', status: 'ACTIVE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      branding: { primaryColor: 'ocean', surfaceStyle: 'glass' },
      localization: { timezone: 'UTC', dateFormat: 'MMM d, yyyy', timeFormat: '24h', weekStartDay: 1 },
      settings: { theme: 'light', accent: 'ocean', reduceMotion: false }
    }
  ],
  memberships: [
    { workspaceId: 'w1', userId: 'u1', role: 'OWNER', status: 'ACTIVE', joinedAt: new Date().toISOString() },
    { workspaceId: 'w1', userId: 'u2', role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date().toISOString() },
    { workspaceId: 'w1', userId: 'u3', role: 'ADMIN', status: 'ACTIVE', joinedAt: new Date().toISOString() },
    { workspaceId: 'w1', userId: 'u4', role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date().toISOString() },
    { workspaceId: 'w1', userId: 'u5', role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date().toISOString() }
  ],
  plans: [
    { workspaceId: 'w1', plan: 'BUSINESS', status: 'ACTIVE', maxMembers: 100, maxProjects: 50, storageQuotaGb: 100 }
  ],
  usage: [
    { workspaceId: 'w1', membersCount: 5, projectsCount: 6, storageBytes: 1024 * 1024 * 1024 * 4 }
  ],
  invites: [],
  projects: [
    { 
      id: 'p1', workspaceId: 'w1', name: 'Mobile App Revamp', key: 'MAR', status: 'ACTIVE', leadId: 'u1', members: ['u1', 'u2', 'u3', 'u4'], taskTypes: ['STORY', 'BUG', 'TASK'],
      workflow: [
        { id: 'todo', label: 'To Do', category: 'TODO' },
        { id: 'in_progress', label: 'In Progress', category: 'IN_PROGRESS' },
        { id: 'review', label: 'Review', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Done', category: 'DONE' }
      ]
    },
    { 
      id: 'p2', workspaceId: 'w1', name: 'Cloud Infrastructure', key: 'CLD', status: 'ACTIVE', leadId: 'u2', members: ['u1', 'u2', 'u5'], taskTypes: ['STORY', 'BUG', 'TASK'],
      workflow: [
        { id: 'todo', label: 'Backlog', category: 'TODO' },
        { id: 'in_progress', label: 'Developing', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Deployed', category: 'DONE' }
      ]
    },
    { 
      id: 'p3', workspaceId: 'w1', name: 'Marketing Web 2025', key: 'MKT', status: 'ACTIVE', leadId: 'u4', members: ['u1', 'u4', 'u3'], taskTypes: ['TASK', 'STORY'],
      workflow: [
        { id: 'todo', label: 'Next Up', category: 'TODO' },
        { id: 'in_progress', label: 'Building', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Live', category: 'DONE' }
      ]
    },
    { 
      id: 'p4', workspaceId: 'w1', name: 'Support Portal', key: 'SUP', status: 'ACTIVE', leadId: 'u3', members: ['u3', 'u2', 'u5'], taskTypes: ['BUG', 'TASK'],
      workflow: [
        { id: 'todo', label: 'Triage', category: 'TODO' },
        { id: 'in_progress', label: 'Fixing', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Resolved', category: 'DONE' }
      ]
    },
    { 
      id: 'p5', workspaceId: 'w1', name: 'AI Integration Engine', key: 'AIE', status: 'ACTIVE', leadId: 'u1', members: ['u1', 'u2', 'u3', 'u4', 'u5'], taskTypes: ['STORY', 'EPIC', 'TASK'],
      workflow: [
        { id: 'todo', label: 'Analysis', category: 'TODO' },
        { id: 'in_progress', label: 'Training', category: 'IN_PROGRESS' },
        { id: 'testing', label: 'Testing', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Production', category: 'DONE' }
      ]
    },
    { 
      id: 'p6', workspaceId: 'w1', name: 'Security Audit 2.0', key: 'SEC', status: 'ACTIVE', leadId: 'u5', members: ['u5', 'u1', 'u2'], taskTypes: ['TASK', 'BUG'],
      workflow: [
        { id: 'todo', label: 'Identify', category: 'TODO' },
        { id: 'in_progress', label: 'Patching', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Certified', category: 'DONE' }
      ]
    }
  ],
  tasks: Array.from({ length: 80 }).map((_, i) => {
    const projectIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    const pId = projectIds[i % 6];
    const userIds = ['u1', 'u2', 'u3', 'u4', 'u5'];
    
    const titles = [
      'Initialize React Native project', 'Setup PostgreSQL cluster', 'Draft marketing copy', 'Fix login bug',
      'Design UI components', 'Configure Redis cache', 'Social media integration', 'API rate limiting',
      'User onboarding flow', 'Dockerize microservices', 'SEO optimization', 'Help center articles',
      'Performance profiling', 'SSL certificate renewal', 'Content management system', 'Feedback loop setup',
      'In-app notifications', 'Data migration scripts', 'Lead generation form', 'Live chat integration',
      'Dark mode support', 'Kubernetes deployment', 'Banner assets design', 'Zendesk integration',
      'Bug: Memory leak in list view', 'Refactor database models', 'Newsletter template', 'Password reset fix',
      'Unit testing core utils', 'Terraform infrastructure', 'Landing page A/B test', 'Ticket priority logic',
      'Audit log frontend', 'VPC network setup', 'Blog post: Product Launch', 'Sentry error tracking',
      'Multi-language support', 'Elasticsearch setup', 'Pricing page redesign', 'Knowledge base search',
      'Accessibility audit', 'Database backups', 'Affiliate program UI', 'Auto-assignment logic',
      'Deep linking setup', 'Security patch 2.4', 'Testimonials section', 'Agent dashboard fixes',
      'Analytics dashboard', 'CI/CD pipeline hardening', 'LLM Prompt Engineering', 'Vector Database Selection',
      'Penetration Testing Scope', 'Auth0 Integration', 'GraphQL Schema Refactor', 'Mobile Push Certs',
      'E2E Testing Suite', 'Prometheus Monitoring', 'Grafana Dashboard Setup', 'API Documentation v2',
      'Stripe Webhook Handler', 'PDF Invoice Generator', 'User Data Export Tool', 'Slack Bot Integration',
      'On-prem Deployment Guide', 'Firewall Policy Update', 'OAuth2 Flow Audit', 'GDPR Compliance Check',
      'Redis Pub/Sub Layer', 'Websocket Scaling', 'Frontend Build Optimization', 'Image Compression Service',
      'Backup Recovery Drill', 'Network Topology Map', 'Kubernetes Ingress Tweaks', 'Multi-region Failover',
      'Data Lake Ingestion', 'ETL Pipeline Job', 'System Health Monitor', 'Nightly Maintenance Script'
    ];

    return {
      id: `t${i + 1}`,
      projectId: pId,
      number: Math.floor(i / 6) + 1,
      title: titles[i % titles.length],
      description: `Operational mission item #${i + 1}. Crucial for project trajectory. Reference documentation in the wiki for technical specifics and compliance requirements.`,
      type: i % 10 === 0 ? 'EPIC' : (i % 5 === 0 ? 'BUG' : (i % 3 === 0 ? 'STORY' : 'TASK')),
      status: i % 7 === 0 ? 'done' : (i % 2 === 0 ? 'in_progress' : 'todo'),
      priority: i % 15 === 0 ? 'URGENT' : (i % 4 === 0 ? 'HIGH' : 'MEDIUM'),
      assigneeId: userIds[i % 5],
      reporterId: 'u1',
      dueDate: new Date(Date.now() + (i - 20) * 86400000).toISOString(),
      estimate: (i % 5) + 1,
      labels: i % 2 === 0 ? ['critical', 'sprint-ready'] : ['next-up', 'exploration'],
      links: [],
      createdAt: new Date(Date.now() - i * 3600000 * 2).toISOString(),
      updatedAt: new Date().toISOString()
    };
  }),
  sprints: [
    { id: 's1', projectId: 'p1', name: 'Sprint 1: Architecture', status: 'COMPLETED', startDate: new Date(Date.now() - 45 * 86400000).toISOString(), endDate: new Date(Date.now() - 31 * 86400000).toISOString() },
    { id: 's2', projectId: 'p1', name: 'Sprint 2: UI/UX', status: 'ACTIVE', startDate: new Date(Date.now() - 2 * 86400000).toISOString(), endDate: new Date(Date.now() + 12 * 86400000).toISOString() },
    { id: 's3', projectId: 'p2', name: 'Cloud Migration Phase 1', status: 'ACTIVE', startDate: new Date(Date.now() - 5 * 86400000).toISOString(), endDate: new Date(Date.now() + 25 * 86400000).toISOString() },
    { id: 's4', projectId: 'p5', name: 'AI Model Training v1', status: 'ACTIVE', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 14 * 86400000).toISOString() }
  ],
  wikiPages: [
    { id: 'w1', projectId: 'p1', title: 'Tech Stack Overview', content: 'Our project leverages React Native for cross-platform mobile development...', updatedBy: 'u1', updatedAt: new Date().toISOString() },
    { id: 'w2', projectId: 'p1', title: 'Coding Standards', content: 'We follow a strict ESLint/Prettier configuration to ensure code quality...', updatedBy: 'u2', updatedAt: new Date().toISOString() },
    { id: 'w3', projectId: 'p2', title: 'AWS Resource Map', content: 'Detailed topology of our VPC, Subnets, and S3 bucket access policies...', updatedBy: 'u2', updatedAt: new Date().toISOString() },
    { id: 'w4', projectId: 'p3', title: 'Brand Identity', content: 'Guidelines for typography, color palettes, and voice tone for marketing...', updatedBy: 'u4', updatedAt: new Date().toISOString() },
    { id: 'w5', projectId: 'p5', title: 'LLM Fine-tuning strategy', content: 'How we plan to use proprietary data to tune the underlying models...', updatedBy: 'u1', updatedAt: new Date().toISOString() },
    { id: 'w6', projectId: 'p6', title: 'Incident Response Plan', content: 'Step-by-step procedure for handling security breaches or data leaks...', updatedBy: 'u5', updatedAt: new Date().toISOString() }
  ],
  comments: [
    { id: 'c1', taskId: 't1', userId: 'u2', content: 'Initial boilerplate is pushed to the repo.', createdAt: new Date().toISOString() },
    { id: 'c2', taskId: 't4', userId: 'u5', content: 'Confirmed the fix for the race condition in auth.', createdAt: new Date().toISOString() },
    { id: 'c3', taskId: 't51', userId: 'u3', content: 'We need to benchmark different model providers.', createdAt: new Date().toISOString() }
  ],
  notifications: [
    { id: 'n1', userId: 'u1', title: 'Critical Bug Assigned', message: 'Task "Fix login bug" assigned to your queue.', read: false, createdAt: new Date().toISOString() },
    { id: 'n2', userId: 'u1', title: 'Sprint Report Ready', message: 'Sprint 1 report has been generated.', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'n3', userId: 'u1', title: 'Wiki Update', message: 'Sarah updated "Brand Identity" in Project MKT.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() }
  ],
  timeEntries: Array.from({ length: 40 }).map((_, i) => ({
    id: `te${i + 1}`,
    taskId: `t${(i % 30) + 1}`,
    userId: ['u1', 'u2', 'u3', 'u4', 'u5'][i % 5],
    duration: [15, 30, 45, 60, 120, 180][i % 6],
    note: ['Coding', 'Meetings', 'Research', 'Code Review', 'Pair Programming', 'Documentation'][i % 6],
    date: new Date(Date.now() - (i % 14) * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  })),
  auditLogs: [
    { id: 'log1', workspaceId: 'w1', actorId: 'u1', action: 'WORKSPACE_CREATE', targetType: 'WORKSPACE', targetId: 'w1', createdAt: new Date(Date.now() - 518400000).toISOString() },
    { id: 'log2', workspaceId: 'w1', actorId: 'u1', action: 'MEMBER_INVITE', targetType: 'USER', targetId: 'u2', createdAt: new Date(Date.now() - 432000000).toISOString() },
    { id: 'log3', workspaceId: 'w1', actorId: 'u1', action: 'PROJECT_CREATE', targetType: 'PROJECT', targetId: 'p1', createdAt: new Date(Date.now() - 345600000).toISOString() },
    { id: 'log4', workspaceId: 'w1', actorId: 'u1', action: 'PROJECT_CREATE', targetType: 'PROJECT', targetId: 'p5', createdAt: new Date(Date.now() - 172800000).toISOString() }
  ],
  preferences: [
    { userId: 'u1', theme: 'light', accent: 'ocean', notifications: { email: true, push: true, mentions: true } }
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aslam_pm_v9_prod');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('aslam_pm_v9_prod', JSON.stringify(state));
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
    if (role === 'MEMBER') return ['CREATE_TASK', 'EDIT_TASK', 'COMMENT', 'VIEW_REPORTS', 'VIEW_MEMBERS', 'CREATE_PROJECT'].includes(action);
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

  const markNotificationRead = (id: string) => {
    setState(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  };

  const logTime = (entry: Partial<TimeEntry>) => {
    const newEntry: TimeEntry = { ...entry, id: `te-${Date.now()}`, createdAt: new Date().toISOString() } as TimeEntry;
    setState(prev => ({ ...prev, timeEntries: [...prev.timeEntries, newEntry] }));
    addAuditLog('TIME_LOG', 'TASK', entry.taskId!);
  };

  const value = {
    ...state, workspace: currentWorkspace, login, signup: () => {}, logout, switchWorkspace, createWorkspace, updateWorkspace: (id: string, updates: any) => setState(prev => ({ ...prev, workspaces: prev.workspaces.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w) })), archiveWorkspace: (id: string) => {}, deleteWorkspace: (id: string) => {},
    userRoleInWorkspace, can, inviteUser: (email: string, role: UserRole) => {}, updateMemberRole: (userId: string, role: UserRole) => {}, updateMemberStatus: (userId: string, status: MembershipStatus) => {}, removeMember: (userId: string) => {}, bulkUpdateMembers: (userIds: string[], updates: Partial<Membership>) => {}, upgradePlan: (plan: PlanType) => {},
    addTask: (task: Partial<Task>) => {
      const newTaskId = `t${Date.now()}`;
      const newTask: Task = { ...task, id: newTaskId, number: state.tasks.filter(t => t.projectId === task.projectId).length + 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), labels: task.labels || [], links: task.links || [] } as Task;
      setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    },
    updateTask: (id: string, updates: any) => setState(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
    deleteTask: (id: string) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) })),
    addProject: (p: any) => {
      const newProj = { ...p, id: `p${Date.now()}`, workflow: [
        { id: 'todo', label: 'To Do', category: 'TODO' },
        { id: 'in_progress', label: 'In Progress', category: 'IN_PROGRESS' },
        { id: 'done', label: 'Done', category: 'DONE' }
      ] };
      setState(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
    },
    updateProject: (id: string, updates: any) => setState(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p) })),
    deleteProject: (id: string) => setState(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) })),
    createWikiPage: (p: any) => setState(prev => ({ ...prev, wikiPages: [...prev.wikiPages, { ...p, id: `w${Date.now()}`, updatedAt: new Date().toISOString() }] })),
    updateWikiPage: (id: string, u: any) => setState(prev => ({ ...prev, wikiPages: prev.wikiPages.map(p => p.id === id ? { ...p, ...u } : p) })),
    updateWorkspaceSettings: (updates: any) => setState(prev => ({ ...prev, workspaces: prev.workspaces.map(w => w.id === state.currentWorkspaceId ? { ...w, settings: { ...w.settings, ...updates }, updatedAt: new Date().toISOString() } : w) })),
    updateUserPreferences: (u: any) => setState(prev => ({ ...prev, preferences: prev.preferences.map(p => p.userId === state.currentUser?.id ? { ...p, ...u } : p) })),
    addAuditLog, markNotificationRead, logTime
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
