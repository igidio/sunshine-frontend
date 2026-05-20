import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, filter, finalize, shareReplay, switchMap, throwError } from 'rxjs';

let refresh_in_flight = null as ReturnType<AuthService['refresh_token']> | null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth_service = inject(AuthService);
  const token = auth_service.get_access_token();

  let auth_req = req;
  if (token) {
    auth_req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(auth_req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh') && !req.url.includes('/login')) {
        if (!refresh_in_flight) {
          refresh_in_flight = auth_service.refresh_token().pipe(
            shareReplay(1),
            finalize(() => {
              refresh_in_flight = null;
            }),
          );
        }

        return refresh_in_flight.pipe(
          switchMap((new_tokens) => {
            const retried_req = req.clone({
              setHeaders: { Authorization: `Bearer ${new_tokens.access_token}` },
            });
            return next(retried_req);
          }),
          catchError((refreshError) => {
            auth_service.logout();
            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
