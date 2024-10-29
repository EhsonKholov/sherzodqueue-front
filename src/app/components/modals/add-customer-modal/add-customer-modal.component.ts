import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomersService} from '../../../services/customers.service';
import {ToastService} from '../../../services/toast.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-add-customer-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-customer-modal.component.html',
  styleUrl: './add-customer-modal.component.css'
})
export class AddCustomerModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() edit: boolean = false
  @Input() customer: any
  @Output() close = new EventEmitter<any>();
  @Output() getCustomers: EventEmitter<any> = new EventEmitter<any>()

  addCustomerFormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.required]),
    docNumber: new FormControl('', [Validators.required]),
  })

  constructor(
    private customerService: CustomersService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    if (this.edit) {
      this.addCustomerFormGroup.setValue({
        address: this.customer.address,
        docNumber: this.customer.docNumber,
        fullName: this.customer.fullName,
        phoneNumber: this.customer.phoneNumber,
      })
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
}
