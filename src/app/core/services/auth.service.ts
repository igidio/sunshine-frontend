import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserInterface } from '../../features/user/interfaces/user.interface';

export type AllowedPermissions = 'TREATMENT' | 'APPOINTMENT' | 'SALE' | 'CUSTOMER' | 'USER' | 'SUPPLIER' | 'STOCK' | 'PRODUCT' | 'CATEGORY' | 'MOVEMENT';

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
  user = signal<UserInterface | null>(null);
  constructor() { }

  user_group = computed<'admin' | 'customer' | null>(() => {
    const user = this.user();
    if (!user) return null;
    if (user.role === 'customer') return 'customer';
    return 'admin';
  });

  login(
    username_or_email: string,
    password: string,
    remember_me?: boolean,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth', { username_or_email, password, remember_me })
      .pipe(
        tap(async (res) => {
          this.save_tokens(res.access_token, res.refresh_token);
          await this.check_auth();
          if (this.user()?.role === 'customer') {
            this.router.navigate(['/']);
            return;
          }
          this.router.navigate(['/dashboard']);
        }),
      );
  }

  signup(data: {
    user: { username: string; password: string; email: string; phone_number: string };
    profile: { first_name: string; last_name: string; birth_date: string; identity_number?: string; address?: string };
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/signup', data)
      .pipe(
        tap(async (res) => {
          this.save_tokens(res.access_token, res.refresh_token);
          await this.check_auth();
          if (this.user()?.role === 'customer') {
            this.router.navigate(['/']);
            return;
          }
          this.router.navigate(['/dashboard']);
        }),
      );
  }

  async check_auth(): Promise<boolean> {
    const token = this.get_access_token();
    if (!token) return false;
    try {
      const user = await firstValueFrom(this.http.post<UserInterface>('/api/auth/info', { token }));
      this.user.set(user);
      return true;
    } catch {
      return false;
    }
  }

  refresh_token(): Observable<AuthResponse> {
    const refresh_token = this.get_refresh_token();
    return this.http
      .post<AuthResponse>('/api/auth/refresh', { refresh_token })
      .pipe(tap((res) => this.save_tokens(res.access_token, res.refresh_token)));
  }

  private allowed_permissions = ['CUSTOMER', 'TREATMENT', 'APPOINTMENT', 'SALE', 'USER', 'SUPPLIER', 'STOCK', 'SALE'];
  private permission_cache = new Map<AllowedPermissions, Signal<boolean>>();


  has_permission(permission: AllowedPermissions): Signal<boolean> {
    if (!this.permission_cache.has(permission)) {
      this.permission_cache.set(permission, computed(() => {
        const user = this.user();
        if (!user) return false;
        if (user.role === 'admin' || user.role === 'superuser') return true;
        try {
          const permissions = JSON.parse(user.permissions) as string[];
          return Array.isArray(permissions) && permissions.includes(permission);
        } catch {
          return false;
        }
      }));
    }
    return this.permission_cache.get(permission)!;
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
    localStorage.removeItem('chat_messages');
    this.user.set(null);
    this.router.navigate(['/auth/login']);
  }
}
