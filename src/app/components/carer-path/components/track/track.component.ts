import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TrackModalComponent } from '../track-modal/track-modal.component';
import { Track, TrackPathCard, TrackProgress } from '../../interfaces/Track';
import { TrackService } from '../../services/track.service';


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

  constructor(
    private viewportScroller: ViewportScroller,
    private trackService: TrackService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
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

  loadTrackData(trackId: string): void {
    this.trackService.getTrack(trackId).subscribe({
      next: (data: Partial<Track>) => {
        this.trackData = this.normalizeTrackData(data);
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
}
