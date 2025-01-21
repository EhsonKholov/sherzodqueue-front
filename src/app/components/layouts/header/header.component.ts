import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Ripple} from 'primeng/ripple';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    Ripple
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout()
  }
}
