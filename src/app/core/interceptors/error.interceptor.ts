import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, throwError } from 'rxjs';
import { ToastService } from '@/app/shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const allowed_status = [401];

  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      let error_message = 'Ha ocurrido un error inesperado';

      if (e.error instanceof ErrorEvent) {
        error_message = e.error.message;
      } else {
        if (e.error && e.error.message) {
          error_message = e.error.message;
        } else {
          error_message = `Error Código: ${e.status}\nMensaje: ${e.message}`;
        }
      }

      if (!allowed_status.includes(e.status)) {
        toastService.show({
          message: error_message,
          duration: 5000,
          type: 'danger',
        });
      }

      return throwError(() => e);
    }),
  );
};
