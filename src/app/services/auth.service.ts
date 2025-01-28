import {Injectable} from '@angular/core';
import {HttpClient, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environments';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }


  login(auth: { username: string, password: string }) {
    return this.http.post(environment.URI + 'api/auth/login', {username: auth.username, password: auth.password})
  }

  getEmployee() {
    return localStorage.getItem('employee')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken')
  }

  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/admin/login')
  }

  public getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandlerFn) {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(environment.URI + 'api/auth/refresh-token', {refreshToken})
      .subscribe({
        next: (response) => {
          this.storeTokens(response)
          return next(this.addToken(req));
        },
        error: ((err) => {
          this.logout();
          return throwError(() => err);
        })
      })
  }

  storeTokens(tokens: any) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  addToken(req: HttpRequest<unknown>) {
    const accessToken = localStorage.getItem("accessToken") || ''
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    })
  }
}
