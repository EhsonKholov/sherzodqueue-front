import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../services/toast.service';
import {ServicesService} from '../../../services/services.service';

@Component({
  selector: 'app-add-edit-service-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-service-modal.component.html',
  styleUrl: './add-edit-service-modal.component.css'
})
export class AddEditServiceModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() edit: boolean = false
  @Input() service: any
  @Output() close = new EventEmitter<any>();
  @Output() getServices: EventEmitter<any> = new EventEmitter<any>()

  addServiceFormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', [Validators.required]),
    duration: new FormControl(null, [Validators.required]),
    price: new FormControl(0, [Validators.required]),
  })

  constructor(
    private servicesService: ServicesService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    if (this.edit) {
      this.addServiceFormGroup.setValue({
        id: this.service.id,
        name: this.service.name,
        duration: this.service.duration,
        price: this.service.price,
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  addEditCustomer() {
    let body: any = this.addServiceFormGroup.value
    body.duration = this.convertTimeToMinut(body?.duration)
    if (this.edit) {
      this.servicesService.editService(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getServices.emit()
            this.toastService.success('Данные успешно сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные!')
          }
        })
    } else {
      this.servicesService.addService(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getServices.emit()
            this.toastService.success('Данные успешно сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные!')
          }
        })
    }
  }

  convertTimeToMinut(time: string) { //'04:00:00' -> 4
    return time.split (':').reduce (function (seconds, v) {
      return +v + seconds * 60;
    }, 0) / 60;
  }

  closeModal() {
    this.close.emit(false)
  }
}
