
export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'ocean' | 'aurora' | 'forest' | 'ember' | 'slate' | 'sunrise';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  timezone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  ownerId: string;
  settings: {
    workingDays: number[];
    defaultTimezone: string;
    theme: ThemeMode;
    accent: AccentColor;
    reduceMotion: boolean;
  };
}

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'PLANNING';
export type IssueType = 'STORY' | 'TASK' | 'BUG' | 'EPIC';

export interface WorkflowStatus {
  id: string;
  label: string;
  category: 'TODO' | 'IN_PROGRESS' | 'DONE';
  wipLimit?: number;
  allowedRoles?: UserRole[]; // New field for RBAC transitions
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
  issueTypes: IssueType[];
}

export type TaskStatus = string;
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface IssueLink {
  type: 'BLOCKS' | 'BLOCKED_BY' | 'RELATES_TO';
  targetTaskId: string;
}

export interface Task {
  id: string;
  projectId: string;
  epicId?: string;
  number: number;
  title: string;
  description: string;
  type: IssueType;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  reporterId: string;
  dueDate?: string;
  estimate?: number; 
  originalEstimateHours?: number;
  remainingEstimateHours?: number;
  labels: string[];
  parentId?: string;
  sprintId?: string;
  links: IssueLink[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  capacity?: Record<string, number>;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  duration: number;
  date: string;
  description?: string;
  isBillable: boolean;
  status: 'PENDING' | 'APPROVED';
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  editHistory?: { content: string; editedAt: string }[];
}

export interface WikiPage {
  id: string;
  projectId: string;
  parentId?: string;
  title: string;
  content: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'MENTION' | 'ASSIGNMENT' | 'STATUS_CHANGE' | 'DUE_SOON' | 'COMMENT';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: any;
  createdAt: string;
}
