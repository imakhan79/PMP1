
export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'ocean' | 'aurora' | 'forest' | 'ember' | 'slate' | 'sunrise';

export type WorkspaceStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';
export type MembershipStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';
export type PlanType = 'FREE' | 'PRO' | 'BUSINESS';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
  status: 'ACTIVE' | 'INACTIVE';
  emailVerified: boolean;
  passwordHash?: string;
  createdAt: string;
}

export interface UserPreference {
  userId: string;
  theme: ThemeMode;
  accent: AccentColor;
  notifications: {
    email: boolean;
    push: boolean;
    mentions: boolean;
  };
}

export interface WorkspaceBranding {
  primaryColor: string;
  surfaceStyle: 'glass' | 'solid' | 'minimal';
  logoUrl?: string;
}

export interface WorkspaceLocalization {
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  weekStartDay: 0 | 1 | 6; // Sun, Mon, Sat
}

export interface WorkspaceSettings {
  theme: ThemeMode;
  accent: AccentColor;
  reduceMotion: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  ownerId: string;
  status: WorkspaceStatus;
  branding: WorkspaceBranding;
  localization: WorkspaceLocalization;
  settings: WorkspaceSettings;
  archivedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  workspaceId: string;
  userId: string;
  role: UserRole;
  status: MembershipStatus;
  joinedAt: string;
  suspendedAt?: string;
}

export interface WorkspacePlan {
  workspaceId: string;
  plan: PlanType;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  maxMembers: number;
  maxProjects: number;
  storageQuotaGb: number;
}

export interface WorkspaceUsage {
  workspaceId: string;
  membersCount: number;
  projectsCount: number;
  storageBytes: number;
}

export interface Invite {
  id: string;
  workspaceId: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
  invitedBy: string;
}

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'PLANNING';
export type TaskType = 'STORY' | 'TASK' | 'BUG' | 'EPIC';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = string;

export interface WorkflowStatus {
  id: string;
  label: string;
  category: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
  wipLimit?: number;
  allowedRoles?: UserRole[];
}

export interface TaskLink {
  type: 'BLOCKS' | 'BLOCKED_BY' | 'RELATES_TO';
  targetTaskId: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  description?: string;
  status: ProjectStatus;
  leadId: string;
  members: string[];
  workflow: WorkflowStatus[];
  taskTypes: TaskType[];
}

export interface Task {
  id: string;
  projectId: string;
  number: number;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  reporterId: string;
  dueDate?: string;
  estimate?: number; 
  labels: string[];
  links: TaskLink[];
  epicId?: string;
  sprintId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WikiPage {
  id: string;
  projectId: string;
  title: string;
  content: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  startDate: string;
  endDate: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: any;
  createdAt: string;
}
