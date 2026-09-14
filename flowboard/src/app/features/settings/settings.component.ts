import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private readonly fb = new FormBuilder();
  readonly themeService = inject(ThemeService);

  profileForm = this.fb.nonNullable.group({
    name: ['Marany Thea', [Validators.required]],
    email: ['marany@example.com', [Validators.required, Validators.email]],
    role: ['Staff Software Architect'],
    bio: ['Building FlowBoard Life OS and distributed systems.']
  });

  preferencesForm = this.fb.nonNullable.group({
    aiModel: ['Gemini 2.0 Pro'],
    focusTimerMinutes: [25],
    emailNotifications: [true],
    dailyBriefingPush: [true],
    soundEffects: [true]
  });

  savedMessage = false;

  shortcuts = [
    { key: '⌘ K / Ctrl + K', description: 'Open Global Command Palette & Search' },
    { key: 'G then P', description: 'Jump to Projects module' },
    { key: 'G then T', description: 'Jump to Tasks module' },
    { key: 'C', description: 'Quick capture new action item' },
    { key: 'Esc', description: 'Close modals or AI Drawer' }
  ];

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.showSavedToast();
  }

  savePreferences(): void {
    this.showSavedToast();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private showSavedToast(): void {
    this.savedMessage = true;
    setTimeout(() => {
      this.savedMessage = false;
    }, 3000);
  }
}
