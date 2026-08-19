import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue';

@Component({
  selector: 'app-issues',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.scss'
})
export class IssuesComponent implements OnInit {

  private readonly issueService = inject(IssueService);
  private readonly fb = inject(FormBuilder);

  issues: Issue[] = [];

  showForm = false;

  issueForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: ['open' as Issue['status'], [Validators.required]],
    priority: ['medium' as Issue['priority'], [Validators.required]],
    projectId: [1, [Validators.required]]
  });

  ngOnInit(): void {
    this.issueService.issues$.subscribe(issues => {
      this.issues = issues;
    });
  }

  openCreateForm(): void {
    this.issueForm.reset({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      projectId: 1
    });

    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;

    this.issueForm.reset({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      projectId: 1
    });
  }

  createIssue(): void {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }

    const formValue = this.issueForm.getRawValue();

    const newIssue: Issue = {
      id: Date.now(),
      title: formValue.title,
      description: formValue.description,
      status: formValue.status,
      priority: formValue.priority,
      projectId: formValue.projectId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.issueService.addIssue(newIssue);

    this.closeForm();
  }
}
