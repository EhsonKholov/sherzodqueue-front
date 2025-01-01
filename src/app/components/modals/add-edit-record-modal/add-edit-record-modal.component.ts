import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {RecordsService} from '../../../services/records.service';
import {Subject, takeUntil} from 'rxjs';
import {EmployeeService} from '../../../services/employee.service';
import {CustomersService} from '../../../services/customers.service';
import {ServicesService} from '../../../services/services.service';
import {ChairsService} from '../../../services/chairs.service';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import moment from 'moment';
import {DatePipe} from '@angular/common';
import {ToothDentalFormulaComponent} from '../../tooth-dental-formula/tooth-dental-formula.component';

@Component({
  selector: 'app-add-edit-record-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MultiSelectModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    DatePipe,
    ToothDentalFormulaComponent,
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
      "recordingTime": "2024-12-31T04:48:32.962Z",
      "amountPaid": 0,
      "totalPrice": 0,
      "techniqueAmount": 0,
      "employeeAmount": 0,
      "chairId": 0,
      "details": [
        {
          "recordId": 0,
          "toothId": 0,
          "details": "string",
          "servicesId": [
            0
          ]
        }
      ]
    }
  */

  ngOnInit(): void {
    console.log(this.record)

    /*this.getEmployees()
    this.getServices()
    this.getChairs()*/

    if (this.record == null) {
      this.addRecordFormGroup = new FormGroup({
        customerSurname: new FormControl(null, [Validators.required]),
        customerName: new FormControl(null, [Validators.required]),
        customerLastname: new FormControl(null),
        customerPhoneNumber: new FormControl(null, [Validators.required]),
        employee: new FormControl(null, [Validators.required]),
        services: new FormControl(null, [Validators.required]),
        recordingDay: new FormControl(null),
        recordingTime: new FormControl(null),
        amountPaid: new FormControl(0),
        totalPrice: new FormControl(0),
        chair: new FormControl(null),
        tooth: new FormControl(null, [Validators.required]),
      })
    } else {
      let recordingDay = moment(this.record?.recordingTime).format('YYYY-MM-DD')
      let recordingTime = moment(this.record?.recordingTime).format('HH:MM:SS')

      this.addRecordFormGroup = new FormGroup({
        id: new FormControl(this.record?.id, [Validators.required]),
        customerSurname: new FormControl(this.record?.employee?.surname, [Validators.required]),
        customerName: new FormControl(this.record?.employee?.name, [Validators.required]),
        customerLastname: new FormControl(this.record?.employee?.lastname),
        customerPhoneNumber: new FormControl(this.record?.employee?.phoneNumber, [Validators.required]),
        employee: new FormControl(this.record?.employee, [Validators.required]),
        services: new FormControl(this.record?.services, [Validators.required]),
        recordingDay: new FormControl(recordingDay),
        recordingTime: new FormControl(recordingTime),
        amountPaid: new FormControl(this.record?.amountPaid),
        totalPrice: new FormControl(this.record?.totalPrice),
        chair: new FormControl(this.record?.chair?.id),
      })

      this.getAvailableTimes()
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

      return false
    }

    const date = this.addRecordFormGroup.controls?.recordingDay?.value
    const employeeId = this.addRecordFormGroup.controls?.employee?.value?.id
    const chairId = this.addRecordFormGroup.controls?.chair?.value?.id


    this.recordService.getAvailableTimes(date, employeeId, chairId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.availableTimes.set(res?.data)
          if (!!this.record) {
            let recordingTime = moment(this.record?.recordingTime).format('HH:MM:SS')
            let idx = this.availableTimes().findIndex(r => r == recordingTime)
            if (idx == -1) {
              this.availableTimes().push(recordingTime)
            }
          }
        }
      })
  }

  filterCustomers(obj: any = '') {
    this.customerService.getByPhone(obj.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.filteredCustomers.set(res?.data)
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
  }

  onDeSelectChairs(item: any) {
    this.addRecordFormGroup.controls?.chair?.setValue(item)
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
