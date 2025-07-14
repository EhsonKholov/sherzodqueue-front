import { Component } from '@angular/core';
import {LoadingService} from '../../../services/loading.service';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {fadeAnimation} from '../../../animations/fade.animation';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    ProgressSpinnerModule
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
  animations: [
    fadeAnimation
  ]
})
export class LoadingComponent {

  constructor(protected loadingService: LoadingService) {}

}
