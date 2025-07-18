import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../../services/toast.service';
import {ServicesService} from '../../../../services/services.service';
import {UtilsService} from '../../../../services/utils.service';
import {SelectComponent} from '../../../../components/select/select.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ServiceCategoryService} from '../../../../services/service-category.service';
import {openCloseAnimation} from '../../../../animations/openClose.animation';

@Component({
  selector: 'app-add-edit-service-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    NgMultiSelectDropDownModule
  ],
  templateUrl: './add-edit-service-modal.component.html',
  styleUrl: './add-edit-service-modal.component.css',
  animations: [
    openCloseAnimation
  ]
})
export class AddEditServiceModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() service: any
  @Output() close = new EventEmitter<any>();
  @Output() getServices: EventEmitter<any> = new EventEmitter<any>()

  categories: WritableSignal<any[]> = signal([])
  selectedCategories: any[] = []

  categorySelectSettings = {
    idField: 'id',
    textField: 'name',
    //allowSearchFilter: this.showCategorySelectFilter(),
    enableCheckAll: false,
    selectAllText: 'Select All',
    unSelectAllText: 'Select All',
    allowSearchFilter: true,
    searchPlaceholderText: 'Поиск',
    // limitSelection: 1,
    singleSelection: true,
  };

  addServiceFormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [Validators.required]),
    duration: new FormControl(null, [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    enabled: new FormControl(true, [Validators.required]),
    categoryId: new FormControl<any>(null, [Validators.required]),
  })

  constructor(
    private servicesService: ServicesService,
    private serviceCategoryService: ServiceCategoryService,
    private toastService: ToastService,
    private utils: UtilsService,
  ) {}


  ngOnInit(): void {
    console.log(this.service)
    this.getServicesCategories()

    if (this.service != null) {
      this.addServiceFormGroup.setValue({
        id: this.service?.id,
        name: this.service?.name,
        duration: this.service?.duration,
        price: this.service?.price,
        enabled: this.service?.enabled,
        categoryId: this.service?.category?.id,
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getServicesCategories() {
    let body = {
      enabled: true,
      includeDependencies: false
    }
    this.serviceCategoryService.getServicesCategoryList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.categories.set(res?.items)
          this.selectedCategories = this.categories().filter((c) => c?.id == this.service?.category?.id)
        }
      })
  }

  addEditService() {
    let body: any = this.utils.cloneObject(this.addServiceFormGroup.value)

    if (!!this.service) {
      this.servicesService.editService(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getServices.emit()
            this.toastService.success('Услуга успешно редактирована!')
            this.closeModal()
          }, error: () => {
            this.toastService.error('Не удалось редактировать услугу!')
          }
        })
    } else {
      this.servicesService.addService(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getServices.emit()
            this.toastService.success('Новая услуга успешна добавлена!')
            this.closeModal()
          }, error: () => {
            this.toastService.error('Не удалось добавить новую услугу!')
          }
        })
    }
  }

  closeModal() {
    this.close.emit(false)
  }

  onSelectCategories(items: any) {
    this.addServiceFormGroup.controls.categoryId.setValue(items?.id)
  }

  onDeSelectCategories(items: any) {
    this.addServiceFormGroup.controls.categoryId.setValue(null)
  }
}
