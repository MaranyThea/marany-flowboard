import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue';

@Component({
  selector: 'app-issues',
  imports: [RouterLink],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.scss'
})
export class IssuesComponent implements OnInit {

  private readonly issueService = inject(IssueService);

  issues: Issue[] = [];

  ngOnInit(): void {
    this.issueService.issues$.subscribe(issues => {
      this.issues = issues;
    });
  }
}
