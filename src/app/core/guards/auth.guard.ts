import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AuthGuard = (is_authenticated: boolean = true): CanMatchFn => {
  return (route: Route, segments: UrlSegment[]) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const has_access_token = !!authService.get_access_token();
    const has_refresh_token = !!authService.get_refresh_token();

    if (is_authenticated) {
      if (has_access_token || has_refresh_token) {
        return true;
      }
      router.navigate(['/auth/login']);
      return true;
    } else {
      if (!has_access_token && !has_refresh_token) {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    }
  };
};
