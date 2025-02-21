import {Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Ripple} from 'primeng/ripple';
import {AuthService} from '../../../services/auth.service';
import {DropdownDirective} from '../../../directives/dropdown.directive';
import {ColoredCircleComponent} from '../../colored-circle/colored-circle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    Ripple,
    DropdownDirective,
    ColoredCircleComponent
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
    let menuBar = localStorage.getItem('menuBar')
    if (menuBar != null && menuBar.trim() != '' && menuBar.trim() == '0') {
      this.toggleMenuFn(false)
    } else {
      this.toggleMenuFn(true)
    }

    this.employee = this.authService.getEmployee()
  }

  getFirstAndLastLatterEmployeeName() {
    let employee: any = this.authService?.getEmployee() || null

    return employee == null ? '?' : employee?.name?.substring(0, 1) +''+ employee?.lastname?.substring(0, 1)
  }

  logout() {
    this.authService.logout()
  }

  toggleMenuFn(b: boolean) {
    this.isActiveMenuBar.update(_ => b)
    this.toggleMenuEmit.emit(b)
    localStorage.setItem('menuBar', b ? '1' : '0')
  }

  toggleMenuProfile() {
    this.isMenuProfile.update(t => !t)
  }
}
