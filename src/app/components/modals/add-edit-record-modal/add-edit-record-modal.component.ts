import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {RecordsService} from '../../../services/records.service';
import {Subject, takeUntil} from 'rxjs';
import {SelectComponent} from '../../select/select.component';
import {EmployeeService} from '../../../services/employee.service';
import {CustomersService} from '../../../services/customers.service';
import {ServicesService} from '../../../services/services.service';

@Component({
  selector: 'app-add-edit-record-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent
  ],
  templateUrl: './add-edit-record-modal.component.html',
  styleUrl: './add-edit-record-modal.component.css'
})
export class AddEditRecordModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() edit: boolean = false
  @Input() record: any
  @Output() close = new EventEmitter<any>();
  @Output() getRecords: EventEmitter<any> = new EventEmitter<any>()

  employeesOptions: WritableSignal<any[]> = signal([])
  selectFilterParamEmployee: string = ''

  customersOptions: WritableSignal<any[]> = signal([]);
  selectFilterParamCustomer: string = ''

  servicesOptions: WritableSignal<any[]> = signal([]);
  selectFilterParamServices: string = ''

  addRecordFormGroup = new FormGroup({
    customer: new FormControl<any>(null, [Validators.required]),
    employee: new FormControl<any>(null, [Validators.required]),
    services: new FormControl<any>(null, [Validators.required]),
    recordingTime: new FormControl(null, [Validators.required]),
    amountPaid: new FormControl(0, [Validators.required]),
  })

  constructor(
    private recordService: RecordsService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private customerService: CustomersService,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.getEmployees()
    this.getCustomers()
    this.getServices()

    if (this.edit) {
      this.addRecordFormGroup.setValue({
        customer: this.record.customer,
        employee: this.record.employee,
        services: this.record.services,
        recordingTime: this.record.recordingTime,
        amountPaid: this.record.amountPaid,
      })
    }
  }

  ngOnDestroy(): void {
    this.completeRequests()
  }

  completeRequests() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getServices() {
    this.completeRequests()
    this.servicesService.getServices(this.selectFilterParamServices, 1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.servicesOptions.set(res?.data?.items)
        }
      })
  }

  getEmployees() {
    this.completeRequests()
    this.employeeService.getEmployees(this.selectFilterParamEmployee, 1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.employeesOptions.set(res?.data?.items)
        }
      })
  }

  getCustomers() {
    this.completeRequests()
    this.customerService.getCustomers(this.selectFilterParamCustomer, 1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.customersOptions.set(res?.data?.items)
        }
      })
  }

  addEditCustomer() {
    const body = {
      customerId: (this.addRecordFormGroup.controls['customer'].value)?.id,
      employeeId: (this.addRecordFormGroup.controls['employee'].value)?.id,
      servicesId: [(this.addRecordFormGroup.controls['services'].value)?.id],
      recordingTime: this.addRecordFormGroup.controls['recordingTime'].value,
      amountPaid: this.addRecordFormGroup.controls['amountPaid'].value,
    }
    if (this.edit) {
      this.recordService.editRecord(this.record.id, body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getRecords.emit()
            this.toastService.success('Данные клиента сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные клиента!')
          }
        })
    } else {
      this.recordService.addRecord(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getRecords.emit()
            this.toastService.success('Данные клиента сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные клиента!')
          }
        })
    }
  }

  closeModal() {
    this.close.emit(false)
  }

  selectFilterEmployees(s: any) {
    this.selectFilterParamEmployee = s
    this.addRecordFormGroup.controls['employee'].setValue(s)
    this.getEmployees()
  }

  selectEmployee(s: any) {
    this.addRecordFormGroup.controls['employee'].setValue(s)
  }

  selectFilterCustomers(s: any) {
    this.selectFilterParamCustomer = s
    this.getCustomers()
  }

  selectCustomer(s: any) {
    this.addRecordFormGroup.controls['customer'].setValue(s)
  }

  selectFilterServices(s: any) {
    this.selectFilterParamServices = s
    this.getServices()
  }

  selectService(s: any) {
    this.addRecordFormGroup.controls['services'].setValue(s)
  }

  check() {
    console.log(this.addRecordFormGroup)
  }
}
