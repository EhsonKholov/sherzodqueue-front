import {Component, input, output, signal, WritableSignal} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {PaginatorModule} from 'primeng/paginator';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EmployeeService} from '../../../../services/employee.service';
import {Subject, takeUntil} from 'rxjs';
import moment from 'moment';
import {RecordsService} from '../../../../services/records.service';
import {ToastService} from '../../../../services/toast.service';
import {CurrencyPipe} from '@angular/common';
import {SecondsToDatePipe} from '../../../../pipes/seconds-to-date.pipe';
import {ToothDentalFormulaComponent} from '../../../../components/tooth-dental-formula/tooth-dental-formula.component';

@Component({
  selector: 'app-customer-history',
  standalone: true,
  imports: [
    DialogModule,
    PaginatorModule,
    ReactiveFormsModule,
    CurrencyPipe,
    SecondsToDatePipe,
    ToothDentalFormulaComponent
  ],
  templateUrl: './customer-history.component.html',
  styleUrl: './customer-history.component.css'
})
export class CustomerHistoryComponent {
  private destroy$ = new Subject<void>()

  customer = input<any>()
  close = output<boolean>()

  modalShow = signal(true)
  toothDentalFormulaShow = signal(false)

  employees = signal<any[]>([])
  records = signal<any[]>([])
  record = signal<any>(null)

  statuses = signal<any[]>([
    /*{code: null, text: 'Все'},*/
    {code: 0, text: 'Ожидается'},
    {code: 1, text: 'Принят'},
    {code: 2, text: 'В процессе'},
    {code: 3, text: 'Завершен'},
    {code: 4, text: 'Отменен'},
  ]);

  filterFG = new FormGroup({
    fromDate: new FormControl(moment().date(-30).format('YYYY-MM-DD')),
    toDate: new FormControl(null),
    customerId: new FormControl(this.customer()?.id, [Validators.required]),
    employeeId: new FormControl(null),
    status: new FormControl(null),
    includeDependencies: new FormControl(true, [Validators.required]),
  })

  constructor(
    private employeeService: EmployeeService,
    private recordService: RecordsService,
    private toastService: ToastService,
  ) {}


  ngOnInit() {
    this.getRecords()
    this.getEmployees()
  }

  getRecords() {
    let data: any = this.filterFG.value

    data.fromDate = moment(data.fromDate).startOf('day')
    data.toDate = moment(data.toDate).endOf('day')
    data.customerId = this.customer()?.id

    if (data?.status == null) delete data.status
    if (data?.employeeId == null) delete data.employeeId

    this.recordService.getRecordsList(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.records.set(res?.items)
        }, error: (error: any) => {
          if (error.status != 401) return
          this.toastService.error('Ошибка получения данных!')
        }
      })
  }

  getEmployees() {
    let body = {
    }
    this.employeeService.getEmployeesList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.employees.set(res?.items)
        }
      })
  }

  closeModal() {
    this.close.emit(false)
  }

  toothDentalFormulaShowFn(record: any) {
    this.record.set(record)
    this.toothDentalFormulaShow.set(true)
  }

  toothDentalFormulaHide() {
    this.toothDentalFormulaShow.set(false)
  }

  getSelectedToothFromRecordAsSignal(record: any) {
    let selectedTooth: WritableSignal<any[]> = signal([])
    if (record?.details != null && record?.details.length > 0) {
      for (let detail of this.record()?.details) {
        selectedTooth().push(detail?.toothId)
      }
    }

    return selectedTooth;
  }
}
