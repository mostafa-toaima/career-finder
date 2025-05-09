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
  imports: [CommonModule, CardModule, ChipModule, AvatarModule, FormsModule, PathHeaderComponent, PathContainerComponent],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css',
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
  title: string = '';
  activeStep: string | null = null;
  activeStage: string | null = null;
  searchQuery = '';
  completedSteps: string[] = [];
  selectedFilter: any = 'all';
  inProgressSteps: string[] = [];
  filterOptions: any[] = []
  stages: Stage[] = [];
  userProgress: UserProgress | null = null;
  roadmapId: string | null = null;


  constructor(private viewportScroller: ViewportScroller,
    private route: ActivatedRoute, private trackService: TrackService, private authService: AuthService
  ) {
    // this.route.paramMap.subscribe(params => {
    //   const roadmapId = params.get('id');
    //   this.stages = history.state.roadmapData.stages;
    //   this.Title = history.state.roadmapData.title;
    //   // if (!this.stages) {
    //   //   const roadmapCollection = collection(this.firestore, 'roadmaps');
    //   //   const roadmapDoc = doc(roadmapCollection, roadmapId!);
    //   //   getDoc(roadmapDoc).then(docSnapshot => {
    //   //     if (docSnapshot.exists()) {
    //   //       const roadmapData = docSnapshot.data();
    //   //       this.stages = roadmapData['stages'];
    //   //       this.Title = roadmapData['title'];
    //   //     }
    //   //   });
    //   // }
    // });
  }

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
      this.authService.getUserProgress(user.uid).subscribe(progress => {
        this.userProgress = progress;
        // Initialize completedSteps and inProgressSteps from user progress
        if (this.roadmapId && progress.roadmapProgress[this.roadmapId]) {
          this.completedSteps = progress.roadmapProgress[this.roadmapId].completedSteps;
          this.inProgressSteps = progress.roadmapProgress[this.roadmapId].inProgressSteps;
        }
      },
        (error) => {
          console.error('Error loading user progress:', error);
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

  // Update methods to save progress
  startStep(stepId: string): void {
    const user = this.authService.getUserProfile();
    if (!user || !this.roadmapId) return;

    if (!this.inProgressSteps.includes(stepId) && !this.completedSteps.includes(stepId)) {
      this.inProgressSteps.push(stepId);

      this.authService.getUserProgress(user.uid).pipe(
        take(1),
        switchMap(progress => {
          const updatedRoadmapProgress = {
            ...progress.roadmapProgress,
            [this.roadmapId!]: {
              completedSteps: progress.roadmapProgress[this.roadmapId!]?.completedSteps || [],
              inProgressSteps: [...this.inProgressSteps]
            }
          };

          return this.authService.updateUserProgress(user.uid, {
            roadmapProgress: updatedRoadmapProgress
          });
        })
      ).subscribe();
    }
  }


  filterStages(): void {
    this.searchQuery = this.searchQuery;
  }
  onFilterChange(value: any): void {
    if (['all', 'completed', 'in-progress', 'not-started'].includes(value)) {
      this.selectedFilter = value;
    } else {
      console.warn('Invalid filter option:', value);
    }
  }


  onSearchChange(value: any): void {
    this.searchQuery = value;
  }
  toggleStep(stepId: string): void {
    this.activeStep = this.activeStep === stepId ? null : stepId;
  }
  toggleStage(stageId: string): void {
    this.activeStage = this.activeStage === stageId ? null : stageId;
  }

  completeStep(stepId: string): void {
    const user = this.authService.getUserProfile();
    if (!user || !this.roadmapId) return;

    // Update local state first for immediate UI feedback
    this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
    this.completedSteps = [...this.completedSteps, stepId];

    // Then update Firestore
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
      next: () => console.log('Progress updated'),
      error: (err) => console.error('Update failed', err)
    });
  }
  // In roadmap.component.ts
  resetStep(stepId: string): void {
    const user = this.authService.getUserProfile();
    if (!user || !this.roadmapId) return;

    // Update local state
    this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
    this.completedSteps = this.completedSteps.filter(id => id !== stepId);

    // Update Firestore
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
    ).subscribe();
  }
  resetFilter() {
    this.selectedFilter = 'all';
    this.searchQuery = '';
  }

  get filteredStages() {
    let filtered = this.stages;
    if (this.selectedFilter !== 'all') {
      filtered = filtered.map(stage => ({
        ...stage,
        steps: stage?.steps.filter((step: any) => {
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
}
