import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

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
        return auth_service.refresh_token().pipe(
          switchMap((new_tokens) => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${new_tokens.access_token}` },
            });
            return next(retriedReq);
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
