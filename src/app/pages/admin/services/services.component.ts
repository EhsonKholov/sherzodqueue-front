import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../services/toast.service';
import {ServicesService} from '../../../services/services.service';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';
import {
  AddEditServiceModalComponent
} from '../../../components/modals/add-edit-service-modal/add-edit-service-modal.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    AddEditServiceModalComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
  animations: [slideLeftMargin]
})
export class ServicesComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  services: WritableSignal<any[]> = signal([])
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  addServiceModalShow: WritableSignal<boolean> = signal(false)
  deleteServiceModalShow: WritableSignal<boolean> = signal(false)
  service: any

  filter = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    query: new FormControl<string | null>(null),
  })

  constructor(private servicesService: ServicesService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getServices()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getServices() {
    this.servicesService.getServices(this.filter.controls['query'].value, this.page_num, this.page_size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.services.set(res?.data?.items)
          this.page_num = res?.data?.page
          this.page_size = res?.data?.size
          this.totalElements = res?.data?.totalCount
          this.total_pages = res?.data?.totalPages
        }, error: () => {
          this.toastService.error('ошибка получения данных!')
        }
      })
  }

  onPageChange(event: { page_number: number; page_size: number }): void {
    this.page_num = event.page_number
    this.page_size = event.page_size
    this.getServices()
  }

  closeAddServiceModal(event: any) {
    this.addServiceModalShow.set(event)
  }

  editService(item: any) {
    this.addServiceModalShow.set(true)
    this.service = item
  }

  addService() {
    this.addServiceModalShow.set(true)
    this.service = null
  }

  deleteServiceInit(item: any) {
    this.service = item
    this.deleteServiceModalShow.set(true)
  }

  deleteService() {
    this.servicesService.deleteService(this.service.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Услуга успешно удалена!')
          this.deleteServiceModalShow.set(false)
          this.getServices()
        }, error: () => {
          this.toastService.success('Ошибка удаления услуги!')
        }
      })
  }

}
