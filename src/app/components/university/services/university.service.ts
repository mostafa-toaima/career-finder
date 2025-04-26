import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private selectedUniversitySubject = new BehaviorSubject<any>(null);
  selectedUniversity$ = this.selectedUniversitySubject.asObservable();
  collectionName = "universities";
  constructor(private firestore: Firestore) { }

  setUniversity(university: any) {
    this.selectedUniversitySubject.next(university);
  }

  getUniversity(): Observable<any> {
    return this.selectedUniversity$;
  }

  getUniversities(): Observable<any[]> {
    const universitiesRef = collection(this.firestore, this.collectionName);
    return collectionData(universitiesRef, { idField: 'id' }).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  getFaculties(): Observable<any[]> {
    const ref = collection(this.firestore, 'faculties');
    return collectionData(ref, { idField: 'id' });
  }

  getDepartments(): Observable<any[]> {
    const ref = collection(this.firestore, 'departments');
    return collectionData(ref, { idField: 'id' });
  }

  getTracks(): Observable<any[]> {
    const ref = collection(this.firestore, 'careerTracks');
    return collectionData(ref, { idField: 'id' });
  }


}
