import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  readonly authService = inject(AuthService);

  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDarkMode;

  isSidebarCollapsed = false;
  isProfileMenuOpen = false;
  isNotificationMenuOpen = false;

  get userInitial(): string {
    return this.authService.user()?.name?.charAt(0).toUpperCase() ?? '?';
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;

    if (this.isProfileMenuOpen) {
      this.isNotificationMenuOpen = false;
    }
  }

  toggleNotificationMenu(): void {
    this.isNotificationMenuOpen = !this.isNotificationMenuOpen;

    if (this.isNotificationMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}