import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  @Input() visible: boolean = false;
  @Input() registerSuccess: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() requestSignUp = new EventEmitter<boolean>()
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService)
  loginError: string = '';
  isSubmitting: boolean = false;
  showSignUp: boolean = false;
  disblayResetSection: boolean = false;
  confimedResetSection: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (res) => {
          console.log('Login successful', this.loginForm.value, res);
          this.isSubmitting = false;
          this.router.navigate(['/features']);
          this.closeDialog();
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isSubmitting = false;
          this.loginForm.reset();
          this.loginError = error?.message || 'Invalid email or password.';
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onGoogleLogin() {
    this.isSubmitting = true;
    this.authService.loginWithGoogle().subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
        this.router.navigate(['/features']);
        this.closeDialog();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: error?.message || 'Invalid email or password.' });
        this.loginForm.reset();
        console.error('Login error:', error);
        this.loginError = error?.message || 'Invalid email or password.';
      }
    });
  }

  resetPassword(form: FormGroup) {
    const email = form.controls["email"];
    if (email.valid && email.value !== "") {
      this.isSubmitting = true;
      this.loginError = '';

      this.authService.resetPassword(email.value).subscribe({
        next: (res) => {
          this.confimedResetSection = true;
          this.disblayResetSection = false;
          this.isSubmitting = false;
        },
        error: (error) => {
          this.disblayResetSection = true;
          this.confimedResetSection = false;
          this.isSubmitting = false;
          this.loginError = error?.message || 'Failed to send reset email. Please try again.';
        }
      });
    } else {
      this.loginError = "Please enter a valid email address";
      email.markAsTouched();
    }
  }

  showDialog() {
    this.visible = true;
    this.resetFormStates();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetFormStates();
  }

  private resetFormStates() {
    this.loginError = '';
    this.isSubmitting = false;
    this.disblayResetSection = false;
    this.confimedResetSection = false;
    this.loginForm.reset();
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

  switchToSignup() {
    this.closeDialog();
    this.requestSignUp.emit(true);
  }
}
