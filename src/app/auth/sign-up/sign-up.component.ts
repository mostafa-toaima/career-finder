import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  fb = inject(FormBuilder);
  // afAuth = inject(AngularFireAuth);
  router = inject(Router);

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

  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      try {
        // await this.afAuth.createUserWithEmailAndPassword(email, password);
        alert('Registration successful!');
        this.router.navigate(['/login']);
      } catch (error: any) {
        alert(error.message);
      }
    }
  }
}
