import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Milestone, Project, SubProjectItem } from '../models/project';

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
      tasksSummary: { todo: 0, inProgress: 0, done: 0 },
      nextTask: 'Btn New Project',
      milestones: [],
      subProjects: [
        { id: 201, name: 'Users', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0 },
        { id: 202, name: 'Analytics', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0 },
        { id: 203, name: 'Dashboard', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0 },
        { id: 204, name: 'Projects', progress: 0, status: 'on-track', openTasks: 4, totalTasks: 4 },
        { id: 205, name: 'Issues', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0 },
        { id: 206, name: 'Settings', progress: 0, status: 'on-track', openTasks: 0, totalTasks: 0 }
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
        totalTasks: 0
      };
      parent.subProjects = [...subProjects, newSubProject];
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  addMilestone(projectId: number, title: string, due?: string): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      const milestones = project.milestones || [];
      const newMilestone: Milestone = {
        id: Date.now(),
        title,
        due,
        completed: false
      };
      project.milestones = [...milestones, newMilestone];
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
  }

  toggleMilestone(projectId: number, milestoneId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project && project.milestones) {
      const milestone = project.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.completed = !milestone.completed;
        this.projects = [...this.projects];
        this.projectsSubject.next(this.projects);
      }
    }
  }

  deleteMilestone(projectId: number, milestoneId: number): void {
    const project = this.projects.find(p => p.id === projectId);
    if (project && project.milestones) {
      project.milestones = project.milestones.filter(m => m.id !== milestoneId);
      this.projects = [...this.projects];
      this.projectsSubject.next(this.projects);
    }
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
