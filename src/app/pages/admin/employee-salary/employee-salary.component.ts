import { Component } from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  imports: [
    DatePipe,
    PaginationComponent,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './employee-salary.component.html',
  styleUrl: './employee-salary.component.css'
})
export class EmployeeSalaryComponent {

  protected readonly Math = Math;
}
