import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../services/toast.service';
import {ServicesService} from '../../../services/services.service';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';
import {
  AddEditServiceModalComponent
} from '../../../components/modals/add-edit-service-modal/add-edit-service-modal.component';
import {DropdownModule} from 'primeng/dropdown';
import {FloatLabelModule} from 'primeng/floatlabel';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ServiceCategoryService} from '../../../services/service-category.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    AddEditServiceModalComponent,
    DropdownModule,
    FloatLabelModule,
    NgMultiSelectDropDownModule
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

  enabledArr: WritableSignal<any[]> = signal([
    {value: null, label: 'Все'},
    {value: true, label: 'Активные'},
    {value: false, label: 'Не активные'},
  ])

  filter = new FormGroup({
    name: new FormControl(),
    category: new FormControl<any>(null),
    enabled: new FormControl<any>(null),
    includeDependencies: new FormControl<any>(true),
  })

  categories: WritableSignal<any[]> = signal([])

  constructor(
    private servicesService: ServicesService,
    private toastService: ToastService,
    private serviceCategoryService: ServiceCategoryService
  ) {
  }

  ngOnInit(): void {
    this.getServices()
    this.getServicesCategories()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getServicesCategories() {
    let body = {
      includeDependencies: false,
    }
    this.serviceCategoryService.getServicesCategoryList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.categories.set(res?.items)
        }
      })
  }

  getServices() {
    let body = {
      page: this.page_num,
      pageSize: this.page_size,
      filters: this.filter.value

  }
    this.servicesService.getServices(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.services.set(res?.items)
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
