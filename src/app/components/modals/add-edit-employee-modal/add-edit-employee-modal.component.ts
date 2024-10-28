import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../services/toast.service';
import {EmployeeService} from '../../../services/employee.service';

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
export class AddEditEmployeeModalComponent implements OnInit {

  @Input() edit: boolean = false
  @Input() employee: any
  @Output() close = new EventEmitter<any>();
  @Output() getEmployees: EventEmitter<any> = new EventEmitter<any>()

  addEmployeeFormGroup = new FormGroup({
    id: new FormControl(null),
    fullName: new FormControl(null, [Validators.required]),
    position: new FormControl(null, [Validators.required]),
    roomNumber: new FormControl(null, [Validators.required]),
    available: new FormControl(false, [Validators.required]),
    willBeAvailable: new FormControl(null, [Validators.required]),
    details: new FormControl(null, [Validators.required]),
  })

  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    if (this.edit) {
      this.addEmployeeFormGroup.setValue({
        id: this.employee.id,
        fullName: this.employee.fullName,
        available: this.employee.available,
        details: this.employee.details,
        position: this.employee.position,
        roomNumber: this.employee.roomNumber,
        willBeAvailable: this.employee.willBeAvailable
      })
    }
  }

  addEditEmployee() {
    const body = this.addEmployeeFormGroup.value
    this.employeeService.addEmployee(body)
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

  closeModal() {
    this.close.emit(false)
  }

}
