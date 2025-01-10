import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {LoadingService} from './loading.service';
import {catchError, finalize, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const loadingService = inject(LoadingService)

  const modifiedReq = authService.addToken(req)

  if (!modifiedReq.headers.get('x-show-loader'))
    loadingService.requestStarted()

  return next(modifiedReq)
    .pipe(
      // @ts-ignore
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized && !modifiedReq.url.includes('/auth/login')) {
          let refreshToken = authService.getRefreshToken()
          if (refreshToken == null || refreshToken.trim() == '') {
            authService.logout()
            return throwError(error);
          }

          return authService.handle401Error(modifiedReq, next)
        }

        return throwError(error);
      }),

      finalize(() => {
        if (!modifiedReq.headers.get('x-show-loader'))
          loadingService.requestEnded()
      })
    )
};

