import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {AddCustomerModalComponent} from '../../../components/modals/add-customer-modal/add-customer-modal.component';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {ToastService} from '../../../services/toast.service';
import {RecordsService} from '../../../services/records.service';
import {
  AddEditRecordModalComponent
} from '../../../components/modals/add-edit-record-modal/add-edit-record-modal.component';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [
    AddCustomerModalComponent,
    DatePipe,
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
    AddEditRecordModalComponent,
    CurrencyPipe
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

  /*
  {
        "recordingTime": "2024-11-27T14:40:00.356",
        "endTime": "2024-11-27T14:50:00.356",
        "amountPaid": 0,
        "totalPrice": 1234,
        "status": 0,
        "customer": {
          "name": "Test",
          "surname": "Test",
          "lastname": null,
          "phoneNumber": "+992917505601",
          "enabled": true,
          "address": "Test",
          "city": "Test",
          "street": null,
          "homeNumber": null,
          "birhday": "2024-10-28",
          "gender": "M",
          "details": null,
          "docNumber": null,
          "email": null,
          "id": 9,
          "dateCreated": "2024-11-26T09:40:35.762694",
          "dateUpdated": null,
          "addedBy": "admin",
          "modifyBy": null
        },
        "employee": {
          "name": "Shohin update",
          "surname": "sherov",
          "lastname": "u",
          "phoneNumber": "99212345687",
          "address": "string",
          "docNo": null,
          "taxId": null,
          "position": "superMAN",
          "interestRate": 0,
          "enabled": true,
          "available": true,
          "willBeAvailable": null,
          "details": null,
          "id": 2,
          "dateCreated": "2024-11-21T00:49:25.605537",
          "dateUpdated": "2024-11-21T00:50:04.49135",
          "addedBy": "admin",
          "modifyBy": "admin"
        },
        "chair": {
          "name": "кресло 3 -UPDATE",
          "enabled": true,
          "id": 4,
          "dateCreated": "2024-11-21T00:20:21.544557",
          "dateUpdated": "2024-11-21T00:20:50.444787",
          "addedBy": "admin",
          "modifyBy": "admin"
        },
        "services": [
          {
            "name": "Консультация",
            "duration": "00:10:00",
            "price": 10.2,
            "enabled": false,
            "category": null,
            "id": 1,
            "dateCreated": "2024-11-20T11:43:00.545251",
            "dateUpdated": "2024-11-27T12:43:00.117909",
            "addedBy": "seed datat",
            "modifyBy": "admin"
          }
        ],
        "id": 5,
        "dateCreated": "2024-11-27T23:48:54.682388",
        "dateUpdated": null,
        "addedBy": "admin",
        "modifyBy": null
      },
  */

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
}
