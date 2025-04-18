import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { SignUpComponent } from '../../auth/components/sign-up/sign-up.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { LoginComponent } from '../../auth/components/login/login.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  route = inject(Router);
  authService = inject(AuthService);
  user$: Observable<User | null> = this.authService.user$;
  showLogin = false;

  constructor(private viewportScroller: ViewportScroller) { }
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
  visible: boolean = false;

  // signUp() {
  //   this.visible = true;
  // }

  openLogin() {
    this.showLogin = true;
  }
  startedCareer() {
    this.user$.subscribe(user => {
      if (user) {
        this.route.navigate(['/build-career']);
      } else {
        this.openLogin();
      }
    });
  }

  exploreFeatures() {
    this.user$.subscribe(user => {
      if (user) {
        this.route.navigate(['/features']);
      } else {
        this.openLogin();
      }
    });
  }
}
