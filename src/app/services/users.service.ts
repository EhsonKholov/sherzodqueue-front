import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(body: any) {
    return this.http.post(environment.URI + `api/users/search`, body);
  }

  getUsersList(body: any) {
    return this.http.post(environment.URI + `api/users/list`, body);
  }

  addUser(body: any) {
    return this.http.post(environment.URI + `api/users/create`, body)
  }

  editUser(id: number, body: any) {
    return this.http.put(environment.URI + `api/users/update?id=${id}`, body)
  }

  getUserById(id: number) {
    return this.http.get(environment.URI + `api/users/get?Id=${id}`)
  }

  userResetPassword(body: any) {
    return this.http.post(environment.URI + 'api/users/reset-password', body)
  }

  userChangePassword(body: any) {
    return this.http.post(environment.URI + 'api/users/change-password', body)
  }
}
