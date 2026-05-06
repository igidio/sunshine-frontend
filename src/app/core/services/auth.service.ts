import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Location } from '@angular/common';

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
  location = inject(Location);
  constructor() {}

  login(username_or_email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth', { username_or_email, password }).pipe(
      tap((res) => {
        this.save_tokens(res.access_token, res.refresh_token);
        this.location.go('/dashboard');
      }),
    );
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
    console.log(access, refresh);

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // redirect to login page or homepage
  }
}
