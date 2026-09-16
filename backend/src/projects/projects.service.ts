import { Injectable, NotFoundException } from '@nestjs/common';

interface Project {
  id: number;
  name: string;
  description: string;
}

@Injectable()
export class ProjectsService {
  private projects: Project[] = [
    {
      id: 1,
      name: 'Apex',
      description: 'Personal productivity platform',
    },
    {
      id: 2,
      name: 'Portfolio',
      description: 'Personal developer portfolio',
    },
  ];

  getProjects() {
    return this.projects;
  }
  getProjectById(id: number): Project {
    const project = this.projects.find((project) => project.id === id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  createProject(project: Omit<Project, 'id'>): Project {
    const newProject = {
      id: this.projects.length + 1,
      ...project,
    };

    this.projects.push(newProject);

    return newProject;
  }

  updateProject(id: number, project: Partial<Omit<Project, 'id'>>): Project {
    const index = this.projects.findIndex((project) => project.id === id);

    if (index === -1) {
      throw new NotFoundException('Project not found');
    }

    this.projects[index] = {
      ...this.projects[index],
      ...project,
      id,
    };

    return this.projects[index];
  }

  deleteProject(id: number): Project {
    const index = this.projects.findIndex((project) => project.id === id);

    if (index === -1) {
      throw new NotFoundException('Project not found');
    }

    const deletedProject = this.projects[index];

    this.projects.splice(index, 1);

    return deletedProject;
  }
}
