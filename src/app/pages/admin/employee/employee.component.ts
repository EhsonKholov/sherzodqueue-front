import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {EmployeeService} from '../../../services/employee.service';
import {AddCustomerModalComponent} from '../../../components/modals/add-customer-modal/add-customer-modal.component';
import {DatePipe} from '@angular/common';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {
  AddEditEmployeeModalComponent
} from '../../../components/modals/add-edit-employee-modal/add-edit-employee-modal.component';
import {slideLeftMargin} from '../../../animations/slide-left-margin.animation';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    AddCustomerModalComponent,
    DatePipe,
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
    AddEditEmployeeModalComponent
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  animations: [slideLeftMargin]
})
export class EmployeeComponent implements OnInit {

  employees: WritableSignal<any[]> = signal([])
  show_filter: WritableSignal<boolean> = signal(true)
  page_num: number = 1
  page_size: number = 10
  total_pages: number = 0
  totalElements: number = 0
  addEmployeeModalShow: WritableSignal<boolean> = signal(false)
  deleteEmployeeModalShow: WritableSignal<boolean> = signal(false)
  isEmplEdit = false
  employee: any

  filter = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    query: new FormControl<string | null>(null),
  })

  constructor(private employeeService: EmployeeService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getEmployees()
  }

  getEmployees() {
    this.employeeService.getEmployees(this.filter.controls['query'].value, this.page_num, this.page_size)
      .subscribe({
        next: (res: any) => {
          this.employees.set(res?.data?.items)
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
    this.getEmployees()
  }

  closeAddEmployeeModal(event: any) {
    this.addEmployeeModalShow.set(event)
  }

  editCustomer(item: any) {
    this.addEmployeeModalShow.set(true)
    this.isEmplEdit = true
    this.employee = item
  }

  addCustomer() {
    this.addEmployeeModalShow.set(true)
    this.employee = null
    this.isEmplEdit = false
  }

  deleteEmployeeInit(item: any) {
    this.employee = item
    this.deleteEmployeeModalShow.set(true)
  }

  deleteEmployee() {
    this.employeeService.deleteEmployee(this.employee.id)
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Сотрудник удален!')
          this.deleteEmployeeModalShow.set(false)
          this.getEmployees()
        }, error: (error: any) => {
          this.toastService.success('Ошибка удаления сотрудника!')
        }
      })
  }

}
