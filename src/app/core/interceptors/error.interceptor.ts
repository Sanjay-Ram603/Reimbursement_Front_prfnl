

import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Something went wrong!';

      if (error.error) {
        // Backend returns { Message: "..." } (capital M from GlobalExceptionMiddleware)
        errorMessage = error.error.Message || error.error.message || errorMessage;
      }

      if (error.status === 401) {
        errorMessage = 'Unauthorized! Please login again.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 400) {
        errorMessage = error.error?.Message || error.error?.message || 'Bad request. Please check your input.';
      }

      console.error('API Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};