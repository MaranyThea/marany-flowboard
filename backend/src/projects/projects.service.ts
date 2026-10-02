import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  // GET all projects
  async getProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // GET one project
  async getProjectById(id: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        user: {
          id: userId,
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // CREATE project
  async createProject(project: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  // UPDATE project
  async updateProject(id: number, project: UpdateProjectDto, userId: number) {
    await this.getProjectById(id, userId);

    return this.prisma.project.update({
      where: {
        id,
      },
      data: project,
    });
  }

  // DELETE project
  async deleteProject(id: number, userId: number) {
    await this.getProjectById(id, userId);

    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
