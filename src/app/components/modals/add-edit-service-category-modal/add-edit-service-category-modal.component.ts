import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ServicesService} from '../../../services/services.service';
import {ToastService} from '../../../services/toast.service';
import {ServiceCategoryService} from '../../../services/service-category.service';

@Component({
  selector: 'app-add-edit-service-category-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-service-category-modal.component.html',
  styleUrl: './add-edit-service-category-modal.component.css'
})
export class AddEditServiceCategoryModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() serviceCategory: any
  @Output() close = new EventEmitter<any>();
  @Output() getServicesCategories: EventEmitter<any> = new EventEmitter<any>()

  addServiceFormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [Validators.required]),
    enabled: new FormControl(true),
    isTechnician: new FormControl(false),
  })

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    console.log(this.serviceCategory)
    if (!!this.serviceCategory) {
      this.addServiceFormGroup.setValue({
        id: this.serviceCategory.id,
        name: this.serviceCategory.name,
        enabled: this.serviceCategory.enabled,
        isTechnician: this.serviceCategory?.isTechnician,
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEditServiceCategory() {
    let body: any = this.addServiceFormGroup.value
    if (!!this.serviceCategory) {
      this.serviceCategoryService.editServiceCategory(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getServicesCategories.emit()
            this.toastService.success('Данные успешно сохранены!')
            this.closeModal()
          }, error: () => {
            this.toastService.error('Не удалось сохранить данные!')
          }
        })
    } else {
      this.serviceCategoryService.addServiceCategory(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getServicesCategories.emit()
            this.toastService.success('Данные успешно сохранены!')
            this.closeModal()
          }, error: () => {
            this.toastService.error('Не удалось сохранить данные!')
          }
        })
    }
  }

  closeModal() {
    this.close.emit(false)
  }
}
