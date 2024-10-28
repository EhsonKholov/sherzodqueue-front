import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomersService} from '../../../services/customers.service';
import {DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule
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

  filter = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    query: new FormControl<string | null>(null),
  })


  constructor(private customerService: CustomersService) {
  }

  ngOnInit(): void {
    this.getCustomers()
  }

  getCustomers() {
    this.customerService.getCustomers(this.filter.controls['query'].value, this.page_num, this.page_size)
      .subscribe({
        next: (res: any) => {
          console.log(res)
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

}
