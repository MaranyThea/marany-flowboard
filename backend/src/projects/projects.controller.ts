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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

import type { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@UseGuards(JwtAuthGuard)
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(@CurrentUser() user: JwtPayload) {
    return this.projectsService.getProjects(user.userId);
  }

  @Get(':id')
  getProjectById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.projectsService.getProjectById(Number(id), user.userId);
  }

  @Post()
  createProject(
    @Body() project: CreateProjectDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.projectsService.createProject(project, user.userId);
  }

  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Body() project: Parameters<ProjectsService['updateProject']>[1],
    @CurrentUser() user: JwtPayload,
  ) {
    return this.projectsService.updateProject(Number(id), project, user.userId);
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.projectsService.deleteProject(Number(id), user.userId);
  }
}
