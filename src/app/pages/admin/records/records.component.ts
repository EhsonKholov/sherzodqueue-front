import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {ToastService} from '../../../services/toast.service';
import {RecordsService} from '../../../services/records.service';
import {
  AddEditRecordModalComponent
} from '../../../components/modals/add-edit-record-modal/add-edit-record-modal.component';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';
import {Subject, takeUntil} from 'rxjs';
import {DialogModule} from 'primeng/dialog';
import {SecondsToDatePipe} from '../../../pipes/seconds-to-date.pipe';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
    AddEditRecordModalComponent,
    CurrencyPipe,
    DialogModule,
    SecondsToDatePipe,
    DropdownModule
  ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css',
  animations: [slideLeftMargin],
})
export class RecordsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  records: WritableSignal<any[]> = signal([])
  show_filter: WritableSignal<boolean> = signal(true)
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  addRecordModalShow: WritableSignal<boolean> = signal(false)
  deleteRecordModalShow: WritableSignal<boolean> = signal(false)
  isRecordEdit = false
  record: any

  filter = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
    customerId: new FormControl(),
    employeeId: new FormControl(),
    chairId: new FormControl(),
    status: new FormControl(),
  })

  additionalInformationModalShow: WritableSignal<boolean> = signal(false);
  statuses = signal<any[]>([
    {code: 0, text: 'Ожидается'},
    {code: 1, text: 'Принят'},
    {code: 2, text: 'В процессе'},
    {code: 3, text: 'Завершен'},
    {code: 4, text: 'Отменен'},
  ]);

  constructor(private recordService: RecordsService, private toastService: ToastService) {
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
          this.total_pages = res?.totalPages
        }, error: (error: any) => {
          if (error.status != 401) return
          this.toastService.error('Ошибка получения данных!')
        }
      })
  }

  clearFilter() {
    this.filter.reset()
  }

  onPageChange(event: { page_number: number; page_size: number }): void {
    this.page_num = event.page_number
    this.page_size = event.page_size
    this.getRecords()
  }

  closeAddRecordModal(event: any) {
    this.addRecordModalShow.set(event)
  }

  editRecord(item: any) {
    console.log('editRecord', item)
    this.addRecordModalShow.set(true)
    this.isRecordEdit = true
    this.record = item
  }

  addRecord() {
    this.addRecordModalShow.set(true)
    this.record = null
    this.isRecordEdit = false
  }

  deleteRecordInit(item: any) {
    this.record = item
    this.deleteRecordModalShow.set(true)
  }

  deleteRecord() {
    this.recordService.deleteRecord(this.record.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Клиент удален!')
          this.deleteRecordModalShow.set(false)
          this.getRecords()
        }, error: (error: any) => {
          this.toastService.success('Ошибка удаления клиента!')
        }
      })
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
}
