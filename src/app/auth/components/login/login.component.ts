import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  @Input() visible: boolean = false;
  @Input() registerSuccess: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>()
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService)
  loginError: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (res) => {
          console.log('Login successful', this.loginForm.value, res);
          this.router.navigate(['/features']);
          this.closeDialog();
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loginError = error?.message || 'Invalid email or password.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  showDialog() {
    this.visible = true;

  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.loginError = '';
  }

  get emailError() {
    const control = this.loginForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'Email is required.';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Invalid email address.';
    }
    return '';
  }
  get passwordError() {
    const control = this.loginForm.get('password');
    if (control?.hasError('required') && control?.touched) {
      return 'Password is required.';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Password must be at least 6 characters long.';
    }
    return '';
  }

}
