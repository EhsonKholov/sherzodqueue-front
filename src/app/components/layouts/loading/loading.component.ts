import { Component } from '@angular/core';
import {LoadingService} from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

  constructor(protected loadingService: LoadingService) {}

}
