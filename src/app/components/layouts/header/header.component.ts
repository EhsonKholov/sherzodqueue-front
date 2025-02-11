import {Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Ripple} from 'primeng/ripple';
import {AuthService} from '../../../services/auth.service';
import {DropdownDirective} from '../../../directives/dropdown.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    Ripple,
    DropdownDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  employee: any
  isMenuProfile = signal(false)
  isActiveMenuBar = signal(true);
  @Output() toggleMenuEmit = new EventEmitter<any>();

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.employee = this.authService.getEmployee()
  }

  getFirstAndLastLatterEmployeeName() {
    let employee: any = this.authService?.getEmployee() || null

    return employee == null ? '?' : employee?.name?.substring(0, 1) +''+ employee?.lastname?.substring(0, 1)
  }

  logout() {
    this.authService.logout()
  }

  toggleMenuFn() {
    this.isActiveMenuBar.update(t => !t)
    this.toggleMenuEmit.emit(this.isActiveMenuBar())
  }

  toggleMenuProfile() {
    this.isMenuProfile.update(t => !t)
  }
}
