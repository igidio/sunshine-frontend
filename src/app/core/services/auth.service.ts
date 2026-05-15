import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  constructor() {}

  login(
    username_or_email: string,
    password: string,
    remember_me?: boolean,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth', { username_or_email, password, remember_me })
      .pipe(
        tap((res) => {
          this.save_tokens(res.access_token, res.refresh_token);
          this.router.navigate(['/dashboard']);
        }),
      );
  }

  check_auth(): boolean {
    const token = this.get_access_token();
    if (!token) {
      return false;
    }
    // Optionally, you can decode the token and check its expiration here
    return true;
  }

  refresh_token(): Observable<AuthResponse> {
    const refreshToken = this.get_refresh_token();
    return this.http
      .post<AuthResponse>('/api/auth/refresh', { refreshToken })
      .pipe(tap((res) => this.save_tokens(res.access_token, res.refresh_token)));
  }

  get_access_token(): string | null {
    return localStorage.getItem('access_token');
  }

  get_refresh_token(): string | null {
    return localStorage.getItem('refresh_token');
  }

  save_tokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // redirect to login page or homepage
  }
}
