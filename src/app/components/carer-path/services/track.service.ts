import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Track, TrackProgress } from '../interfaces/Track';
import { Roadmap } from '../components/roadmap/models/pathModel';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private authService = inject(AuthService)
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

  getTrackWithProgress(trackId: string, userId: string): Observable<{ track: any, progress: any }> {
    return combineLatest([
      this.getTrack(trackId),
      this.authService.getUserProgress(userId)
    ]).pipe(
      map(([track, userProgress]) => {
        const trackProgress = userProgress.trackProgress[trackId] || {
          completed: 0,
          total: track.pathCards.reduce((sum: any, card: any) => sum + (card.progress?.total || 0), 0)
        };
        return { track, progress: trackProgress };
      })
    );
  }

  getRoadmapWithProgress(roadmapId: string, userId: string): Observable<{ roadmap: Roadmap, progress: any }> {
    return combineLatest([
      this.getRoadmapById(roadmapId),
      this.authService.getUserProgress(userId)
    ]).pipe(
      map(([roadmap, userProgress]) => {
        const roadmapProgress = userProgress.roadmapProgress?.[roadmapId as keyof typeof userProgress.roadmapProgress] || {
          completedSteps: [],
          inProgressSteps: []
        };
        return { roadmap, progress: roadmapProgress };
      })
    );
  }

  // getRoadmapsByTrackId(trackId: string): Observable<any[]> {
  //   const ref = collection(this.firestore, 'roadmaps');
  //   const queryRef = query(ref, where('trackId', '==', trackId));
  //   return collectionData(queryRef, { idField: 'id' });
}

