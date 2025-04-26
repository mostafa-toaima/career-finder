import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../components/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return this.authService.isAdmin$.pipe(
      take(1),
      map(isAdmin => {
        if (isAdmin) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      })
    );
  }
}
