import { AfterViewInit, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

declare const google: {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: {
          type?: string;
          theme?: string;
          size?: string;
          text?: string;
          shape?: string;
          width?: number;
        },
      ) => void;
    };
  };
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements AfterViewInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDarkMode;

  private readonly googleClientId =
    '583062011127-4uad5tcgiutk2ncq3p9etg3vh8f2jlrf.apps.googleusercontent.com';

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

  ngAfterViewInit(): void {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn(): void {
    if (typeof google === 'undefined') {
      console.error('Google Identity Services has not loaded.');
      return;
    }

    const googleButton = document.getElementById('google-button');

    if (!googleButton) {
      console.error('Google button container was not found.');
      return;
    }

    google.accounts.id.initialize({
      client_id: this.googleClientId,

      callback: (response) => {
        this.handleGoogleSignIn(response.credential);
      },
    });

    google.accounts.id.renderButton(googleButton, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 340,
    });
  }

  private handleGoogleSignIn(credential: string): void {
    this.authService.googleLogin(credential).subscribe({
      next: (response) => {
        console.log('Google login successful:', response.user);

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error('Google login failed:', error);
      },
    });
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

    this.authService.register(name!, email!, password!).subscribe({
      next: () => {
        console.log('Registration successful');

        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
