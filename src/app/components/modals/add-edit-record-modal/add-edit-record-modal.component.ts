import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {RecordsService} from '../../../services/records.service';
import {firstValueFrom, lastValueFrom, map, Subject, takeUntil} from 'rxjs';
import {SelectComponent} from '../../select/select.component';
import {EmployeeService} from '../../../services/employee.service';
import {CustomersService} from '../../../services/customers.service';
import {ServicesService} from '../../../services/services.service';
import {ChairsService} from '../../../services/chairs.service';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-add-edit-record-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    NgMultiSelectDropDownModule,
    MultiSelectModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    DatePipe,
  ],
  templateUrl: './add-edit-record-modal.component.html',
  styleUrl: './add-edit-record-modal.component.css'
})
export class AddEditRecordModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() record: any
  @Output() close = new EventEmitter<any>();
  @Output() getRecords: EventEmitter<any> = new EventEmitter<any>()

  today = new Date()

  availableTimes: WritableSignal<any[]> = signal([]);

  categoryWithService: WritableSignal<any[]> = signal([]);
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
    allowRemoteDataSearch: true,
    closeDropDownOnSelection: true,
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
    allowRemoteDataSearch: true,
    closeDropDownOnSelection: true,
  };

  addRecordFormGroup: any

  filteredCustomers: WritableSignal<any[]> = signal([]);


  constructor(
    private recordService: RecordsService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private customerService: CustomersService,
    private servicesService: ServicesService,
    private chairsService: ChairsService,
  ) {
  }

  /*
  {
    "customerPhoneNumber": "string",
    "customerName": "string",
    "customerSurname": "string",
    "customerLastname": "string",
    "employeeId": 0,
    "servicesId": [
      0
    ],
    "recordingTime": "2024-12-05T02:52:21.843Z",
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
        customerSurname: new FormControl(null, [Validators.required]),
        customerName: new FormControl(null, [Validators.required]),
        customerLastname: new FormControl(null),
        customerPhoneNumber: new FormControl(null, [Validators.required]),
        employee: new FormControl(null, [Validators.required]),
        services: new FormControl(null, [Validators.required]),
        recordingDay: new FormControl(null, [Validators.required]),
        recordingTime: new FormControl(null, [Validators.required]),
        amountPaid: new FormControl(0, [Validators.required]),
        totalPrice: new FormControl(0, [Validators.required]),
        chair: new FormControl(null, [Validators.required]),
      })
    } else {
      this.addRecordFormGroup = new FormGroup({
        id: new FormControl(this.record?.id, [Validators.required]),
        customerSurname: new FormControl(null, [Validators.required]),
        customerName: new FormControl(null, [Validators.required]),
        customerLastname: new FormControl(null),
        customerPhoneNumber: new FormControl(null, [Validators.required]),
        employee: new FormControl(this.record?.employee, [Validators.required]),
        services: new FormControl(this.record?.services, [Validators.required]),
        recordingDay: new FormControl(this.record?.recordingTime, [Validators.required]),
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

  getAvailableTimes(): any {
    this.addRecordFormGroup.controls?.recordingTime?.setValue(null)
    this.availableTimes.set([])

    if (this.addRecordFormGroup.controls?.services?.invalid || this.addRecordFormGroup.controls?.employee?.invalid
      || this.addRecordFormGroup.controls?.chair?.invalid || this.addRecordFormGroup.controls?.recordingDay?.invalid) {
      //this.addRecordFormGroup.controls?.recordingTime?.disable(true)

      return false
    }

    //this.addRecordFormGroup.controls?.recordingTime?.disable(false)

    const date = this.addRecordFormGroup.controls?.recordingDay?.value
    const employeeId = this.addRecordFormGroup.controls?.employee?.value?.id
    const chairId = this.addRecordFormGroup.controls?.chair?.value?.id
    this.recordService.getAvailableTimes(date, employeeId, chairId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log(res?.data)
          this.availableTimes.set(res?.data)
        }
      })
  }

  filterCustomers(query: any = '') {
    this.customerService.getCustomers(query, 1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.filteredCustomers.set(res?.data?.items)
        }
      })
  }

  getServices() {
    this.completeRequests()
    this.servicesService.getCategoriesWithServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.categoryWithService.set(res?.data)
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
    let servicesId = new Set()
    let services: any[] = this.addRecordFormGroup.controls?.services?.value
    if (services?.length) {
      services?.forEach(val => servicesId.add(val?.id))
    }

    let record = {
      ...this.addRecordFormGroup.value,
      employeeId: this.addRecordFormGroup.controls.employee.value.id,
      chairId: this.addRecordFormGroup.controls.chair.value.id,
      servicesId: Array.from(servicesId),
      recordingTime: this.addRecordFormGroup.controls.recordingDay.value + 'T' + this.addRecordFormGroup.controls.recordingTime.value,
    }

    console.log('record', record)

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
    this.getAvailableTimes()
  }

  onDeSelectEmployees(item: any) {
    this.addRecordFormGroup.controls?.employee?.setValue(item)
    this.getAvailableTimes()
  }

  //----------------------------------------------------------------

  // ----------------------Chairs----------------------------------
  onSelectChairs(item: any) {
    this.addRecordFormGroup.controls?.chair?.setValue(item)
    this.getAvailableTimes()
  }

  onDeSelectChairs(item: any) {
    this.addRecordFormGroup.controls?.chair?.setValue(item)
    this.getAvailableTimes()
  }

  //----------------------------------------------------------------

  onSelectCustomer(event: any) {
    console.log(event)
    this.addRecordFormGroup.controls.customerSurname.setValue(event?.value?.surname)
    this.addRecordFormGroup.controls.customerName.setValue(event?.value?.name)
    this.addRecordFormGroup.controls.customerLastname.setValue(event?.value?.lastname)
    this.addRecordFormGroup.controls.customerPhoneNumber.setValue(event?.value?.phoneNumber)
  }

}
