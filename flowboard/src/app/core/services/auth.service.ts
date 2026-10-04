import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  private readonly authenticated = signal(false);

  private readonly currentUser = signal<User | null>(null);

  readonly isAuthenticated = this.authenticated.asReadonly();

  readonly user = this.currentUser.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);

          this.authenticated.set(true);

          this.currentUser.set(response.user);
        }),
      );
  }

  register(name: string, email: string, password: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, {
      name,
      email,
      password,
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');

    this.authenticated.set(false);
    this.currentUser.set(null);
  }
  googleLogin(credential: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/google`, { credential })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);

          this.authenticated.set(true);

          this.currentUser.set(response.user);
        }),
      );
  }
}
