import {Component, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

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
    login: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
  })

  constructor(private authService: AuthService) {}

  login() {
  }
}
