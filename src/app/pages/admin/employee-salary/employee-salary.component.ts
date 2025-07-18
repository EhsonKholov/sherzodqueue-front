import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {filter, Subject, takeUntil} from 'rxjs';
import {ReportsService} from '../../../services/reports.service';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    CalendarModule
  ],
  templateUrl: './employee-salary.component.html',
  styleUrl: './employee-salary.component.css'
})
export class EmployeeSalaryComponent implements OnInit {

  private destroy$ = new Subject<void>()

  employeesSalaries: WritableSignal<any[]> = signal([])
  toDay = new Date()
  agoMonth = new Date(new Date().setMonth(this.toDay.getMonth() - 1))

  filter = new FormGroup({
    dateFrom: new FormControl<any>(this.agoMonth),
    dateTo: new FormControl(),
  })


  constructor(private reportsService: ReportsService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getEmployeesSalaries()
  }


  getEmployeesSalaries() {
    console.log(this.filter)
    let body
    let dateFrom: any = this.filter.controls?.dateFrom?.value
    let dateTo: any = this.filter.controls?.dateTo?.value
    if (dateFrom != null && dateTo == null) {
      body = {
        year: dateFrom?.getFullYear(),
        month: dateFrom?.getMonth() + 1
      }
    } else if (dateFrom != null && dateTo != null) {
      body = {
        fromDate: `${dateFrom?.getFullYear()}-${(dateFrom?.getMonth() + 1).toString().padStart(2, "0")}-01`,
        fromTo: `${dateTo?.getFullYear()}-${(dateTo?.getMonth() + 1).toString().padStart(2, "0")}-01`,
      }
    }

    this.reportsService.getEmployeesSalaries(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.employeesSalaries.set(res)
        }, error: (err: any) => {
          if (err.status != 401) return
          this.toastService.error('Ошибка получения данных!')
        }
      })
  }

  getTotalAmount() {
    if (this.employeesSalaries() == null || this.employeesSalaries().length == 0) return 0

    return this.employeesSalaries().reduce(function(sum, item) {
      return sum + +item?.totalAmount
    }, 0)
  }

  getTotalAmountSalary() {
    if (this.employeesSalaries() == null || this.employeesSalaries().length == 0) return 0

    console.log(this.employeesSalaries())

    return this.employeesSalaries().reduce(function(sum, item) {
      return sum + +item?.salary
    }, 0)
  }

  getTotalRecordsCount() {
    if (this.employeesSalaries() == null || this.employeesSalaries().length == 0) return 0

    return this.employeesSalaries().reduce(function(sum, item) {
      return sum + +item?.recordsCount
    }, 0)
  }
}
