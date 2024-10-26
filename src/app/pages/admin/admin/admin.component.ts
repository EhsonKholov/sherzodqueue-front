import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  bgImages = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','bg6.jpg','bg7.jpg']
  randomIdx = Math.floor(Math.random() * (this.bgImages.length - 1) + 1)

}
