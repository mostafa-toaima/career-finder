import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, map, catchError, of } from "rxjs";
import { CarerService } from "../../components/carer-path/services/carer.service";

// track.guard.ts
@Injectable({
  providedIn: 'root'
})
export class TrackGuard implements CanActivate {
  constructor(private careerService: CarerService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const trackId = route.paramMap.get('trackId');
    if (!trackId) {
      this.router.navigate(['/career-path']);
      return of(false);
    }
    return this.careerService.getTrack(trackId).pipe(
      map(track => {
        if (track) {
          return true;
        } else {
          this.router.navigate(['/career-path']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/career-path']);
        return of(false);
      })
    );
  }
}
