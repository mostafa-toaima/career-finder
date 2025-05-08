import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {


  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' }
  ];

  constructor(private firestore: Firestore) { }

  getTrack(trackId: string): Observable<any> {
    const trackRef = doc(this.firestore, 'tracksData', trackId);
    return docData(trackRef).pipe(
      map(data => {
        if (!data) {
          throw new Error('Track not found');
        }
        return data;
      }),
      catchError(error => {
        console.error('Error loading track:', error);
        return of(null);
      })
    );
  }

  getAllTracks(): Observable<any[]> {
    const ref = collection(this.firestore, 'tracksData');
    return collectionData(ref, { idField: 'id' });
  }


  getAllRoadmaps(): Observable<any[]> {
    const ref = collection(this.firestore, 'roadmaps');
    return collectionData(ref, { idField: 'id' });
  }

  getRoadmapById(id: string): Observable<any> {
    const ref = doc(this.firestore, `roadmaps/${id}`);
    return docData(ref, { idField: 'id' });
  }

  // getRoadmapsByTrackId(trackId: string): Observable<any[]> {
  //   const ref = collection(this.firestore, 'roadmaps');
  //   const queryRef = query(ref, where('trackId', '==', trackId));
  //   return collectionData(queryRef, { idField: 'id' });
}

