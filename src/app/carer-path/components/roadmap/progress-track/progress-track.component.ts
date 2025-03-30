import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-track',
  imports: [CommonModule],
  templateUrl: './progress-track.component.html',
  styleUrl: './progress-track.component.css'
})
export class ProgressTrackComponent {
  @Input() completedSteps: any[] = [];
  @Input() totalSteps: any;
  @Input() stages: any[] = [];

  getProgressPosition(): number {
    if (this.completedSteps.length === 0) return 0;
    if (this.completedSteps.length === this.totalSteps) return 100;

    let completedCount = 0;
    let lastCompletedPosition = 0;

    this.stages.forEach(stage => {
      stage.steps.forEach((step: any) => {
        const stepPosition = (completedCount / this.totalSteps) * 100;
        if (this.completedSteps.includes(step.id)) {
          lastCompletedPosition = stepPosition + (100 / this.totalSteps);
        }
        completedCount++;
      });
    });

    return lastCompletedPosition;
  }
}
