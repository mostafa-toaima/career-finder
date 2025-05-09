import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../auth/services/auth.service';
import { SkillModalComponent } from '../models/skill-model/skill-model.component';


@Component({
  selector: 'path-container',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, SkillModalComponent],
  templateUrl: './path-container.component.html',
  styleUrls: ['./path-container.component.scss']
})
export class PathContainerComponent {

  private authService = inject(AuthService)

  @Input() filteredStages: any[] = [];
  @Input() activeStage: string | null = null;
  @Input() activeStep: string | null = null;
  @Input() completedSteps: string[] = [];
  @Input() inProgressSteps: string[] = [];


  @Output() stageToggled = new EventEmitter<string>();
  @Output() stepToggled = new EventEmitter<string>();
  @Output() stepStarted = new EventEmitter<string>();
  @Output() stepCompleted = new EventEmitter<string>();
  @Output() stepReset = new EventEmitter<string>();
  @Output() resetFilter = new EventEmitter<void>();

  // Skill modal state
  showSkillModal = false;
  selectedSkill: any = null;

  // Track active stages
  activeStages: string[] = [];
  skillStatuses: { [key: string]: 'start' | 'in-progress' | 'completed' } = {};

  constructor() {
    this.activeStages = this.filteredStages.map(stage => stage.id);
  }

  ngOnInit(): void {
    this.loadUserProgress();
  }

  private loadUserProgress(): void {
    const user = this.authService.getUserProfile();
    if (user) {
      this.authService.getUserProgress(user.uid).subscribe((progress: any) => {
        this.skillStatuses = progress?.skillProgress || {};
      });
    }
  }

  // Stage and step interactions
  toggleStage(stageId: string): void {
    if (this.activeStages.includes(stageId)) {
      this.activeStages = this.activeStages.filter(id => id !== stageId);
    } else {
      this.activeStages.push(stageId);
    }
    this.stageToggled.emit(stageId);
  }

  toggleStep(stepId: string): void {
    this.stepToggled.emit(stepId);
  }

  // Step status management
  startStep(stepId: string): void {
    this.stepStarted.emit(stepId);
  }

  completeStep(stepId: string): void {
    this.stepCompleted.emit(stepId);
  }

  resetStep(stepId: string): void {
    this.stepReset.emit(stepId);
  }

  getCompletedStepsCount(stage: any): number {
    if (!stage?.steps) return 0;
    return stage.steps.filter((step: any) => this.completedSteps.includes(step.id)).length;
  }

  // Skill management
  openSkillModal(skill: any, stepId: string): void {
    if (!this.isStepActive(stepId)) return;

    this.selectedSkill = {
      ...skill,
      stepId: stepId,
      status: this.getSkillStatus(skill.id)
    };
    this.showSkillModal = true;
  }

  onSkillStatusChange(event: { skillId: string, status: 'start' | 'in-progress' | 'completed' }): void {
    const user = this.authService.getUserProfile();
    if (!user) return;

    this.authService.updateSkillStatus(user.uid, event.skillId, event.status).subscribe({
      next: () => {
        this.skillStatuses[event.skillId] = event.status;
      },
      error: (err: any) => {
        console.error('Failed to update skill status:', err);
      }
    });
  }

  isStepActive(stepId: string): boolean {
    return this.inProgressSteps.includes(stepId) || this.completedSteps.includes(stepId);
  }

  getSkillStatus(skillId: string): 'start' | 'in-progress' | 'completed' {
    return this.skillStatuses[skillId] || 'start';
  }

  getSkillTooltip(skillId: string, stepId: string): string {
    if (!this.isStepActive(stepId)) {
      return 'Begin step first';
    }

    const status = this.getSkillStatus(skillId);
    switch (status) {
      case 'completed': return 'Skill mastered!';
      case 'in-progress': return 'Working on this skill';
      case 'start': return 'Start learning this skill';
      default: return 'Start learning this skill';
    }
  }
  resetFilters(): void {
    this.resetFilter.emit();
  }
}
