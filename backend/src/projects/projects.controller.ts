import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): ReturnType<ProjectsService['getProjects']> {
    return this.projectsService.getProjects();
  }

  @Get(':id')
  getProjectById(
    @Param('id') id: string,
  ): ReturnType<ProjectsService['getProjectById']> {
    return this.projectsService.getProjectById(Number(id));
  }

  @Post()
  createProject(
    @Body() project: Parameters<ProjectsService['createProject']>[0],
  ): ReturnType<ProjectsService['createProject']> {
    return this.projectsService.createProject(project);
  }

  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Body() project: Parameters<ProjectsService['updateProject']>[1],
  ): ReturnType<ProjectsService['updateProject']> {
    return this.projectsService.updateProject(Number(id), project);
  }

  @Delete(':id')
  deleteProject(
    @Param('id') id: string,
  ): ReturnType<ProjectsService['deleteProject']> {
    return this.projectsService.deleteProject(Number(id));
  }
}
