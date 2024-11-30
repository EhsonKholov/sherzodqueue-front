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
import {ChairsService} from '../../../services/chairs.service';

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
  @Input() record: any
  @Output() close = new EventEmitter<any>();
  @Output() getRecords: EventEmitter<any> = new EventEmitter<any>()

  services: WritableSignal<any[]> = signal([]);
  selectedServices: any[] = []
  servicesSelectSettings = {
    idField: 'id',
    textField: 'name',
    enableCheckAll: false,
    limitSelection: -1,
    allowSearchFilter: true,
    searchPlaceholderText: 'Поиск',
  };

  employees: WritableSignal<any[]> = signal([])
  selectedEmployees: any[] = []
  employeesSelectSettings = {
    idField: 'id',
    textField: 'name',
    enableCheckAll: false,
    singleSelection: true,
    allowSearchFilter: true,
    searchPlaceholderText: 'Поиск',
    allowRemoteDataSearch: true
  };

  chairs: WritableSignal<any[]> = signal([])
  selectedChairs: any[] = []
  chairsSelectSettings = {
    idField: 'id',
    textField: 'name',
    enableCheckAll: false,
    singleSelection: true,
    allowSearchFilter: true,
    searchPlaceholderText: 'Поиск',
    allowRemoteDataSearch: true
  };

  addRecordFormGroup: any

  constructor(
    private recordService: RecordsService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private customerService: CustomersService,
    private servicesService: ServicesService,
    private chairsService: ChairsService,
  ) {}

  /*
  {
    "customerId": 0,
    "employeeId": 0,
    "servicesId": [
      0
    ],
    "recordingTime": "2024-11-29T11:51:57.989Z",
    "amountPaid": 0,
    "totalPrice": 0,
    "chairId": 0
  }
  */

  ngOnInit(): void {
    this.getEmployees()
    this.getServices()
    this.getChairs()

    if (this.record == null) {
      this.addRecordFormGroup = new FormGroup({
        surname: new FormControl(null, [Validators.required]),
        name: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null),
        phoneNumber: new FormControl(null, [Validators.required]),
        employee: new FormControl(null, [Validators.required]),
        services: new FormControl(null, [Validators.required]),
        recordingTime: new FormControl(null, [Validators.required]),
        amountPaid: new FormControl(null, [Validators.required]),
        totalPrice: new FormControl(null, [Validators.required]),
        chair: new FormControl(null, [Validators.required]),
      })
    } else {
      this.addRecordFormGroup = new FormGroup({
        id: new FormControl(this.record?.id, [Validators.required]),
        surname: new FormControl(this.record?.customer?.surname, [Validators.required]),
        name: new FormControl(this.record?.customer?.name, [Validators.required]),
        lastname: new FormControl(this.record?.customer?.lastname),
        phoneNumber: new FormControl(this.record?.customer?.phoneNumber, [Validators.required]),
        employee: new FormControl(this.record?.employee, [Validators.required]),
        services: new FormControl(this.record?.services, [Validators.required]),
        recordingTime: new FormControl(this.record?.recordingTime, [Validators.required]),
        amountPaid: new FormControl(this.record?.amountPaid, [Validators.required]),
        totalPrice: new FormControl(this.record?.totalPrice, [Validators.required]),
        chair: new FormControl(this.record?.chair?.id, [Validators.required]),
      })
    }

    this.selectedServices = this.record?.services
    this.selectedEmployees = [this.record?.employee]
    this.selectedChairs = [this.record?.chair]
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
    this.servicesService.getActivesServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.services.set(res?.data)
        }
      })
  }

  getChairs() {
    this.completeRequests()
    this.chairsService.getChairs(null, 1, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.chairs.set(res?.data?.items)
        }
      })
  }

  getEmployees() {
    this.completeRequests()
    this.employeeService.getActivesEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.employees.set(res?.data)
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

          if (!!this.record) {
            this.recordService.editRecord(this.record.id, record)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.getRecords.emit()
                  this.toastService.success('Клиент успешно записан!')
                  this.closeModal()
                }, error: () => {
                  this.toastService.error('Не удалось сохранить запись клиента!')
                }
              })
          } else {
            this.recordService.addRecord(record)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.getRecords.emit()
                  this.toastService.success('Данные клиента сохранены!')
                  this.closeModal()
                }, error: () => {
                  this.toastService.error('Не удалось сохранить данные клиента!')
                }
              })
          }

        }, error: () => {
          this.toastService.error('Не удалось созранить запись!')
        }
      })
  }

  closeModal() {
    this.close.emit(false)
  }

  //----------------------Services----------------------------------
  onSelectService(item: any) {
    this.addRecordFormGroup.controls?.services?.setValue(this.selectedServices)
  }

  onDeSelectService(item: any) {
    this.addRecordFormGroup.controls?.services?.setValue(this.selectedServices)
  }
  //----------------------------------------------------------------

  //----------------------Employees----------------------------------
  onSelectEmployees(item: any) {
    this.addRecordFormGroup.controls?.employee?.setValue(item)
  }

  onDeSelectEmployees(item: any) {
    this.addRecordFormGroup.controls?.employee?.setValue(item)
  }
  //----------------------------------------------------------------

  // ----------------------Chairs----------------------------------
  onSelectChairs(item: any) {
    this.addRecordFormGroup.controls?.chair?.setValue(item)
  }

  onDeSelectChairs(item: any) {
    this.addRecordFormGroup.controls?.chair?.setValue(item)
  }
  //----------------------------------------------------------------
  protected readonly console = console;
}
