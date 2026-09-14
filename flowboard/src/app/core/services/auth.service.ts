import { Injectable, signal } from '@angular/core';

interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authenticated = signal(false);

  private readonly currentUser = signal<User | null>(null);

  readonly isAuthenticated = this.authenticated.asReadonly();

  readonly user = this.currentUser.asReadonly();

  login(email: string, password: string): boolean {
    const isValid =
      email === 'demo@flowboard.com' &&
      password === '123123';

    if (isValid) {
      this.authenticated.set(true);

      this.currentUser.set({
        name: 'Nyx',
        email: email
      });

      return true;
    }

    return false;
  }

  logout(): void {
    this.authenticated.set(false);
    this.currentUser.set(null);
  }
}