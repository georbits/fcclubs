import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  const isAuthRequest = req.url.startsWith('/api/auth/');
  const isApiRequest = req.url.startsWith('/api');

  let updatedRequest = req;

  if (token && isApiRequest && !isAuthRequest) {
    updatedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(updatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearSession();
      }

      return throwError(() => error);
    }),
  );
};
