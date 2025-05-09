import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TrackService } from '../../../carer-path/services/track.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';

interface PersonalInfoItem {
  icon: string;
  label: string;
  field: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  userData: any = {};
  progress: any = {};
  roadmaps: any[] = [];
  filteredRoadmaps: any[] = [];
  userInitials: string = '';
  loading: boolean = true;
  randomGradient: string;

  personalInfoItems: PersonalInfoItem[] = [
    { icon: 'email', label: 'Email', field: 'email' },
    { icon: 'phone', label: 'Mobile', field: 'mobile' },
    { icon: 'gender', label: 'Gender', field: 'gender' },
    { icon: 'school', label: 'University', field: 'university' },
    { icon: 'book', label: 'Faculty', field: 'faculty' },
    { icon: 'department', label: 'Department', field: 'department' }
  ];

  constructor(
    private authService: AuthService,
    private trackService: TrackService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.randomGradient = this.generateRandomGradient();
  }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.loadUserData();
  }

  loadUserData() {
    this.loading = true;

    this.authService.getUserProfileFromFirestore().subscribe({
      next: (data) => {
        this.userData = data || {};
        this.userInitials = this.getInitials(data?.name);
      },
      error: (err) => console.error('Error loading user data:', err)
    });

    const userId = this.authService.getUserProfile()?.uid;
    if (userId) {
      this.authService.getUserProgress(userId).subscribe({
        next: (progress) => {
          this.progress = progress || {};
          this.updateFilteredRoadmaps();
        },
        error: (err) => console.error('Error loading progress:', err)
      });
    }

    this.trackService.getAllRoadmaps().subscribe({
      next: (roadmaps) => {
        this.roadmaps = roadmaps || [];
        this.updateFilteredRoadmaps();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading roadmaps:', err);
        this.loading = false;
      }
    });
  }

  updateFilteredRoadmaps() {
    if (this.roadmaps.length && this.progress) {
      this.filteredRoadmaps = this.roadmaps.filter(roadmap => {
        const roadmapProgress = this.progress.roadmapProgress?.[roadmap.id];
        return roadmapProgress && (
          (roadmapProgress.completedSteps?.length > 0) ||
          (roadmapProgress.inProgressSteps?.length > 0)
        );
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getRoadmapCompletion(roadmapId: string): number {
    const roadmapProgress = this.progress?.roadmapProgress?.[roadmapId];
    if (!roadmapProgress) return 0;

    const totalSteps = this.getTotalSteps(roadmapId);
    const completedSteps = this.getCompletedSteps(roadmapId).length;

    if (totalSteps <= 0) return 0;
    return Math.round((completedSteps / totalSteps) * 100);
  }

  getCompletedSteps(roadmapId: string): string[] {
    const roadmapProgress = this.progress?.roadmapProgress?.[roadmapId];
    return roadmapProgress?.completedSteps || [];
  }

  getInProgressSteps(roadmapId: string): string[] {
    const roadmapProgress = this.progress?.roadmapProgress?.[roadmapId];
    return roadmapProgress?.inProgressSteps || [];
  }

  getNotStartedSteps(roadmapId: string): string[] {
    const roadmap = this.roadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return [];

    const allStepIds = this.getAllStepIds(roadmap);
    const completed = this.getCompletedSteps(roadmapId);
    const inProgress = this.getInProgressSteps(roadmapId);

    return allStepIds.filter(stepId =>
      !completed.includes(stepId) && !inProgress.includes(stepId)
    );
  }

  getTotalSteps(roadmapId: string): number {
    const roadmap = this.roadmaps.find(r => r.id === roadmapId);
    return this.getAllStepIds(roadmap).length;
  }

  getTotalCompletedSteps(): number {
    return this.filteredRoadmaps.reduce((total, roadmap) => {
      return total + this.getCompletedSteps(roadmap.id).length;
    }, 0);
  }

  getTotalInProgressSteps(): number {
    return this.filteredRoadmaps.reduce((total, roadmap) => {
      return total + this.getInProgressSteps(roadmap.id).length;
    }, 0);
  }

  getStepTitle(roadmapId: string, stepId: string): string {
    const roadmap = this.roadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return stepId;

    for (const stage of roadmap.stages || []) {
      const step = (stage.steps || []).find((s: any) => s.id === stepId);
      if (step) return step.title || stepId;
    }
    return stepId;
  }

  private getAllStepIds(roadmap: any): string[] {
    if (!roadmap) return [];
    const stepIds: string[] = [];

    (roadmap.stages || []).forEach((stage: any) => {
      (stage.steps || []).forEach((step: any) => {
        if (step.id) stepIds.push(step.id);
      });
    });

    return stepIds;
  }

  generateRandomGradient(): string {
    const gradients = [
      'linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%)',
      'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
      'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
      'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 80) {
      return '#38a169'; // green
    } else if (percentage >= 50) {
      return '#ed8936'; // orange
    } else {
      return '#e53e3e'; // red
    }
  }

  openRoadmaps() {
    this.router.navigate(['/build-career']);
  }

  viewRoadmap(roadmapId: string) {
    this.router.navigate(['/roadmap', roadmapId]);
  }

  editProfile() {
    // Implement edit profile functionality
    console.log('Edit profile clicked');
  }

  editPersonalInfo() {
    // Implement edit personal info functionality
    console.log('Edit personal info clicked');
  }
}
