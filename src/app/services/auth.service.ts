import {Injectable} from '@angular/core';
import {HttpClient, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, switchMap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }


  login(auth: { username: string, password: string }) {
    return this.http.post('api/auth/login', {username: auth.username, password: auth.password})
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

  storeTokens(tokens: any) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandlerFn) {
    return this.http
      .post('/api/auth/refresh-token', {refreshToken: this.getRefreshToken()})
      .subscribe({
        next: (tokens: any) => {
          this.storeTokens(tokens);
          return next(this.addToken(req));
        },
        error: (err) => {
          this.logout();
          return throwError(err);
        }
      })
  }

  addToken(req: HttpRequest<unknown>) {
    const accessToken = localStorage.getItem("accessToken") || ''
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    })
  }
}
