import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class AddCustomerModalComponent implements OnInit {

  @Input() edit: boolean = false
  @Input() customer: any
  @Output() close = new EventEmitter<any>();
  @Output() getCustomers: EventEmitter<any> = new EventEmitter<any>()

  addCustomerFormGroup = new FormGroup({
    id: new FormControl(null),
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
        id: this.customer.id,
        address: this.customer.address,
        docNumber: this.customer.docNumber,
        fullName: this.customer.fullName,
        phoneNumber: this.customer.phoneNumber,
      })
    }
  }

  addEditCustomer() {
    const body = this.addCustomerFormGroup.value
    this.customerService.addCustomer(body)
      .subscribe({
        next: (res: any) => {
          this.getCustomers.emit()
          this.toastService.success('Данные пользователя сохранены!')
          this.closeModal()
        }, error: (err: any) => {
          this.toastService.error('Не удалось созранить данные пользователя!')
        }
      })
  }

  closeModal() {
    this.close.emit(false)
  }
}
