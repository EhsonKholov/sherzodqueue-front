import { Injectable } from '@angular/core';
import {UserService} from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private userService: UserService) { }

  changePassword(body: any) {
    return this.userService.userChangePassword(body)
  }
}
