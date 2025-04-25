import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from '../../../components/auth/components/sign-up/sign-up.component';
import { LoginComponent } from '../../../components/auth/components/login/login.component';
import { AuthService } from '../../../components/auth/services/auth.service';
import { UniversityService } from '../../../components/university/services/university.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterLink, SignUpComponent, LoginComponent, RouterLinkActive],
  standalone: true,
})
export class NavbarComponent {
  mobileMenuOpen = false;
  showUserDropdown = false;
  showLogin = false;
  showSignUp = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private universityService = inject(UniversityService);

  user$: Observable<User | null> = this.authService.user$;


  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.toggleBodyOverflow();
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.toggleBodyOverflow();
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  openLogin() {
    this.showLogin = true;
    this.closeMobileMenu();
  }

  openSignUp() {
    this.showSignUp = true;
    this.closeMobileMenu();
  }

  handleNavigationClick(route: string) {
    this.user$.subscribe(user => {
      if (user) {
        this.router.navigate([route]);
      } else {
        this.openLogin();
      }
    });
  }

  useFallback(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }


  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']);
      this.showUserDropdown = false;
    });
  }

  private toggleBodyOverflow() {
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > 991.98 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }


  toggleToSignup() {
    this.showSignUp = !this.showSignUp;
    this.showLogin = false;
  }

  toggleToLogin() {
    this.showLogin = !this.showLogin;
    this.showSignUp = false;
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }


}
