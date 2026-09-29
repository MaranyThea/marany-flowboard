import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  // GET all projects
  getProjects() {
    return this.prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // GET one project
  async getProjectById(id: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // CREATE project
  createProject(project: { name: string; description?: string }) {
    return this.prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
      },
    });
  }

  // UPDATE project
  async updateProject(id: number, project: UpdateProjectDto) {
    await this.getProjectById(id);

    return this.prisma.project.update({
      where: { id },
      data: project,
    });
  }

  // DELETE project
  async deleteProject(id: number) {
    await this.getProjectById(id);

    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
