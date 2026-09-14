export type ProjectDomain = 'work' | 'side-project' | 'school' | 'personal';

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-track' | 'at-risk' | 'archived';

export interface Milestone {
  id: number;
  title: string;
  due?: string;
  completed?: boolean;
}

export interface TaskActivity {
  action: string;
  timestamp: string;
}

export interface ProjectTask {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due?: string;
  assignee?: string;
  notes?: string;
  createdAt?: string;
  activity?: TaskActivity[];
}

export interface TasksSummary {
  todo: number;
  inProgress: number;
  done: number;
}

export interface SubProjectItem {
  id: number;
  name: string;
  progress: number;
  status?: ProjectStatus;
  domain?: ProjectDomain;
  openTasks?: number;
  totalTasks?: number;
  tasksSummary?: TasksSummary;
  tasks?: ProjectTask[];
  milestones?: Milestone[];
  subProjects?: SubProjectItem[];
  completed?: boolean;
  createdAt?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  domain: ProjectDomain;
  status: ProjectStatus;
  due?: string;
  progress?: number;
  openTasks?: number;
  totalTasks?: number;
  tasksSummary?: TasksSummary;
  tasks?: ProjectTask[];
  nextTask?: string;
  parentId?: number | null;
  subProjects?: SubProjectItem[];
  milestones?: Milestone[];
  notes?: string;
  idleDays?: number | null;
  goal?: string;
  tags?: string[];
  repeats?: string;
  isArchived?: boolean;
  createdAt: string;
}
