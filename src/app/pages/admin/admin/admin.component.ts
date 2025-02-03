import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastComponent} from '../../../components/toast/toast.component';
import {LoadingComponent} from '../../../components/layouts/loading/loading.component';
import {HeaderComponent} from '../../../components/layouts/header/header.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastComponent,
    LoadingComponent,
    HeaderComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  bgImages = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','bg6.jpg','bg7.jpg']
  randomIdx = Math.floor(Math.random() * (this.bgImages.length - 1) + 1)

  isActiveMenu = signal(true)

  toggleMenu(event: any) {
    this.isActiveMenu.set(event)
  }
}
