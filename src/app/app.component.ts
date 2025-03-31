import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthService } from './auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SignUpComponent, LoginComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'career-path-project';
  visibleSignUp = false;
  visibleLogin = false;
  authService = inject(AuthService);
  user$: Observable<User | null>;

  constructor(private router: Router) {
    this.user$ = this.authService.user$; // Subscribe to auth state
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']); // Redirect to home after logout
    });
  }
}
