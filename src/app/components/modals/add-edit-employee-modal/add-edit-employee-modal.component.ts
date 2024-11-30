import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {EmployeeService} from '../../../services/employee.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-add-edit-employee-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit-employee-modal.component.html',
  styleUrl: './add-edit-employee-modal.component.css'
})
export class AddEditEmployeeModalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>()
  @Input() employee: any
  @Output() close = new EventEmitter<any>();
  @Output() getEmployees: EventEmitter<any> = new EventEmitter<any>()

  addEmployeeFormGroup: any

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    console.log(this.employee)
    if (this.employee == null) {
      this.addEmployeeFormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required]),
        surname: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null),
        phoneNumber: new FormControl(null, [Validators.required]),
        address: new FormControl(null, [Validators.required]),
        docNo: new FormControl(null, [Validators.required]),
        taxId: new FormControl(null, [Validators.required]),
        position: new FormControl(null, [Validators.required]),
        interestRate: new FormControl(0, [Validators.required]),
        enabled: new FormControl(true),
        available: new FormControl(true),
        willBeAvailable: new FormControl(null, [Validators.required]),
        details: new FormControl(null, [Validators.required]),
      })
    } else {
      this.addEmployeeFormGroup = new FormGroup({
        id: new FormControl(this.employee.id, [Validators.required]),
        name: new FormControl(this.employee.name, [Validators.required]),
        surname: new FormControl(this.employee.surname, [Validators.required]),
        lastname: new FormControl(this.employee.lastname),
        phoneNumber: new FormControl(this.employee.phoneNumber, [Validators.required]),
        address: new FormControl(this.employee.address, [Validators.required]),
        docNo: new FormControl(this.employee.docNo, [Validators.required]),
        taxId: new FormControl(this.employee.taxId, [Validators.required]),
        position: new FormControl(this.employee.position, [Validators.required]),
        interestRate: new FormControl(this.employee.interestRate, [Validators.required]),
        enabled: new FormControl(this.employee.enabled),
        available: new FormControl(this.employee.available),
        willBeAvailable: new FormControl(this.employee.willBeAvailable, [Validators.required]),
        details: new FormControl(this.employee.details, [Validators.required]),
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEditEmployee() {
    const body = this.addEmployeeFormGroup.value
    if (!!this.employee) {
      this.employeeService.editEmployee(this.employee.id, body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getEmployees.emit()
            this.toastService.success('Данные сотрудника сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные сотрудника!')
          }
        })
    } else {
      this.employeeService.addEmployee(body)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.getEmployees.emit()
            this.toastService.success('Данные сотрудника сохранены!')
            this.closeModal()
          }, error: (err: any) => {
            this.toastService.error('Не удалось сохранить данные сотрудника!')
          }
        })
    }
  }

  closeModal() {
    this.close.emit(false)
  }

}
