import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomersService} from '../../../services/customers.service';
import {ToastService} from '../../../services/toast.service';

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
export class AddCustomerModalComponent {

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

  addCustomer() {
    const customer = this.addCustomerFormGroup.value
    this.customerService.addCustomer(customer)
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Данные пользователя сохранены!')
          this.closeModal()
          this.getCustomers.emit()
        }, error: (err: any) => {
          this.toastService.error('Не удалось созранить данные пользователя!')
        }
      })
  }

  closeModal() {
    this.close.emit(false)
  }
}
