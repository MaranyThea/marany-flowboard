import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../projects/services/project.service';
import { Project } from '../projects/models/project';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  projects: Project[] = [];
  recentProjects: Project[] = [];

  totalProjects = 0;
  completedProjects = 0;
  inProgressProjects = 0;
  planningProjects = 0;

  ngOnInit(): void {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
      this.recentProjects = projects.slice(0, 3);

      this.calculateStatistics();
    });
  }

  private calculateStatistics(): void {
    this.totalProjects = this.projects.length;

    this.completedProjects = this.projects.filter(
      project => project.status === 'completed'
    ).length;

    this.inProgressProjects = this.projects.filter(
      project => project.status === 'in-progress'
    ).length;

    this.planningProjects = this.projects.filter(
      project => project.status === 'planning'
    ).length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
