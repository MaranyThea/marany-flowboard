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

interface GoogleProfile {
  firstName: string;
  lastName: string;
  email: string;
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

  // =========================================================
  // EMAIL / PASSWORD LOGIN
  // =========================================================

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

  // =========================================================
  // EMAIL / PASSWORD REGISTER
  // =========================================================

  register(
    name: string,
    email: string,
    password: string,
    googleCredential?: string,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, {
        name,
        email,
        password,
        googleCredential,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);

          this.authenticated.set(true);

          this.currentUser.set(response.user);
        }),
      );
  }

  // =========================================================
  // GET VERIFIED GOOGLE PROFILE
  // =========================================================

  getGoogleProfile(credential: string): Observable<GoogleProfile> {
    return this.http.post<GoogleProfile>(`${this.apiUrl}/google/profile`, {
      credential,
    });
  }

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  googleLogin(credential: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/google/login`, {
        credential,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);

          this.authenticated.set(true);

          this.currentUser.set(response.user);
        }),
      );
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {
    localStorage.removeItem('accessToken');

    this.authenticated.set(false);

    this.currentUser.set(null);
  }
}
