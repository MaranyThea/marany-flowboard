export type ProjectDomain = 'work' | 'side-project' | 'school' | 'personal';

export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-track' | 'at-risk' | 'archived';

export interface Milestone {
  id: number;
  title: string;
  due?: string;
  completed?: boolean;
}

export interface SubProjectItem {
  id: number;
  name: string;
  progress: number;
  status?: ProjectStatus;
  openTasks?: number;
  totalTasks?: number;
  completed?: boolean;
}

export interface TasksSummary {
  todo: number;
  inProgress: number;
  done: number;
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
