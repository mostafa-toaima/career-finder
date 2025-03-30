import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'login',
    imports: [CommonModule, ReactiveFormsModule, DialogModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [MessageService]
})
export class LoginComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>()
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  router = inject(Router);
  loginError: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        if (email == "mtoaima@bis.com" && password == "123456") {
          this.router.navigate(['/features']);
          this.closeDialog();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful!' });
        } else {
          this.loginForm.reset();
          this.loginError = 'Invalid email or password.';
        }

      } catch (error: any) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
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
