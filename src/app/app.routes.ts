import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { IssuesComponent } from './features/issues/issues.component';
import { UsersComponent } from './features/users/users.component';
import { SettingsComponent } from './features/settings/settings.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'projects',
        component: ProjectsComponent
      },

      {
        path: 'issues',
        component: IssuesComponent
      },

      {
        path: 'users',
        component: UsersComponent
      },
      {
  path: 'analytics',
  component: AnalyticsComponent
},

      {
        path: 'settings',
        component: SettingsComponent
      },

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
