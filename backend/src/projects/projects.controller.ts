import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
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
  getProjects(@Query('tenantId') tenantId: string) {
    return this.projectsService.getProjects(Number(tenantId));
  }

  @Get(':id')
  async getProjectById(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ) {
    const project = await this.projectsService.getProjectById(
      Number(tenantId),
      Number(id),
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  @Post()
  createProject(
    @Body() project: CreateProjectDto,
    @Query('tenantId') tenantId: string,
  ): ReturnType<ProjectsService['createProject']> {
    return this.projectsService.createProject(project, Number(tenantId));
  }

  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() project: UpdateProjectDto,
  ): ReturnType<ProjectsService['updateProject']> {
    return this.projectsService.updateProject(
      Number(tenantId),
      project,
      Number(id),
    );
  }

  @Delete(':id')
  deleteProject(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): ReturnType<ProjectsService['deleteProject']> {
    return this.projectsService.deleteProject(Number(tenantId), Number(id));
  }
}
