import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {RecordsService} from '../../../services/records.service';
import {Subject, takeUntil} from 'rxjs';
import {SelectComponent} from '../../select/select.component';
import {EmployeeService} from '../../../services/employee.service';
import {CustomersService} from '../../../services/customers.service';
import {ServicesService} from '../../../services/services.service';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-edit-record-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    NgMultiSelectDropDownModule
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

  servicesOptions: WritableSignal<any[]> = signal([]);
  selectedServices: any[] = []

  showServicesFilter: WritableSignal<boolean> = signal(false)

  servicesSettings = {
    idField: 'id',
    textField: 'name',
    allowSearchFilter: this.showServicesFilter(),
    enableCheckAll: false,
    limitSelection: -1,
  };

  addRecordFormGroup = new FormGroup({
    //customer: new FormControl<any>(null, [Validators.required]),
    employee: new FormControl<any>(null, [Validators.required]),
    services: new FormControl<any>(null, [Validators.required]),
    recordingTime: new FormControl(null, [Validators.required]),
    amountPaid: new FormControl(0),
    fullName: new FormControl<string>('', [Validators.required]),
    phoneNumber: new FormControl(null, [Validators.required]),
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
    this.getServices()

    if (this.edit) {
      this.addRecordFormGroup.setValue({
        //customer: this.record.customer,
        employee: this.record.employee,
        services: this.record.services,
        recordingTime: this.record.recordingTime,
        amountPaid: this.record.amountPaid,
        fullName: this.record?.customer?.fullName,
        phoneNumber: this.record?.customer?.phoneNumber,
      })
      this.selectedServices = this.record.services
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
    this.servicesService.getServices(null, 1, 10)
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

  addEditRecord() {
    const customer = {
      fullName: this.addRecordFormGroup.controls['fullName'].value,
      phoneNumber: this.addRecordFormGroup.controls['phoneNumber'].value,
      docNumber: 1,
      address: ''
    }

    let servicesId = new Set()
    if (this.selectedServices.length) {
      this.selectedServices.forEach(val => servicesId.add(val))
    }

    this.customerService.addCustomer(customer)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {

          const record = {
            customerId: res?.data,
            employeeId: (this.addRecordFormGroup.controls['employee'].value)?.id,
            servicesId: servicesId,
            recordingTime: this.addRecordFormGroup.controls['recordingTime'].value,
            amountPaid: this.addRecordFormGroup.controls['amountPaid'].value,
          }

          if (this.edit) {
            this.recordService.editRecord(this.record.id, record)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (res: any) => {
                  this.getRecords.emit()
                  this.toastService.success('Клиент успешно записан!')
                  this.closeModal()
                }, error: (err: any) => {
                  this.toastService.error('Не удалось сохранить запись клиента!')
                }
              })
          } else {
            this.recordService.addRecord(record)
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

        }, error: err => {
          this.toastService.error('Не удалось созранить запись!')
        }
      })
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

  //----------------------Services----------------------------------
  onSelectService(item: any) {
    this.addRecordFormGroup.controls['services'].setValue(this.selectedServices)
  }

  onDeSelectService(item: any) {
    this.addRecordFormGroup.controls['services'].setValue(this.selectedServices)
  }

  //----------------------------------------------------------------

}
