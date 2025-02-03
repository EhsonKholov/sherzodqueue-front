import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileService} from '../../../services/profile.service';
import {AuthService} from '../../../services/auth.service';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../../services/toast.service';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    DatePipe,
    DialogModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  infoNavTabs = true
  twoFactorAuth = false
  modalChangePassword = false
  employee: any = null
  passwordShow = false
  passwordShow2 = false
  passwordShow3 = false

  passwordPattern = new RegExp(/[a-zA-Z0-9!@#&.+-]/)

  additionalInformationModalShow = signal(false)

  passChangeFormGroup = new FormGroup({
    oldPassword: new FormControl(null, [Validators.required, Validators.pattern(this.passwordPattern)]),
    newPassword: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(25), Validators.pattern(this.passwordPattern)]),
    confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(25), Validators.pattern(this.passwordPattern)]),
  })


  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private toastService: ToastService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.employee = this.auth.getEmployee()
  }


  infoTabItemClick() {
    this.infoNavTabs = true
  }

  securTabItemClick() {
    this.infoNavTabs = false
  }

  twoFactorAuthFn() {
    this.toastService.warning('В разработке')
    setTimeout(() => {
      this.twoFactorAuth = false
    }, 1000)
  }

  passChange() {
    let passChange = {
      userId: this.employee?.id,
      currentPassword: this.passChangeFormGroup?.controls.oldPassword?.value,
      newPassword: this.passChangeFormGroup?.controls.newPassword?.value,
    }
    this.profileService.changePassword(passChange)
      .subscribe({
        next: (res: any) => {
          this.toastService.success('Пароль успешно изменён!')
          this.authService.logout()
        },
        error: (err: any) => {
          this.toastService.error('Неизвестная ошибка!')
        }
      })
  }

  changePasswordInit() {
    this.modalChangePassword = true
    this.passwordShow = false
    this.passwordShow2 = false
    this.passwordShow3 = false
    this.passChangeFormGroup.reset()
  }

  isValidPassword(password: any) {
    return this.passwordPattern.test(password)
  }

  showEmployeeDataModal() {
    this.additionalInformationModalShow.set(true)
  }

}
