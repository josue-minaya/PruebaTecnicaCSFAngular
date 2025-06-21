import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';
import { Login } from '../../../Models/login.interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    Username: ['', [Validators.required]],
    Password: ['', [Validators.required, Validators.minLength(3)]],
  });
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigateByUrl('aa/RegistrarCompras');
    }
  }

  Ingresar() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }
    const logi = this.loginForm.value as Login;

    this.authService.login(logi).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/Dashboard/RegistrarVentas');
        return;
      }

      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    });
  }
}
