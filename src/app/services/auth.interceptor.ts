import {HttpErrorResponse, HttpInterceptorFn, HttpStatusCode} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {LoadingService} from './loading.service';
import {catchError, finalize} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const accessToken = localStorage.getItem("accessToken") || ''
  const loadingService = inject(LoadingService)

  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  })

  console.log(modifiedReq)

  loadingService.requestStarted()

  //return next(modifiedReq)
  return next(modifiedReq)
    .pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status == HttpStatusCode.Unauthorized && !req.url.includes('auth/login')) {
          authService.logout()
        }

        return next(modifiedReq)
      }),
      finalize(() => {
        loadingService.requestEnded()
      })
    )
};
