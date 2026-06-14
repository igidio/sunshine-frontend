import { CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserRole } from '../../features/user/interfaces/user.interface';

const role_redirect: Record<UserRole, string> = {
  superuser: '/dashboard',
  admin: '/dashboard',
  employer: '/dashboard',
  customer: '/',
};

export const RoleGuard = (allowed_roles: UserRole[]): CanMatchFn => {
  return (_route: Route, _segments: UrlSegment[]): boolean | UrlTree => {

    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.user();

    //return true;

    // if (!user) {
    //   return router.parseUrl('/auth/login');
    // }

    console.log(user);


    if (user && allowed_roles.includes(user.role)) {
      return true;
    }
    return false;

    // return router.parseUrl(role_redirect[user.role] ?? '/auth/login');
  };
};
