import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomersService} from '../../../services/customers.service';
import {DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';
import {AddCustomerModalComponent} from '../../../components/modals/add-customer-modal/add-customer-modal.component';
import {ToastService} from '../../../services/toast.service';
import {Subject, takeUntil} from 'rxjs';
import {DialogModule} from 'primeng/dialog';
import {SecondsToDatePipe} from '../../../pipes/seconds-to-date.pipe';
import {FloatLabelModule} from 'primeng/floatlabel';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
    AddCustomerModalComponent,
    DialogModule,
    SecondsToDatePipe,
    FloatLabelModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  animations: [slideLeftMargin],
})
export class CustomersComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  customers: WritableSignal<any[]> = signal([])
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  addCustomerModalShow: WritableSignal<boolean> = signal(false)
  deleteCustomerModalShow: WritableSignal<boolean> = signal(false)
  isCustEdit = false
  customer: any = {}

  filter: any

  additionalInformationModalShow = signal<boolean>(false);

  constructor(
    private customerService: CustomersService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
  ) {
  }


  ngOnInit(): void {
    this.filter = this.formBuilder.group({
      name: null,
      surname: null,
      lastname: null,
      phoneNumber: null,
    })

    this.getCustomers()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCustomers() {
    let body = {
      page: this.page_num,
      pageSize: this.page_size,
      filters: this.filter.value
    }
    this.customerService.getCustomers(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.customers.set(res?.items)
          this.page_num = res?.page
          this.page_size = res?.pageSize
          this.totalElements = res?.totalCount
          this.total_pages = (this.totalElements / this.page_size) + (this.totalElements % this.page_size > 0 ? 1 : 0)
        }, error: (error: any) => {
          if (error.status != 401) return
          this.toastService.error('Ошибка получения данных!')
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
    this.isCustEdit = false
  }

  deleteCustomerInit(item: any) {
    this.customer = item
    this.deleteCustomerModalShow.set(true)
  }

  deleteCustomer() {
    this.customerService.deleteCustomer(this.customer.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Клиент удален!')
          this.deleteCustomerModalShow.set(false)
          this.getCustomers()
        }, error: (error: any) => {
          this.toastService.success('Ошибка удаления клиента!')
        }
      })
  }

  detailCustomer(item: any) {
    this.customer = item
    this.additionalInformationModalShow.set(true)
  }
}
