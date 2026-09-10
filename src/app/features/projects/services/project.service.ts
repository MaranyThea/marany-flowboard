import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Milestone, Project, ProjectTask, SubProjectItem } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projects: Project[] = [
    {
      id: 1,
      name: 'Test1',
      description: 'Work related test project',
      domain: 'work',
      status: 'on-track',
      due: '',
      progress: 0,
      openTasks: 0,
      totalTasks: 0,
      tasksSummary: { todo: 0, inProgress: 0, done: 0 },
      tasks: [],
      milestones: [],
      subProjects: [],
      createdAt: '2026-08-18'
    },
    {
      id: 2,
      name: 'FlowBoard',
      description: 'Personal productivity & task management board',
      domain: 'side-project',
      status: 'on-track',
      due: '30 Sep 2026',
      progress: 0,
      openTasks: 4,
      totalTasks: 4,
      tasksSummary: { todo: 4, inProgress: 0, done: 0 },
      tasks: [],
      nextTask: 'Btn New Project',
      milestones: [],
      subProjects: [
        { id: 201, name: 'Users', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0, tasksSummary: { todo: 0, inProgress: 0, done: 0 }, tasks: [], subProjects: [] },
        { id: 202, name: 'Analytics', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0, tasksSummary: { todo: 0, inProgress: 0, done: 0 }, tasks: [], subProjects: [] },
        { id: 203, name: 'Dashboard', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0, tasksSummary: { todo: 0, inProgress: 0, done: 0 }, tasks: [], subProjects: [] },
        {
          id: 204,
          name: 'Projects',
          progress: 0,
          status: 'on-track',
          openTasks: 4,
          totalTasks: 4,
          tasksSummary: { todo: 4, inProgress: 0, done: 0 },
          subProjects: [],
          tasks: [
            {
              id: 1001,
              title: 'Btn New Project',
              status: 'todo',
              createdAt: 'added Sep 9',
              activity: [{ action: 'Created', timestamp: 'Sep 9, 10:43 PM' }]
            },
            {
              id: 1002,
              title: 'Project Card',
              status: 'todo',
              createdAt: 'added Sep 9',
              activity: [{ action: 'Created', timestamp: 'Sep 9, 10:43 PM' }]
            },
            {
              id: 1003,
              title: 'New Edit Page of Project Card',
              status: 'todo',
              createdAt: 'added Sep 9',
              activity: [{ action: 'Created', timestamp: 'Sep 9, 10:43 PM' }]
            },
            {
              id: 1004,
              title: 'Mark Complete btn',
              status: 'todo',
              createdAt: 'added Sep 9',
              activity: [{ action: 'Created', timestamp: 'Sep 9, 10:43 PM' }]
            }
          ]
        },
        { id: 205, name: 'Issues', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0, tasksSummary: { todo: 0, inProgress: 0, done: 0 }, tasks: [], subProjects: [] },
        { id: 206, name: 'Settings', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0, tasksSummary: { todo: 0, inProgress: 0, done: 0 }, tasks: [], subProjects: [] }
      ],
      createdAt: '2026-08-10'
    },
    {
      id: 3,
      name: 'Test',
      description: 'Side project test experimentation',
      domain: 'side-project',
      status: 'on-track',
      due: '',
      progress: 0,
      openTasks: 0,
      totalTasks: 0,
      tasksSummary: { todo: 0, inProgress: 0, done: 0 },
      tasks: [],
      milestones: [],
      subProjects: [],
      createdAt: '2026-08-05'
    }
  ];

  private readonly projectsSubject = new BehaviorSubject<Project[]>(this.projects);
  readonly projects$ = this.projectsSubject.asObservable();

  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: number): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  addProject(project: Project): void {
    this.projects = [project, ...this.projects];
    this.projectsSubject.next(this.projects);
  }

  updateProject(updatedProject: Project): void {
    const index = this.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      this.projects[index] = { ...updatedProject };
      this.recalculateProjectStats(this.projects[index]);
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  addSubProject(parentId: number, subProjectName: string): void {
    const parent = this.projects.find(p => p.id === parentId);
    if (parent) {
      const subProjects = parent.subProjects || [];
      const newSubProject: SubProjectItem = {
        id: Date.now(),
        name: subProjectName,
        progress: 0,
        status: 'on-track',
        openTasks: 0,
        totalTasks: 0,
        tasksSummary: { todo: 0, inProgress: 0, done: 0 },
        tasks: [],
        subProjects: []
      };
      parent.subProjects = [...subProjects, newSubProject];
      this.recalculateProjectStats(parent);
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  // Milestones methods
  addMilestone(projectId: number, subProjectId: number | null, title: string, due?: string): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const target = subProjectId
      ? project.subProjects?.find(s => s.id === subProjectId)
      : project;

    if (target) {
      const milestones = target.milestones || [];
      const newMilestone: Milestone = {
        id: Date.now(),
        title,
        due,
        completed: false
      };
      target.milestones = [...milestones, newMilestone];
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  toggleMilestone(projectId: number, subProjectId: number | null, milestoneId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const target = subProjectId
      ? project.subProjects?.find(s => s.id === subProjectId)
      : project;

    if (target && target.milestones) {
      const milestone = target.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.completed = !milestone.completed;
        this.projects = [...this.projects];
        this.projectsSubject.next(this.projects);
      }
    }
  }

  deleteMilestone(projectId: number, subProjectId: number | null, milestoneId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const target = subProjectId
      ? project.subProjects?.find(s => s.id === subProjectId)
      : project;

    if (target && target.milestones) {
      target.milestones = target.milestones.filter(m => m.id !== milestoneId);
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  // Tasks methods
  addTask(projectId: number, subProjectId: number | null, title: string, status: 'todo' | 'in-progress' | 'done' = 'todo', due?: string): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    const now = new Date();
    const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const newTask: ProjectTask = {
      id: Date.now(),
      title,
      status,
      due,
      createdAt: 'added Today',
      activity: [{ action: 'Created', timestamp: timeStr }]
    };

    if (subProjectId) {
      const sub = project.subProjects?.find(s => s.id === subProjectId);
      if (sub) {
        sub.tasks = [...(sub.tasks || []), newTask];
        this.recalculateSubProjectStats(sub);
      }
    } else {
      project.tasks = [...(project.tasks || []), newTask];
    }

    this.recalculateProjectStats(project);
    this.projects = [...this.projects];
    this.projectsSubject.next(this.projects);
  }

  updateTaskDetails(projectId: number, subProjectId: number | null, updatedTask: ProjectTask): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    if (subProjectId) {
      const sub = project.subProjects?.find(s => s.id === subProjectId);
      if (sub && sub.tasks) {
        const index = sub.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          sub.tasks[index] = { ...updatedTask };
          this.recalculateSubProjectStats(sub);
        }
      }
    } else if (project.tasks) {
      const index = project.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        project.tasks[index] = { ...updatedTask };
      }
    }

    this.recalculateProjectStats(project);
    this.projects = [...this.projects];
    this.projectsSubject.next(this.projects);
  }

  updateTaskStatus(projectId: number, subProjectId: number | null, taskId: number, newStatus: 'todo' | 'in-progress' | 'done'): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    if (subProjectId) {
      const sub = project.subProjects?.find(s => s.id === subProjectId);
      if (sub && sub.tasks) {
        const task = sub.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = newStatus;
          this.recalculateSubProjectStats(sub);
        }
      }
    } else if (project.tasks) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = newStatus;
      }
    }

    this.recalculateProjectStats(project);
    this.projects = [...this.projects];
    this.projectsSubject.next(this.projects);
  }

  deleteTask(projectId: number, subProjectId: number | null, taskId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    if (subProjectId) {
      const sub = project.subProjects?.find(s => s.id === subProjectId);
      if (sub && sub.tasks) {
        sub.tasks = sub.tasks.filter(t => t.id !== taskId);
        this.recalculateSubProjectStats(sub);
      }
    } else if (project.tasks) {
      project.tasks = project.tasks.filter(t => t.id !== taskId);
    }

    this.recalculateProjectStats(project);
    this.projects = [...this.projects];
    this.projectsSubject.next(this.projects);
  }

  private recalculateSubProjectStats(sub: SubProjectItem): void {
    const tasks = sub.tasks || [];
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const done = tasks.filter(t => t.status === 'done').length;

    sub.tasksSummary = { todo, inProgress, done };
    sub.totalTasks = tasks.length;
    sub.openTasks = todo + inProgress;
    sub.progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
  }

  private recalculateProjectStats(project: Project): void {
    let tasks = [...(project.tasks || [])];
    if (project.subProjects) {
      for (const sub of project.subProjects) {
        if (sub.tasks) {
          tasks = [...tasks, ...sub.tasks];
        }
      }
    }

    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const done = tasks.filter(t => t.status === 'done').length;

    project.tasksSummary = { todo, inProgress, done };
    project.totalTasks = tasks.length;
    project.openTasks = todo + inProgress;
    project.progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
  }

  toggleComplete(id: number): void {
    const project = this.projects.find(p => p.id === id);
    if (project) {
      if (project.status === 'completed') {
        project.status = 'on-track';
        project.progress = 0;
      } else {
        project.status = 'completed';
        project.progress = 100;
      }
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  toggleArchive(id: number): void {
    const project = this.projects.find(p => p.id === id);
    if (project) {
      project.isArchived = !project.isArchived;
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter(project => project.id !== id);
    this.projectsSubject.next(this.projects);
  }
}
