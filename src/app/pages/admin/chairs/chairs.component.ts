import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {
  AddEditServiceModalComponent
} from '../../../components/modals/add-edit-service-modal/add-edit-service-modal.component';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {PaginatorModule} from 'primeng/paginator';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../services/toast.service';
import {ChairsService} from '../../../services/chairs.service';
import {
  AddEditChairModalComponent
} from '../../../components/modals/add-edit-chair-modal/add-edit-chair-modal.component';

@Component({
  selector: 'app-chairs',
  standalone: true,
  imports: [
    AddEditServiceModalComponent,
    CurrencyPipe,
    PaginationComponent,
    PaginatorModule,
    ReactiveFormsModule,
    DatePipe,
    AddEditChairModalComponent
  ],
  templateUrl: './chairs.component.html',
  styleUrl: './chairs.component.css'
})
export class ChairsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  chairs: WritableSignal<any[]> = signal([])
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  addChairModalShow: WritableSignal<boolean> = signal(false)
  deleteChairModalShow: WritableSignal<boolean> = signal(false)
  chair: any

  filter = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    query: new FormControl<string | null>(null),
  })

  constructor(private chairService: ChairsService, private toastService: ToastService) {}


  ngOnInit(): void {
    this.getChairs()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getChairs() {
    this.chairService.getChairs(this.filter.controls['query'].value, this.page_num, this.page_size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.chairs.set(res?.data?.items)
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

  onPageChange(event: { page_number: number; page_size: number }): void {
    this.page_num = event.page_number
    this.page_size = event.page_size
    this.getChairs()
  }

  closeAddChairModal(event: any) {
    this.addChairModalShow.set(event)
  }

  editChair(item: any) {
    this.addChairModalShow.set(true)
    this.chair = item
  }

  addChair() {
    this.addChairModalShow.set(true)
    this.chair = null
  }

  deleteChairInit(item: any) {
    this.chair = item
    this.deleteChairModalShow.set(true)
  }

  deleteService() {
    this.chairService.deleteChairs(this.chair?.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Запись успешно удалена!')
          this.deleteChairModalShow.set(false)
          this.getChairs()
        }, error: () => {
          this.toastService.success('Ошибка удаления записи!')
        }
      })
  }

}
