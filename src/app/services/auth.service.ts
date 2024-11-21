import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}


  login(auth: {username: string, password: string}) {
    return this.http.post('api/auth/login', { username: auth.username, password: auth.password })
  }

  getUser() {
    return localStorage.getItem('user')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['admin/login'])
  }

}
