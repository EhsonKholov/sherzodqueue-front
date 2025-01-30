import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Directive({
  standalone: true,
  selector: '[permission]'
})
export class PermissionDirective {

  constructor(
    private el: ElementRef,
    private authService: AuthService
  ) {}


  @Input() set permission(roles: string[]) {
    const user: any = JSON.parse(this.authService.getEmployee() || '')
    let b = true
    if (!!user) {
      const userRoles: [] = user?.roles
      userRoles.forEach(role => {
        if (roles.includes(role)) b = false
      })
      if (b) this.el.nativeElement.remove();
    }
  }
}
