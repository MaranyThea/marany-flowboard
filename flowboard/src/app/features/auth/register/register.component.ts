import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDarkMode;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } =
      this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const registerFn =
      (this.authService as any).register ??
      (this.authService as any).signUp ??
      (this.authService as any).createUser;

    if (typeof registerFn !== 'function') {
      console.error('Registration is not available on AuthService');
      return;
    }

    registerFn.call(this.authService, name, email, password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: unknown) => {
        console.error('Registration failed:', error);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
