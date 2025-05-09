import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { PathContainerComponent } from './path-container/path-container.component';
import { TrackService } from '../../services/track.service';
import { PathHeaderComponent } from './path-header/path-header.component';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { Roadmap, Stage } from './models/pathModel';
import { UserProgress } from '../../../auth/interfaces/UserProgress';
import { AuthService } from '../../../auth/services/auth.service';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChipModule,
    AvatarModule,
    FormsModule,
    PathHeaderComponent,
    PathContainerComponent
  ],
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss'],
  animations: [
    trigger('stepAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pathAnimation', [
      transition(':enter', [
        style({ height: 0 }),
        animate('1s ease-out', style({ height: '*' }))
      ])
    ])
  ]
})
export class RoadmapComponent implements OnInit {
  title = '';
  activeStep: string | null = null;
  activeStage: string | null = null;
  completedSteps: string[] = [];
  inProgressSteps: string[] = [];
  stages: Stage[] = [];
  roadmapId: string | null = null;
  userProgress: UserProgress | null = null;

  // Filter state
  searchQuery = '';
  selectedFilter: 'all' | 'completed' | 'in-progress' | 'not-started' = 'all';

  constructor(
    private viewportScroller: ViewportScroller,
    private route: ActivatedRoute,
    private trackService: TrackService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.scrollToTop();
    this.subscribeToRouteParams();
    this.loadUserProgress();
  }

  private scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  private subscribeToRouteParams(): void {
    this.route.params.subscribe(params => {
      const roadmapId = params['roadmapId'] || 'frontend';
      this.loadRoadMapData(roadmapId);
    });
  }

  private loadUserProgress(): void {
    const user = this.authService.getUserProfile();
    if (user) {
      this.authService.getUserProgress(user.uid).subscribe({
        next: progress => {
          this.userProgress = progress;
          if (this.roadmapId && progress.roadmapProgress[this.roadmapId]) {
            this.completedSteps = progress.roadmapProgress[this.roadmapId].completedSteps;
            this.inProgressSteps = progress.roadmapProgress[this.roadmapId].inProgressSteps;
          }
        },
        error: (error) => {
          console.error('Error loading user progress:', error);
        }
      });
    }
  }

  loadRoadMapData(roadMapId: string): void {
    this.roadmapId = roadMapId;
    const user = this.authService.getUserProfile();
    if (!user) return;

    this.trackService.getRoadmapWithProgress(roadMapId, user.uid).subscribe({
      next: ({ roadmap, progress }) => {
        this.title = roadmap.title;
        this.stages = roadmap.stages;
        this.completedSteps = progress.completedSteps;
        this.inProgressSteps = progress.inProgressSteps;
      },
      error: (error) => {
        console.error('Error loading roadmap data:', error);
      }
    });
  }

  // Step management methods
  startStep(stepId: string): void {
    if (!this.roadmapId) return;

    if (!this.inProgressSteps.includes(stepId) && !this.completedSteps.includes(stepId)) {
      this.inProgressSteps = [...this.inProgressSteps, stepId];
      this.updateUserProgress();
    }
  }

  completeStep(stepId: string): void {
    if (!this.roadmapId) return;

    this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
    this.completedSteps = [...this.completedSteps, stepId];
    this.updateUserProgress();
  }

  resetStep(stepId: string): void {
    if (!this.roadmapId) return;

    this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
    this.completedSteps = this.completedSteps.filter(id => id !== stepId);
    this.updateUserProgress();
  }

  private updateUserProgress(): void {
    const user = this.authService.getUserProfile();
    if (!user || !this.roadmapId) return;

    this.authService.getUserProgress(user.uid).pipe(
      take(1),
      switchMap(progress => {
        const updated = {
          ...progress,
          roadmapProgress: {
            ...progress.roadmapProgress,
            [this.roadmapId!]: {
              completedSteps: this.completedSteps,
              inProgressSteps: this.inProgressSteps
            }
          },
          lastUpdated: new Date()
        };
        return this.authService.updateUserProgress(user.uid, updated);
      })
    ).subscribe({
      next: () => console.log('Progress updated successfully'),
      error: (err) => console.error('Failed to update progress:', err)
    });
  }

  // UI interaction methods
  toggleStep(stepId: string): void {
    this.activeStep = this.activeStep === stepId ? null : stepId;
  }

  toggleStage(stageId: string): void {
    this.activeStage = this.activeStage === stageId ? null : stageId;
  }

  onFilterChange(filter: 'all' | 'completed' | 'in-progress' | 'not-started'): void {
    this.selectedFilter = filter;
  }

  resetFilter(): void {
    this.selectedFilter = 'all';
    this.searchQuery = '';
  }

  // Computed properties
  get filteredStages(): Stage[] {
    let filtered = this.stages;

    if (this.selectedFilter !== 'all') {
      filtered = filtered.map(stage => ({
        ...stage,
        steps: stage.steps.filter(step => {
          const isCompleted = this.completedSteps.includes(step.id);
          const isInProgress = this.inProgressSteps.includes(step.id);

          switch (this.selectedFilter) {
            case 'completed': return isCompleted;
            case 'in-progress': return isInProgress && !isCompleted;
            case 'not-started': return !isCompleted && !isInProgress;
            default: return true;
          }
        })
      })).filter(stage => stage.steps.length > 0);
    }

    return filtered;
  }

  get totalSteps(): number {
    return this.stages.reduce((total, stage) => total + stage.steps.length, 0);
  }

  get completionPercentage(): number {
    return this.totalSteps > 0 ? Math.round((this.completedSteps.length / this.totalSteps) * 100) : 0;
  }
}
