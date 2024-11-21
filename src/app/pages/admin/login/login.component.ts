import {Component, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ToastService} from '../../../services/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  togglePassword: WritableSignal<boolean> = signal(false)
  loginFormGroup: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
  })

  loading = false

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
  }

  login() {
    this.loading = true
    this.authService.login(this.loginFormGroup.value)
      .subscribe({
        next: (res: any) => {
          this.loading = false
          localStorage.setItem('accessToken', res.accessToken)
          localStorage.setItem('refreshToken', res.refreshToken)
          localStorage.setItem('employee', JSON.stringify(res.employee));
          this.router.navigate(['/admin'])
          return true
        }, error: (error: any) => {
          this.loading = false
          this.toastService.error("Неправильный логин или пароль!")
        }
      })
  }
}
