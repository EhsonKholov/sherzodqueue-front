import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user: any = JSON.parse(this.authService.getEmployee() || '')
    const loggedUserRoles: any[] = user.roles
    const roles = route?.data['roles']
    let b = false

    if (!!roles) {
      Object.keys(roles).forEach((key, role) => {
        if (loggedUserRoles?.includes(roles[key]))
        {
          b = true
        }
      })
    }

    if (!b && this.authService.isLoggedIn()) {
      this.router.navigate(['not-found'])
    }

    return b
  }

}
