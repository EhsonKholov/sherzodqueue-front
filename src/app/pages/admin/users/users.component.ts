import {Component, OnInit, signal} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AddEditUserModalComponent} from '../../../components/modals/add-edit-user-modal/add-edit-user-modal.component';
import {UserService} from '../../../services/users.service';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../../services/toast.service';
import {RolesService} from '../../../services/roles.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    DialogModule,
    PaginationComponent,
    ReactiveFormsModule,
    AddEditUserModalComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private destroy$ = new Subject<void>()

  addEditModalShow = signal<boolean>(false);
  page_num: number = 1;
  page_size: number = 10;
  users = signal<any[]>([]);
  totalElements: any = 0;
  total_pages: any = 0;
  user = signal<any>(null);

  deleteModalShow = signal<boolean>(false);


  filter = new FormGroup({
    userName: new FormControl(),
    phoneNumber: new FormControl<any>(null),
    includeDependencies: new FormControl<any>(true),
  });


  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private rolesService: RolesService
  ) {
  }


  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    let body = {
      page: this.page_num,
      pageSize: this.page_size,
      filters: this.filter.value
    }
    this.userService.getUsers(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.users.set(res?.items)
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

  onPageChange(event: { page_number: number; page_size: number }): void {
    this.page_num = event.page_number
    this.page_size = event.page_size
    this.getUsers()
  }

  closeAddEditModal(event: any) {
    this.addEditModalShow.set(event)
  }

  editUser(item: any) {
    this.addEditModalShow.set(true)
    this.user.set(item)
  }

  addEmployee() {
    this.addEditModalShow.set(true)
    this.user.set(null)
  }

}
