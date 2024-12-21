import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Ripple} from 'primeng/ripple';

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

}
