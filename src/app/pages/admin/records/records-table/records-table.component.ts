import {Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {PaginationComponent} from '../../../../components/pagination/pagination.component';
import {PaginatorModule} from 'primeng/paginator';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {SecondsToDatePipe} from '../../../../pipes/seconds-to-date.pipe';
import {Subject, takeUntil} from 'rxjs';
import {RecordsService} from '../../../../services/records.service';
import {ToastService} from '../../../../services/toast.service';
import {UtilsService} from '../../../../services/utils.service';
import {DialogModule} from 'primeng/dialog';
import {ToothDentalFormulaComponent} from '../../../../components/tooth-dental-formula/tooth-dental-formula.component';
import {
  AddEditRecordModalComponent
} from '../../../../components/modals/add-edit-record-modal/add-edit-record-modal.component';

@Component({
  selector: 'app-records-table',
  standalone: true,
  imports: [
    CurrencyPipe,
    DropdownModule,
    PaginationComponent,
    PaginatorModule,
    ReactiveFormsModule,
    SecondsToDatePipe,
    DialogModule,
    ToothDentalFormulaComponent,
    AddEditRecordModalComponent
  ],
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.css'
})
export class RecordsTableComponent implements OnInit {

  private destroy$ = new Subject<void>()
  records: WritableSignal<any[]> = signal([])
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  deleteRecordModalShow: WritableSignal<boolean> = signal(false)
  record: any

  additionalInformationModalShow: WritableSignal<boolean> = signal(false);
  statuses = signal<any[]>([
    /*{code: null, text: 'Все'},*/
    {code: 0, text: 'Ожидается'},
    {code: 1, text: 'Принят'},
    {code: 2, text: 'В процессе'},
    {code: 3, text: 'Завершен'},
    {code: 4, text: 'Отменен'},
  ]);

  addRecordModalShow = signal(false)

  @Input() set addRecord(arg: boolean) {
    this.addRecordFn(arg)
  }


  filter = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
    customerId: new FormControl(),
    employeeId: new FormControl(),
    chairId: new FormControl(),
    status: new FormControl(),
  })
  @Output() closeAddRecord = new EventEmitter<any>();


  constructor(private recordService: RecordsService, private toastService: ToastService, private utilsService: UtilsService) {
  }

  ngOnInit(): void {
    this.getRecords()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRecords() {
    let body = {
      "page": this.page_num,
      "pageSize": this.page_size,
      "filters": {
        fromDate: this.filter.controls.fromDate.value,
        toDate: this.filter.controls.toDate.value,
        customerId: this.filter.controls.customerId.value,
        employeeId: this.filter.controls.employeeId.value,
        chairId: this.filter.controls.chairId.value,
        status: this.filter.controls.status?.value?.code,
        includeDependencies: true
      },
    }

    this.recordService.getRecord(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.records.set(res?.items)
          this.page_num = res?.page
          this.page_size = res?.pageSize
          this.totalElements = res?.totalCount
          this.total_pages = (this.totalElements / this.page_size) + (this.totalElements % this.page_size > 0 ? 1 : 0)
        }, error: (error: any) => {
          if (error.status != 401) return
          this.toastService.error('Ошибка получения данных!')
        }
      })
  }

  deleteRecord() {
    this.recordService.deleteRecord(this.record.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Запись удален!')
          this.deleteRecordModalShow.set(false)
          this.getRecords()
        }, error: (error: any) => {
          this.toastService.success('Ошибка удаления записи!')
        }
      })
  }

  onPageChange(event: { page_number: number; page_size: number }): void {
    this.page_num = event.page_number
    this.page_size = event.page_size
    this.getRecords()
  }

  closeAddRecordModal(event: any) {
    this.addRecordModalShow.set(event)
    this.closeAddRecord.emit()
    this.record = null
  }

  editRecord(item: any) {
    this.addRecordModalShow.set(true)
    this.record = item
  }

  addRecordFn(arg: boolean) {
    this.addRecordModalShow.set(arg)
    this.record = null
  }

  deleteRecordInit(item: any) {
    this.record = item
    this.deleteRecordModalShow.set(true)
  }

  getRecordServicesnames(item: any) {
    if (item?.services == null) return ''

    let s = ''
    for (let i of item.services) {
      s += i?.name + ', '
    }

    return s.trim()
  }

  detailRecord(item: any) {
    console.log(item)
    this.additionalInformationModalShow.set(true)
    this.record = item
  }

  changeRecordStatus(event: any, item: any) {
    let record = this.utilsService.cloneObject(item)
    let record_new = {
      customerPhoneNumber: record?.customer?.phoneNumber,
      customerName: record?.customer?.name,
      customerSurname: record?.customer?.surname,
      customerLastname: record?.customer?.lastname,
      employeeId: record?.employee?.id,
      recordingTime: record?.recordingTime,
      amountPaid: record?.amountPaid || 0,
      totalPrice: record?.totalPrice || 0,
      techniqueAmount: record?.techniqueAmount || 0,
      employeeAmount: record?.employeeAmount || 0,
      chairId: record?.chair?.id,
      details: record?.details,
      status: event?.target?.value,
    }

    this.recordService.editRecord(record.id, record_new)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          let idx = this.records().findIndex((r: any) => r.id == res.id)
          if (idx > 0) {
            this.records()[idx] = res
          }
          this.toastService.success('Статус записи успешно изменен!')
        }, error: () => {
          this.toastService.error('Не удалось изменить статус записи!')
        }
      })
  }

  getSelectedToothFromRecordAsSignal(record: any) {
    let selectedTooth: WritableSignal<any[]> = signal([])
    if (record?.details != null && record?.details.length > 0) {
      for (let detail of this.record?.details) {
        selectedTooth().push(detail?.toothId)
      }
    }

    return selectedTooth;
  }

  getClassBgByStatus(statusCode: any): any {
    switch (statusCode) {
      case 0:
      case 1:
        return ''
      case 2:
        return 'app-warning-bg'
      case 3:
        return 'app-success-bg'
      case 4:
        return 'app-danger-bg'
      default:
        return ''
    }
  }

  getClassColorByStatus(statusCode: any): any {
    switch (statusCode) {
      case 0:
      case 1:
        return ''
      case 2:
        return 'app-warning-color'
      case 3:
        return 'app-success-color'
      case 4:
        return 'app-danger-color'
      default:
        return ''
    }
  }
}
