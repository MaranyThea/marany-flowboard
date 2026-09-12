import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { GoalsComponent } from './features/goals/goals.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { HabitsComponent } from './features/habits/habits.component';
import { FitnessComponent } from './features/fitness/fitness.component';
import { LibraryComponent } from './features/library/library.component';
import { DatesComponent } from './features/dates/dates.component';
import { BrainstormingComponent } from './features/brainstorming/brainstorming.component';
import { PeopleComponent } from './features/people/people.component';
import { FinanceComponent } from './features/finance/finance.component';
import { AgentsComponent } from './features/agents/agents.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';
import { DomainsComponent } from './features/domains/domains.component';
import { WhereImAtComponent } from './features/where-im-at/where-im-at.component';
import { JournalComponent } from './features/journal/journal.component';
import { GraphComponent } from './features/graph/graph.component';
import { FeedbackComponent } from './features/feedback/feedback.component';
import { SettingsComponent } from './features/settings/settings.component';
import { IssuesComponent } from './features/issues/issues.component';
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'goals', component: GoalsComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'habits', component: HabitsComponent },
      { path: 'fitness', component: FitnessComponent },
      { path: 'library', component: LibraryComponent },
      { path: 'dates', component: DatesComponent },
      { path: 'brainstorming', component: BrainstormingComponent },
      { path: 'people', component: PeopleComponent },
      { path: 'finance', component: FinanceComponent },
      { path: 'agents', component: AgentsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'domains', component: DomainsComponent },
      { path: 'where-im-at', component: WhereImAtComponent },
      { path: 'journal', component: JournalComponent },
      { path: 'graph', component: GraphComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'issues', component: IssuesComponent },
      { path: 'users', component: UsersComponent },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
