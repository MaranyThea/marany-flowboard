import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  private readonly projectService = inject(ProjectService);

  projects: Project[] = [];

  ngOnInit(): void {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });
  }
}
