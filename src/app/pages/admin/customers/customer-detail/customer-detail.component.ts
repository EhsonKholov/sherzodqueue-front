import {Component, input, output, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    DatePipe,
    DialogModule
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent {

  customer = input.required<any>();
  close = output<boolean>()

  modalShow = signal(true)

  constructor() {}

  closeModal() {
    this.close.emit(false)
  }

}
