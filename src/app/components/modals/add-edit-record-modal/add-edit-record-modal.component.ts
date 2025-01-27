import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {RecordsService} from '../../../services/records.service';
import {Subject, takeUntil} from 'rxjs';
import {EmployeeService} from '../../../services/employee.service';
import {CustomersService} from '../../../services/customers.service';
import {ChairsService} from '../../../services/chairs.service';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import moment from 'moment';
import {DatePipe} from '@angular/common';
import {ToothDentalFormulaComponent} from '../../tooth-dental-formula/tooth-dental-formula.component';
import {ServiceCategoryService} from '../../../services/service-category.service';
import {HttpHeaders} from '@angular/common/http';

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

  @Input() startDate!: WritableSignal<Date | null>;
  @Input() endDate!: WritableSignal<Date | null>;

  activeToothCode: WritableSignal<any> = signal(null)
  selectedTooth: WritableSignal<any[]> = signal([])

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
    private serviceCategoryService: ServiceCategoryService,
    private chairsService: ChairsService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) {
  }

  /*
   {
      "customerPhoneNumber": "string",
      "customerName": "string",
      "customerSurname": "string",
      "customerLastname": "string",
      "employeeId": 0,
      "recordingTime": "2025-01-05T05:37:31.426Z",
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

    this.getEmployees()
    this.getServices()
    this.getChairs()

    if (this.record == null) {
      this.addRecordFormGroup = this.formBuilder.group({
        customerSurname: [null, Validators.required],
        customerName: [null, Validators.required],
        customerLastname: null,
        customerPhoneNumber: [null, Validators.required],
        employeeId: [null, Validators.required],
        recordingTime: [this.startDate(), Validators.required],
        endTime: [this.endDate(), Validators.required],
        amountPaid: 0,
        totalPrice: 0,
        techniqueAmount: 0,
        employeeAmount: 0,
        chairId: null,
        details: this.formBuilder.array([]),
      })
    } else {
      let recordingDay = moment(this.record?.recordingTime).format('YYYY-MM-DD')
      let recordingTime = moment(this.record?.recordingTime).format('HH:MM:SS')

      this.addRecordFormGroup = this.formBuilder.group({
        id: [this.record?.id, Validators.required],
        customerSurname: [this.record?.customer?.surname, Validators.required],
        customerName: [this.record?.customer?.name, Validators.required],
        customerLastname: this.record?.customer?.lastname,
        customerPhoneNumber: [this.record?.customer?.phoneNumber, Validators.required],
        employeeId: [this.record?.employee, Validators.required],
        recordingTime: [this.datePipe.transform(this.record?.recordingTime, 'yyyy-MM-ddTHH:mm:ss'), Validators.required],
        endTime: [new Date(this.record?.endTime), Validators.required],
        amountPaid: this.record?.amountPaid || 0,
        totalPrice: this.record?.totalPrice || 0,
        techniqueAmount: this.record?.techniqueAmount || 0,
        employeeAmount: this.record?.employeeAmount || 0,
        chairId: this.record?.chair,
        details: this.formBuilder.array(this.record?.details || []),
      })

      if (this.record?.details != null && this.record?.details.length > 0) {
        for (let detail of this.record?.details) {
          this.selectedTooth().push(detail?.toothId)
        }
      }
      //this.getAvailableTimes()
    }

    console.log(this.addRecordFormGroup?.value)

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

    if (this.addRecordFormGroup.controls?.services?.invalid || this.addRecordFormGroup.controls?.employeeId?.invalid
      || this.addRecordFormGroup.controls?.chair?.invalid || this.addRecordFormGroup.controls?.recordingDay?.invalid) {

      return false
    }

    const date = this.addRecordFormGroup.controls?.recordingDay?.value
    const employeeId = this.addRecordFormGroup.controls?.employeeId?.value?.id
    const chairId = this.addRecordFormGroup.controls?.chair?.value?.id

    let body = {
      /*"date": "2025-01-13",
      "employeeId": 0,
      "chairId": 0*/
    }

    this.recordService.getAvailableTimes(body)
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
    let body = {
      phoneNumber: obj.query,
    }
    const headers = new HttpHeaders({ 'X-Show-Loader': 'false' });
    this.customerService.getCustomersList(body, headers)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.filteredCustomers.set(res?.items)
        }
      })
  }

  getServices() {
    this.completeRequests()
    let body = {
      enabled: true,
      includeDependencies: true
    }
    this.serviceCategoryService.getServicesCategoryList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.categoryWithService.set(res?.items)
        }
      })
  }

  getChairs() {
    this.completeRequests()
    let body = {}
    this.chairsService.getChairsList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.chairs.set(res?.items)
        }
      })
  }

  getEmployees() {
    this.completeRequests()
    let body = {
      enabled: true
    }
    this.employeeService.getEmployeesList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.employees.set(res?.items)
        }
      })
  }

  addEditRecord() {
    let record = this.addRecordFormGroup.value
    record.employeeId = this.addRecordFormGroup.controls.employeeId.value.id
    record.chairId = this.addRecordFormGroup.controls.chairId?.value?.id

    if (record?.details !== null) {
      record?.details.forEach((d: any) => {
        d.servicesId = d?.services.map((s: any) => s?.id)
      })
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
  onSelectService(items: any) {
    if (items == null)
      this.selectedServices = []
    else
      this.selectedServices = items?.value

    let idx = this.getIndexFromAddRecordFormGroupByToothCode(this.activeToothCode())
    if (idx > -1) {
      this.addRecordFormGroup.controls?.details?.controls[idx]?.controls?.services.setValue(this.selectedServices)
    }

    this.calculateAmounts()
  }

  onDeSelectService(item: any) {
    //this.addRecordFormGroup.controls?.services?.setValue(this.selectedServices)
  }

  //----------------------Employees----------------------------------
  onSelectEmployees(item: any) {
    this.addRecordFormGroup.controls?.employeeId?.setValue(item)
    //this.getAvailableTimes()
  }

  onDeSelectEmployees(item: any) {
    this.addRecordFormGroup.controls?.employeeId?.setValue(item)
    //this.getAvailableTimes()
  }

  //----------------------------------------------------------------

  // ----------------------Chairs----------------------------------
  onSelectChairs(item: any) {
    this.addRecordFormGroup.controls?.chairId?.setValue(item)
  }

  onDeSelectChairs(item: any) {
    this.addRecordFormGroup.controls?.chairId?.setValue(item)
  }

  //----------------------------------------------------------------

  onSelectCustomer(event: any) {
    this.addRecordFormGroup.controls.customerSurname.setValue(event?.value?.surname)
    this.addRecordFormGroup.controls.customerName.setValue(event?.value?.name)
    this.addRecordFormGroup.controls.customerLastname.setValue(event?.value?.lastname)
    this.addRecordFormGroup.controls.customerPhoneNumber.setValue(event?.value?.phoneNumber)
  }

  //----------------------------------------------------------------

  onSelectedTooth(currentToothCode: any) {
    console.log('currentToothCode', currentToothCode)
    this.activeToothCode.set(currentToothCode)
    let idx = this.getIndexFromAddRecordFormGroupByToothCode(currentToothCode)

    if (idx == -1) {
      this.addRecordFormGroup.controls?.details?.push(
        new FormGroup({
          toothId: new FormControl(this.activeToothCode()),
          details: new FormControl(''),
          services: new FormControl([])
        })
      )

      this.selectedServices = []
    } else {
      this.selectedServices = this.selectedServices = this.addRecordFormGroup.controls?.details?.controls[idx]?.value?.services
      console.log('selectedServices', this.selectedServices)
      console.log(this.addRecordFormGroup.controls?.details?.value)
    }
  }

  onDeselectTooth(deselectedToothCode: any) {
    this.activeToothCode.set(null)
    let idx = this.getIndexFromAddRecordFormGroupByToothCode(deselectedToothCode)

    if (idx > -1) {
      this.addRecordFormGroup.controls?.details?.removeAt(idx)
    }
    console.log(this.addRecordFormGroup.controls?.details?.value)
  }

  //----------------------------------------------------------------

  getIndexFromAddRecordFormGroupByToothCode(toothCode: any) {
    return this.addRecordFormGroup.controls?.details?.controls.findIndex((d: any) => d?.value?.toothId == toothCode)
  }

  findCategoryByServiceId(service: any) {
    return this.categoryWithService().find(category =>
      category.services.some((ser: any) => ser.id === service.id)
    )
  }

  calculateAmounts() {
    if (this.addRecordFormGroup.controls?.details?.value == null || this.addRecordFormGroup.controls?.details?.value?.length == 0) {
      this.addRecordFormGroup.controls?.amountPaid.setValue(0)
      this.addRecordFormGroup.controls?.totalPrice.setValue(0)
      this.addRecordFormGroup.controls?.techniqueAmount.setValue(0)
      this.addRecordFormGroup.controls?.employeeAmount.setValue(0)
    }

    let techniqueAmount = 0, employeeAmount = 0
    let details = this.addRecordFormGroup.controls?.details?.value
    for (let item of details) {
      if (item?.services == null || item?.services?.length == 0) {
        continue;
      }

      for (let service of item?.services) {
        let category = this.findCategoryByServiceId(service)
        if (category?.isTechnician) {
          techniqueAmount += +service?.price
        } else {
          employeeAmount += +service?.price
        }
      }
    }

    let totalPrice = this.addRecordFormGroup.controls?.totalPrice?.value + techniqueAmount + employeeAmount
    this.addRecordFormGroup.controls?.totalPrice.setValue(totalPrice)
    this.addRecordFormGroup.controls?.techniqueAmount.setValue(techniqueAmount)
    this.addRecordFormGroup.controls?.employeeAmount.setValue(employeeAmount)
  }
}
