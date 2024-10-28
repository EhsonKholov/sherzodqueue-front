import {HttpErrorResponse, HttpInterceptorFn, HttpStatusCode} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {LoadingService} from './loading.service';
import {catchError, finalize} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  /*const authService = inject(AuthService)
  const userToken = localStorage.getItem("token") || ''
  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${userToken}`),
  })*/

  const loadingService = inject(LoadingService)

  loadingService.requestStarted()

  //return next(modifiedReq)
  return next(req)
    .pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status == HttpStatusCode.Unauthorized && !req.url.includes('authenticate')) {
          //authService.logout()
        }

        return next(req)
        //return next(modifiedReq)
      }),
      finalize(() => {
        loadingService.requestEnded()
      })
    )
};
