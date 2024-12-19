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
    SecondsToDatePipe
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
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    query: new FormControl<string | null>(null),
  })

  constructor(private recordService: RecordsService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getRecords()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  additionalInformationModalShow: WritableSignal<boolean> = signal(false);

  getRecords() {
    this.recordService.getRecord(this.filter.controls['query'].value, this.page_num, this.page_size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.records.set(res?.data?.items)
          this.page_num = res?.data?.page
          this.page_size = res?.data?.size
          this.totalElements = res?.data?.totalCount
          this.total_pages = res?.data?.totalPages
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
