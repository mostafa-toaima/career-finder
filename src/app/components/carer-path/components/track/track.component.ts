import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TrackModalComponent } from '../track-modal/track-modal.component';
import { Track, TrackPathCard, TrackProgress } from '../../interfaces/Track';
import { TrackService } from '../../services/track.service';
import { UserProgress } from '../../../auth/interfaces/UserProgress';
import { AuthService } from '../../../auth/services/auth.service';
import { switchMap, take } from 'rxjs';


@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, RouterLink, TrackModalComponent],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit {
  isTrackModalVisible = false;
  trackData: Track = this.getDefaultTrackData();
  userProgress: UserProgress | null = null;

  constructor(
    private viewportScroller: ViewportScroller,
    private trackService: TrackService,
    private route: ActivatedRoute,
    private router: Router,
    private authServices: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserProgress();
    this.scrollToTop();
    this.subscribeToRouteParams();

  }


  private scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  private subscribeToRouteParams(): void {
    this.route.params.subscribe(params => {
      const trackId = params['trackId'] || 'frontend';
      this.loadTrackData(trackId);
    });
  }

  private loadUserProgress(): void {
    const user = this.authServices.getUserProfile();
    if (user) {
      this.authServices.getUserProgress(user.uid).subscribe(progress => {
        console.log("progress", progress);

        this.userProgress = progress;
      },
        error => {
          console.error('Error loading user progress:', error);
        });
    }
  }
  loadTrackData(trackId: string): void {
    const user = this.authServices.getUserProfile();
    if (!user) return;

    this.trackService.getTrackWithProgress(trackId, user.uid).subscribe({
      next: ({ track, progress }) => {
        this.trackData = this.normalizeTrackData(track);
        // Update progress based on user data
        this.trackData.progress = progress;
      },
      error: (error) => {
        console.error('Error loading track data:', error);
        this.trackData = this.getDefaultTrackData();
      }
    });
  }
  calculateProgressPercentage(progress?: TrackProgress): number {
    if (!progress) return 0;
    return Math.round((progress.current / progress.total) * 100);
  }

  calculateCardProgress(card: TrackPathCard): number {
    if (!card.progress) return 0;
    return this.calculateProgressPercentage(card.progress);
  }

  toggleTrackModal(visible: boolean): void {
    this.isTrackModalVisible = visible;
  }

  private normalizeTrackData(data: Partial<Track>): Track {
    console.log("datsa", data);

    return {
      title: data.title || 'Default Title',
      description: data.description || 'Default description',
      benefits: data.benefits || [],
      content: {
        sections: data.content?.sections || [{
          title: 'Introduction',
          content: 'No content available'
        }]
      },
      pathCards: (data.pathCards || []).map(card => ({
        ...card,
        highlighted: card.highlighted !== undefined ? card.highlighted : false,
        enabled: card.enabled !== undefined ? card.enabled : true,
        progress: card.progress || { current: 0, total: 10 }
      })),
      progress: data.progress || { current: 0, total: 10 }
    };
  }

  private getDefaultTrackData(): Track {
    return {
      title: 'Default Track',
      description: 'No track description available',
      benefits: [],
      content: {
        sections: [{
          title: 'Introduction',
          content: 'No content available'
        }]
      },
      pathCards: [],
      progress: { current: 0, total: 10 }
    };
  }


  exploreRoadmap(roadmapId: string) {
    console.log("roadmapId", roadmapId);
    if (!roadmapId) return;
    this.router.navigate(['/roadmap', roadmapId]);
  }

  startStep(stepId: string) {
    const user = this.authServices.getUserProfile();
    if (!user) return;

    this.authServices.getUserProgress(user.uid).pipe(
      take(1),
      switchMap(progress => {
        const updatedProgress = {
          ...progress,
          inProgressSteps: [...progress.inProgressTracks, stepId],
          lastUpdated: new Date()
        };
        return this.authServices.updateUserProgress(user.uid, updatedProgress);
      })
    ).subscribe(() => {
      this.router.navigate(['/roadmap', stepId]);
    },
      error => {
        console.error('Error updating user progress:', error);
      });
  }
}

