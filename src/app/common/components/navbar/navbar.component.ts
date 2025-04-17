import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from '../../../auth/components/sign-up/sign-up.component';
import { LoginComponent } from '../../../auth/components/login/login.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SignUpComponent, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  //   visibleSignUp = false;
  //   visibleLogin = false;
  //   authService = inject(AuthService);
  //   user$: Observable<User | null>;
  //   currentRoute: string = '';

  //   isLoggedIn: boolean = false;
  //   isAdmin: boolean = false;
  //   isUser: boolean = false;
  //   registerSuccess = false;

  //   constructor(private router: Router) {
  //     this.user$ = this.authService.user$;
  //     this.router.events.subscribe(() => {
  //       this.currentRoute = this.router.url;
  //     });

  //     localStorage.getItem('token') ? this.isLoggedIn = true : this.isLoggedIn = false;
  //   }

  //   logout() {
  //     this.authService.logout().subscribe(() => {
  //       localStorage.removeItem('token');
  //       this.router.navigate(['']);
  //     });
  //   }
  visibleSignUp = false;
  visibleLogin = false;
  authService = inject(AuthService);
  user$: Observable<User | null>;
  currentRoute: string = '';

  constructor(private router: Router) {
    this.user$ = this.authService.user$;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
