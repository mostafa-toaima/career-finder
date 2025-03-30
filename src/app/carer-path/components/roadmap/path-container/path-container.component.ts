import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'path-container',
  imports: [CommonModule],
  templateUrl: './path-container.component.html',
  styleUrl: './path-container.component.css'
})
export class PathContainerComponent {
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

  // toggleStage(stageId: string): void {
  //   this.stageToggled.emit(stageId);
  // }

  toggleStep(stepId: string): void {
    this.stepToggled.emit(stepId);
  }

  startStep(stepId: string): void {
    this.stepStarted.emit(stepId);
  }

  completeStep(stepId: string): void {
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



}
