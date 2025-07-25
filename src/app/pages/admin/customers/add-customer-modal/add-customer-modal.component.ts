import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomersService} from '../../../../services/customers.service';
import {ToastService} from '../../../../services/toast.service';
import {Subject, takeUntil} from 'rxjs';
import {openCloseAnimation} from '../../../../animations/openClose.animation';

@Component({
  selector: 'app-add-customer-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-customer-modal.component.html',
  styleUrl: './add-customer-modal.component.css',
  animations: [
    openCloseAnimation
  ]
})
export class AddCustomerModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() edit?: boolean
  @Input() customer: any
  @Output() close = new EventEmitter<any>();
  @Output() getCustomers: EventEmitter<any> = new EventEmitter<any>()

  addCustomerFormGroup = new FormGroup({
    surname: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    lastname: new FormControl(null),
    email: new FormControl(null),
    phoneNumber: new FormControl(null, [Validators.required]),
    docNumber: new FormControl(null),
    birhday: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    street: new FormControl(null),
    homeNumber: new FormControl(),
    details: new FormControl(),
  })

  constructor(
    private customerService: CustomersService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    if (this.edit) {
      console.log(this.customer)
      this.addCustomerFormGroup.patchValue(this.customer)
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEditCustomer() {
    const body = this.addCustomerFormGroup.value
    if (this.edit) {
      this.customerService.editCustomer(this.customer.id, body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getCustomers.emit()
            this.toastService.success('Данные клиента сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные клиента!')
          }
        })
    } else {
      this.customerService.addCustomer(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getCustomers.emit()
            this.toastService.success('Данные клиента сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные клиента!')
          }
        })
    }
  }

  closeModal() {
    this.close.emit(false)
  }

  protected readonly console = console;
}
