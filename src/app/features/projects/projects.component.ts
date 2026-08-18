import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  private readonly projectService = inject(ProjectService);
  private readonly fb = inject(FormBuilder);

  projects: Project[] = [];

  showForm = false;
  editingProjectId: number | null = null;

  projectForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: ['planning' as Project['status'], [Validators.required]]
  });

  ngOnInit(): void {
    this.projectService.projects$.subscribe(projects => {
      this.projects = projects;
    });
  }

  openCreateForm(): void {
    this.editingProjectId = null;

    this.projectForm.reset({
      name: '',
      description: '',
      status: 'planning'
    });

    this.showForm = true;
  }

  openEditForm(project: Project): void {
    this.editingProjectId = project.id;

    this.projectForm.setValue({
      name: project.name,
      description: project.description,
      status: project.status
    });

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingProjectId = null;

    this.projectForm.reset({
      name: '',
      description: '',
      status: 'planning'
    });
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formValue = this.projectForm.getRawValue();

    if (this.editingProjectId === null) {

      const newProject: Project = {
        id: Date.now(),
        name: formValue.name,
        description: formValue.description,
        status: formValue.status,
        createdAt: new Date().toISOString().split('T')[0]
      };

      this.projectService.addProject(newProject);

    } else {

      const existingProject = this.projects.find(
        project => project.id === this.editingProjectId
      );

      if (!existingProject) {
        return;
      }

      const updatedProject: Project = {
        ...existingProject,
        name: formValue.name,
        description: formValue.description,
        status: formValue.status
      };

      this.projectService.updateProject(updatedProject);
    }

    this.closeForm();
  }
}
