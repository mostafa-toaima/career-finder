import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'sign-up',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  providers: [MessageService] // Add MessageService here
})
export class SignUpComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() requestToLogin = new EventEmitter<boolean>()
  @Output() registerSuccess = new EventEmitter<boolean>()
  messageService = inject(MessageService);
  authService = inject(AuthService)
  fb = inject(FormBuilder);
  router = inject(Router);

  universities = [
    {
      name: 'Tanta',
      faculties: ['Engineering', 'Science', 'Business'],
      departments: {
        'Business': ['BIS', 'English', 'Arabic'],
        'Engineering': ['Computer Science', 'Civil'],
        'Science': ['Physics', 'Chemistry']
      }
    },
    { name: 'Mansoura', faculties: ['Engineering', 'Arts', 'Law'], departments: { 'Engineering': ['Software', 'Mechanical'], 'Arts': ['History', 'Philosophy'], 'Law': ['Criminal', 'Civil'] } },
    { name: 'Menoufia', faculties: ['Engineering', 'Agriculture'], departments: { 'Engineering': ['Electrical', 'Chemical'], 'Agriculture': ['Plant Science', 'Animal Science'] } }
  ];

  selectedUniversity: string = '';
  selectedFaculty: string = '';
  filteredFaculties: string[] = [];
  filteredDepartments: string[] = [];
  registerError: string = '';
  isSubmitting: boolean = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    university: ['', Validators.required],
    faculty: ['', Validators.required],
    department: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    gender: ['', Validators.required]
  });

  onUniversityChange() {
    const selectedUniversity = this.registerForm.get('university')?.value;
    const university = this.universities.find(u => u.name === selectedUniversity);
    if (university) {
      this.filteredFaculties = university.faculties;
      this.filteredDepartments = [];
      this.registerForm.get('faculty')?.reset();
      this.registerForm.get('department')?.reset();
      this.selectedUniversity = selectedUniversity;
    }
  }

  onFacultyChange() {
    const selectedFaculty = this.registerForm.get('faculty')?.value;
    const university: any = this.universities.find(u => u.name === this.selectedUniversity);
    if (university && university.departments[selectedFaculty]) {
      this.filteredDepartments = university.departments[selectedFaculty];
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const { firstName, email, password, mobile } = this.registerForm.value;
      const data = {
        name: firstName,
        email,
        password,
        mobile,
      }
      this.authService.register(data.email, data.password).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.registerSuccess.emit(true);
          this.registerError = '';
          this.closeDialog();
          this.router.navigate(['/features']);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error?.code === 'auth/email-already-in-use') {
            this.registerError = 'This email is already in use. Please try logging in or use a different email.';
          } else {
            this.registerError = 'An error occurred. Please try again later.';
          }
        }


      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  switchToLogin() {
    this.requestToLogin.emit();
    this.closeDialog();
  }






  // Custom error messages
  get firstNameError() {
    const control = this.registerForm.get('firstName');
    if (control?.hasError('required') && control?.touched) {
      return 'First Name is required.';
    }
    return '';
  }

  get lastNameError() {
    const control = this.registerForm.get('lastName');
    if (control?.hasError('required') && control?.touched) {
      return 'Last Name is required.';
    }
    return '';
  }

  get emailError() {
    const control = this.registerForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'Email is required.';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Invalid email address.';
    }
    return '';
  }

  get mobileError() {
    const control = this.registerForm.get('mobile');
    if (control?.hasError('required') && control?.touched) {
      return 'Mobile number is required.';
    }
    if (control?.hasError('pattern') && control?.touched) {
      return 'Mobile number must be between 10 to 15 digits.';
    }
    return '';
  }

  get passwordError() {
    const control = this.registerForm.get('password');
    if (control?.hasError('required') && control?.touched) {
      return 'Password is required.';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Password must be at least 6 characters long.';
    }
    return '';
  }

  get genderError() {
    const control = this.registerForm.get('gender');
    if (control?.hasError('required') && control?.touched) {
      return 'Gender selection is required.';
    }
    return '';
  }
}
