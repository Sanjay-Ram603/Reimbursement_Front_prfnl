

import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Something went wrong!';

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized! Please login again.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 400) {
        errorMessage = 'Bad request. Please check your input.';
      }

      console.error('API Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};