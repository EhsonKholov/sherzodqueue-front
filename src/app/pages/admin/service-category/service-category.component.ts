import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {
  AddEditServiceModalComponent
} from "../../../components/modals/add-edit-service-modal/add-edit-service-modal.component";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {PaginationComponent} from "../../../components/pagination/pagination.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Subject, takeUntil} from 'rxjs';
import {ServicesService} from '../../../services/services.service';
import {ToastService} from '../../../services/toast.service';
import {ServiceCategoryService} from '../../../services/service-category.service';
import {
  AddEditServiceCategoryModalComponent
} from '../../../components/modals/add-edit-service-category-modal/add-edit-service-category-modal.component';
import {SecondsToDatePipe} from '../../../pipes/seconds-to-date.pipe';
import {DropdownModule} from 'primeng/dropdown';
import {FloatLabelModule} from 'primeng/floatlabel';

@Component({
  selector: 'app-service-category',
  standalone: true,
  imports: [
    PaginationComponent,
    ReactiveFormsModule,
    AddEditServiceCategoryModalComponent,
    SecondsToDatePipe,
    DropdownModule,
    FloatLabelModule
  ],
  templateUrl: './service-category.component.html',
  styleUrl: './service-category.component.css'
})
export class ServiceCategoryComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  servicesCategories: WritableSignal<any[]> = signal([])
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  addServiceCategoryModalShow: WritableSignal<boolean> = signal(false)
  deleteServiceModalShow: WritableSignal<boolean> = signal(false)
  serviceCategory: any

  /*
  {
    "name": "string",
    "isTechnician": true,
    "enabled": true,
    "includeDependencies": false
  }
  */

  enabledArr: WritableSignal<any[]> = signal([
    {value: null, label: 'Все'},
    {value: true, label: 'Активные'},
    {value: false, label: 'Не активные'},
  ])

  technicianArr: WritableSignal<any[]> = signal([
    {value: null, label: 'Все'},
    {value: true, label: 'Для техника'},
    {value: false, label: 'Для доктора'},
  ])

  filter = new FormGroup({
    name: new FormControl(),
    isTechnician: new FormControl<any>(null),
    enabled: new FormControl<any>(null),
  })

  constructor(private serviceCategoryService: ServiceCategoryService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getServicesCategories()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getServicesCategories() {
    let filters: any = {}
    if (this.filter.controls?.name?.value != null) {
      filters.name = this.filter.controls?.name?.value
    }
    if (this.filter.controls?.isTechnician?.value != null) {
      filters.isTechnician = this.filter.controls?.isTechnician?.value?.value
    }
    if (this.filter.controls?.enabled?.value != null) {
      filters.enabled = this.filter.controls?.enabled?.value?.value
    }

    let body = {
      'page': this.page_num,
      'pageSize': this.page_size,
      'filters': filters
    }
    this.serviceCategoryService.getServicesCategory(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.servicesCategories.set(res?.items)
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
    this.getServicesCategories()
  }

  closeAddServiceCategoryModal(event: any) {
    this.addServiceCategoryModalShow.set(event)
  }

  editService(item: any) {
    this.addServiceCategoryModalShow.set(true)
    this.serviceCategory = item
  }

  addServiceCategory() {
    this.addServiceCategoryModalShow.set(true)
    this.serviceCategory = null
  }

  deleteServiceCategoryInit(item: any) {
    this.serviceCategory = item
    this.deleteServiceModalShow.set(true)
  }

  deleteServiceCategory() {
    this.serviceCategoryService.deleteServiceCategory(this.serviceCategory.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Категория успешно удалена!')
          this.deleteServiceModalShow.set(false)
          this.getServicesCategories()
        }, error: (error: any) => {
          this.toastService.success('Ошибка удаления категории!')
        }
      })
  }
}
