import {Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {UserService} from '../../../../services/users.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MultiSelectModule} from 'primeng/multiselect';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {PaginatorModule} from 'primeng/paginator';
import {RolesService} from '../../../../services/roles.service';
import {Subject, takeUntil} from 'rxjs';
import {EmployeeService} from '../../../../services/employee.service';
import {ToastService} from '../../../../services/toast.service';
import {openCloseAnimation} from '../../../../animations/openClose.animation';

@Component({
  selector: 'app-add-edit-user-modal',
  standalone: true,
  imports: [
    AutoCompleteModule,
    MultiSelectModule,
    NgMultiSelectDropDownModule,
    PaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-edit-user-modal.component.html',
  styleUrl: './add-edit-user-modal.component.css',
  animations: [openCloseAnimation]
})
export class AddEditUserModalComponent implements OnInit {

  private destroy$ = new Subject<void>()

  @Input() user!: WritableSignal<any>;
  @Output() getUsers = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  roles = signal<any>([]);

  addEditUserFormGroup: any

  employees: WritableSignal<any[]> = signal([])

  togglePassword = signal<boolean>(false);

  constructor(
    private usersService: UserService,
    private fb: FormBuilder,
    private rolesService: RolesService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {
  }


  /*
  {
    "userName": "string",
    "email": "string",
    "employeeId": 0,
    "password": "string",
    "role": "string"
  }
  */



  ngOnInit() {
    this.getRoles()
    this.getEmployees()

    if (this.user() == null) {
      this.addEditUserFormGroup = this.fb.group({
        id: null,
        userName: [null, Validators.required],
        email: [null, Validators.required],
        employeeId: [null, Validators.required],
        password: [null],
        role: [null, Validators.required]
      });
    } else {
      this.addEditUserFormGroup = this.fb.group({
        id: this.user().id,
        userName: [this.user().userName, Validators.required],
        email: [this.user().email, Validators.required],
        employeeId: [this.user().employee, Validators.required],
        password: [this.user().password],
        role: [this.user().role, Validators.required]
      });
    }
  }

  getRoles() {
    this.rolesService.getRoles()
      .subscribe({
        next: (res: any) => {
          this.roles.set(res)
        }
      })
  }

  getEmployees() {
    let body = {
      enabled: true
    }
    this.employeeService.getEmployeesList(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          let items = res?.items
          for(let e of items) {
            e.fullname = e?.surname + ' ' + e?.name
          }
          this.employees.set(items)
        }
      })
  }

  closeModal() {
    this.close.emit();
  }

  addEditUser() {
    let user = this.addEditUserFormGroup.value
    user.employeeId = user?.employeeId?.id

    if (this.user == null) {
      this.usersService.addUser(user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.toastService.success('Пользователь успешно создан!')
            this.getUsers.emit()
            this.closeModal()
          },
          error: (err: any) => {
            this.toastService.error('Не удалось создать пользователя!')
          }
        })
    } else {
      this.usersService.editUser(user?.id, user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.toastService.success('Данные пользователя успешно изменено!')
            this.getUsers.emit()
            this.closeModal()
          },
          error: (err: any) => {
            this.toastService.error('Не удалось сохранить изменения!')
          }
        })
    }

  }

}
