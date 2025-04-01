import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModelComponent } from '../models/step-model/step-model.component';
import { SkillModelComponent } from '../models/skill-model/skill-model.component';

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
  skillStatuses: { [key: string]: string } = {}; // 'start' | 'in-progress' | 'complete'
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
    } else {
      this.activeStages.push(stageId);
    }
    this.stageToggled.emit(this.activeStages);
  }

  // openSkillsModal(step: any): void {
  //   this.skillModalData = step;
  //   this.showSkillModal = true;
  // }

  openSkillsModal(skill: any): void {
    this.skillModalData = {
      ...skill,
      status: this.skillStatuses[skill.id] || 'start' // Default to 'start' if no status
    };
    this.showSkillModal = true;
  }

  onSkillStatusChange(event: { skillId: string, status: string }) {
    this.skillStatuses[event.skillId] = event.status;
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
}
