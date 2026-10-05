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

  private readonly googleClientId = '583062011127-4uad5tcgiutk2ncq3p9etg3vh8f2jlrf.apps.googleusercontent.com';

  private googleCredential: string | null = null;

  registerForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),

    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),

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
        this.handleGoogleAccount(response.credential);
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

  private handleGoogleAccount(credential: string): void {
    this.googleCredential = credential;

    const googleAuthService = this.authService as AuthService & {
      getGoogleProfile?: (token: string) => {
        subscribe: (handlers: {
          next?: (profile: {
            firstName: string;
            lastName: string;
            email: string;
          }) => void;
          error?: (error: unknown) => void;
        }) => void;
      };
    };

    const googleProfileRequest = googleAuthService.getGoogleProfile?.(credential);

    if (!googleProfileRequest) {
      console.warn('Google profile lookup is not supported by the current AuthService.');
      return;
    }

    googleProfileRequest.subscribe({
      next: (profile) => {
        this.registerForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        });

        console.log('Google profile loaded:', profile);
      },

      error: (error) => {
        console.error('Unable to load Google account:', error);

        this.googleCredential = null;
      },
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password, confirmPassword } =
      this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    this.authService
      .register(`${firstName} ${lastName}`, email!, password!)
      .subscribe({
        next: () => {
          console.log('Registration successful');

          this.router.navigate(['/dashboard']);
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
