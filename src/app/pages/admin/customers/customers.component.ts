import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomersService} from '../../../services/customers.service';
import {DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';
import {AddCustomerModalComponent} from '../../../components/modals/add-customer-modal/add-customer-modal.component';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
    AddCustomerModalComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  animations: [slideLeftMargin],
})
export class CustomersComponent implements OnInit {

  customers: WritableSignal<any[]> = signal([])
  show_filter: WritableSignal<boolean> = signal(true)
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  addCustomerModalShow: WritableSignal<boolean> = signal(false)
  deleteCustomerModalShow: WritableSignal<boolean> = signal(false)
  isCustEdit = false
  customer: any

  filter = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    query: new FormControl<string | null>(null),
  })

  constructor(private customerService: CustomersService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getCustomers()
  }

  getCustomers() {
    this.customerService.getCustomers(this.filter.controls['query'].value, this.page_num, this.page_size)
      .subscribe({
        next: (res: any) => {
          this.customers.set(res?.data?.items)
          this.page_num = res?.data?.page
          this.page_size = res?.data?.size
          this.totalElements = res?.data?.totalCount
          this.total_pages = res?.data?.totalPages
        }
      })
  }

  clearFilter() {
    this.filter.reset()
  }

  onPageChange(event: { page_number: number; page_size: number }): void {
    this.page_num = event.page_number
    this.page_size = event.page_size
    this.getCustomers()
  }

  closeAddCustomerModal(event: any) {
    this.addCustomerModalShow.set(event)
  }

  editCustomer(item: any) {
    this.addCustomerModalShow.set(true)
    this.isCustEdit = true
    this.customer = item
  }

  addCustomer() {
    this.addCustomerModalShow.set(true)
    this.customer = null
  }

  deleteCustomerInit(item: any) {
    this.customer = item
    this.deleteCustomerModalShow.set(true)
  }

  deleteCustomer() {
    this.customerService.deleteCustomer(this.customer.id)
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Клиент удален!')
        }, error: (error: any) => {
          this.toastService.success('Ошибка удаления клиента!')
        }
      })
  }
}
