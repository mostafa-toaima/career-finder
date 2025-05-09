import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModelComponent } from '../models/step-model/step-model.component';
import { SkillModelComponent } from '../models/skill-model/skill-model.component';
import { AuthService } from '../../../../auth/services/auth.service';
import { UserProgress } from '../../../../auth/interfaces/UserProgress';

@Component({
  selector: 'path-container',
  imports: [CommonModule, MatTooltipModule, ModelComponent, SkillModelComponent],
  templateUrl: './path-container.component.html',
  styleUrl: './path-container.component.css'
})
export class PathContainerComponent {
  start: boolean = true;
  inProgress: boolean = false;
  complete: boolean = false;
  hover: boolean = false;
  visibleModel: boolean = false;
  showSkillModal: boolean = false;
  skillModalData: any;
  completedStages: any[] = [];
  skillStatuses: { [key: string]: string } = {};
  userProgress: UserProgress | null = null;

  private authService = inject(AuthService);

  @Input() filteredStages: any[] = [];
  @Input() activeStage: string | null = null;
  @Input() activeStep: string | null = null;
  @Input() completedSteps: string[] = [];
  @Input() inProgressSteps: string[] = [];
  @Input() activeStages: any;

  @Output() stageToggled = new EventEmitter<string>();
  @Output() stepToggled = new EventEmitter<string>();
  @Output() stepStarted = new EventEmitter<string>();
  @Output() stepCompleted = new EventEmitter<string>();
  @Output() stepReset = new EventEmitter<string>();
  @Output() resetFilter = new EventEmitter<string>();

  ngOnInit(): void {

    this.loadUserProgress();
  }


  private loadUserProgress(): void {
    const user = this.authService.getUserProfile();
    if (user) {
      this.authService.getUserProgress(user.uid).subscribe(progress => {
        this.userProgress = progress;
        this.initializeSkillStatuses(); // Initialize skill statuses after loading progress
      });
    }
  }


  toggleStep(stepId: string): void {
    this.stepToggled.emit(stepId);
  }

  startStep(stepId: string): void {
    this.hover = false
    this.start = false;
    this.complete = false;
    this.inProgress = true;
    this.stepStarted.emit(stepId);
  }

  completeStep(stepId: string): void {
    this.start = false;
    this.complete = true;
    this.inProgress = false;
    this.stepCompleted.emit(stepId);
  }

  resetStep(stepId: string): void {
    this.stepReset.emit(stepId);
  }


  constructor() {
    this.activeStages = this.filteredStages.map(stage => stage.id);
  }

  toggleStage(stageId: any): void {
    if (this.activeStages.includes(stageId)) {
      this.activeStages = this.activeStages.filter((id: any) => id !== stageId);

      console.log('activeStages', this.activeStages);

    } else {
      this.activeStages.push(stageId);
    }
    this.stageToggled.emit(this.activeStages);
  }

  hasNamedSkills(step: any): boolean {
    return step.skills?.some((skill: any) => !!skill.name);
  }

  openSkillsModal(skill: any): void {
    console.log('skill', skill);

    this.skillModalData = {
      ...skill,
      status: this.skillStatuses[skill.id] || 'start'
    };
    this.showSkillModal = true;
  }

  onSkillStatusChange(event: { skillId: string, status: 'start' | 'in-progress' | 'completed' }) {
    const user = this.authService.getUserProfile();
    if (!user) return;

    this.authService.updateSkillStatus(user.uid, event.skillId, event.status).subscribe({
      next: () => {
        this.skillStatuses[event.skillId] = event.status;
      },
      error: (err) => {
        console.error('Failed to update skill status:', err);
        // Optionally show error to user
      }
    });
  }

  getSkillStyle(skill: any, stepId: any) {
    const status: any = this.skillStatuses[skill.id] || 'start';

    switch (status) {
      case this.inProgressSteps.includes(stepId):
        return {
          'background': 'linear-gradient(to right, #FFA500, #FFC04D)',
          'color': 'white',
          'border': '1px solid #CC8400',
          'cursor': 'pointer'
        };
      case this.completedSteps.includes(stepId):
        return {
          'background': 'linear-gradient(to right, #2d89ff, #6aa9ff)',
          'color': 'white',
          'border': '1px solid #1a73e8',
          'cursor': 'pointer'
        };
      default:
        return {
          'background': '#f0f0f0',
          'color': 'black',
          'border': '1px solid #ccc',
          'cursor': 'pointer',
          'opacity': '0.6'
        };
    }
  }

  openStepModel() {
    this.visibleModel = true;

  }

  resetFilters() {
    this.resetFilter.emit();
  }

  getSkillTooltip(status: string): string {
    switch (status) {
      case 'completed': return 'Skill mastered!';
      case 'in-progress': return 'Working on this skill';
      default: return 'Begin step to start learning this skill';
    }
  }


  handleSkillClick(stepId: string, skill: any): void {
    // Only allow interaction if step is in progress or completed
    if (!this.inProgressSteps.includes(stepId) && !this.completedSteps.includes(stepId)) {
      return;
    }

    const currentStatus = this.getSkillStatus(skill.id);
    let newStatus: 'start' | 'in-progress' | 'completed';

    // Cycle through statuses
    switch (currentStatus) {
      case 'start': newStatus = 'in-progress'; break;
      case 'in-progress': newStatus = 'completed'; break;
      default: newStatus = 'start'; break;
    }

    this.updateSkillStatus(skill.id, newStatus);
  }










  initializeSkillStatuses(): void {
    if (!this.userProgress?.skillProgress) return;
    this.skillStatuses = { ...this.userProgress.skillProgress };
  }

  getSkillStatus(skillId: string): 'start' | 'in-progress' | 'completed' {
    // If step is completed, all skills are automatically completed
    if (this.completedSteps.includes(this.activeStep || '')) {
      return 'completed';
    }
    return this.skillStatuses[skillId] as 'start' | 'in-progress' | 'completed' || 'start';
  }

  updateSkillStatus(skillId: string, status: 'start' | 'in-progress' | 'completed'): void {
    const user = this.authService.getUserProfile();
    if (!user) return;

    // Update local state
    this.skillStatuses[skillId] = status;

    // Ensure userProgress exists
    if (!this.userProgress) {
      this.userProgress = {
        userId: user.uid,
        completedTracks: [],
        inProgressTracks: [],
        completedSteps: [],
        inProgressSteps: [],
        trackProgress: {},
        roadmapProgress: {},
        skillProgress: {},
        lastUpdated: new Date()
      };
    }

    // Update userProgress
    this.userProgress.skillProgress = {
      ...this.userProgress.skillProgress,
      [skillId]: status
    };

    // Update Firestore
    this.authService.updateSkillProgress(user.uid, skillId, status).subscribe({
      error: (err) => {
        console.error('Failed to update skill progress:', err);
        // Revert local state if update fails
        delete this.skillStatuses[skillId];
        if (this.userProgress?.skillProgress) {
          delete this.userProgress.skillProgress[skillId];
        }
      }
    });
  }
}
