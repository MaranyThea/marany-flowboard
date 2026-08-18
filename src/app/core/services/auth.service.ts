import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authenticated = signal(false);

  readonly isAuthenticated = this.authenticated.asReadonly();

  login(email: string, password: string): boolean {
    const isValid =
      email === 'demo@flowboard.com' &&
      password === 'password123';

    if (isValid) {
      this.authenticated.set(true);
      return true;
    }

    return false;
  }

  logout(): void {
    this.authenticated.set(false);
  }
}
