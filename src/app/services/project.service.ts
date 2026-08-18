import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projects: Project[] = [
    {
      id: 1,
      name: 'FlowBoard',
      description: 'Project management platform',
      status: 'in-progress',
      createdAt: '2026-08-18'
    },
    {
      id: 2,
      name: 'Portfolio',
      description: 'Personal developer portfolio',
      status: 'completed',
      createdAt: '2026-08-10'
    },
    {
      id: 3,
      name: 'Expense Tracker',
      description: 'Personal finance application',
      status: 'in-progress',
      createdAt: '2026-08-05'
    }
  ];

  private readonly projectsSubject =
    new BehaviorSubject<Project[]>(this.projects);

  readonly projects$ =
    this.projectsSubject.asObservable();

  getProjects(): Project[] {
    return this.projects;
  }

  addProject(project: Project): void {
    this.projects.push(project);
    this.projectsSubject.next(this.projects);
  }

  updateProject(updatedProject: Project): void {
    const index = this.projects.findIndex(
      project => project.id === updatedProject.id
    );

    if (index !== -1) {
      this.projects[index] = updatedProject;
      this.projectsSubject.next(this.projects);
    }
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter(
      project => project.id !== id
    );

    this.projectsSubject.next(this.projects);
  }
}
