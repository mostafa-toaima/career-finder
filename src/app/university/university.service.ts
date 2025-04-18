import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private selectedUniversitySubject = new BehaviorSubject<any>(null);
  selectedUniversity$ = this.selectedUniversitySubject.asObservable();

  setUniversity(university: any) {
    this.selectedUniversitySubject.next(university);
  }

  getUniversity(): Observable<any> {
    return this.selectedUniversity$;
  }
}
