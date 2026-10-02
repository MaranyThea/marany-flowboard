import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
  createProject(@Body() project: CreateProjectDto) {
    return this.projectsService.createProject(project);
  }

  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
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
