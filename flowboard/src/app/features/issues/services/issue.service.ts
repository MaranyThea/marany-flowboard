import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Issue } from '../models/issue';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private issues: Issue[] = [
    {
      id: 1,
      title: 'Login button not working',
      description: 'The login button does not respond correctly when the user submits the form.',
      status: 'resolved',
      priority: 'high',
      projectId: 1,
      createdAt: '2026-08-17'
    },
    {
      id: 2,
      title: 'Dashboard layout issue',
      description: 'The dashboard layout needs better spacing on smaller screens.',
      status: 'in-progress',
      priority: 'medium',
      projectId: 1,
      createdAt: '2026-08-18'
    },
    {
      id: 3,
      title: 'Update portfolio content',
      description: 'Some project information on the portfolio needs to be updated.',
      status: 'open',
      priority: 'low',
      projectId: 2,
      createdAt: '2026-08-18'
    }
  ];

  private readonly issuesSubject =
    new BehaviorSubject<Issue[]>(this.issues);

  readonly issues$ =
    this.issuesSubject.asObservable();

  getIssues(): Issue[] {
    return this.issues;
  }

  addIssue(issue: Issue): void {
    this.issues.push(issue);
    this.issuesSubject.next(this.issues);
  }

  updateIssue(updatedIssue: Issue): void {
    const index = this.issues.findIndex(
      issue => issue.id === updatedIssue.id
    );

    if (index !== -1) {
      this.issues[index] = updatedIssue;
      this.issuesSubject.next(this.issues);
    }
  }

  deleteIssue(id: number): void {
    this.issues = this.issues.filter(
      issue => issue.id !== id
    );

    this.issuesSubject.next(this.issues);
  }
}
