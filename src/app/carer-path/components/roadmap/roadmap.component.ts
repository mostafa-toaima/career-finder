import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CarerService } from '../../services/carer.service';
import { ProgressTrackComponent } from './progress-track/progress-track.component';
import { PathHeaderComponent } from './path-header/path-header.component';
import { PathContainerComponent } from './path-container/path-container.component';

@Component({
  imports: [CommonModule, CardModule, ChipModule, AvatarModule, FormsModule, ProgressTrackComponent, PathHeaderComponent, PathContainerComponent],
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
  Title = 'Front-End Developer Roadmap';
  activeStep: string | null = null;
  activeStage: string | null = null;
  searchQuery = '';
  completedSteps: string[] = [];
  selectedFilter: any = 'all';
  inProgressSteps: string[] = [];
  filterOptions: any[] = []
  stages: any[] = [];
  constructor(private viewportScroller: ViewportScroller, private careerService: CarerService) {
    this.stages = this.careerService.stages;
  }
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
  filterStages(): void {
    this.searchQuery = this.searchQuery;
  }
  onFilterChange(value: any): void {
    console.log('Filter changed to:', value);
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

  startStep(stepId: string): void {
    if (!this.inProgressSteps.includes(stepId) && !this.completedSteps.includes(stepId)) {
      this.inProgressSteps.push(stepId);
    }
  }
  completeStep(stepId: string): void {
    if (this.inProgressSteps.includes(stepId)) {
      this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
      if (!this.completedSteps.includes(stepId)) {
        this.completedSteps.push(stepId);
      }
    }
  }
  resetStep(stepId: string): void {
    this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
    this.completedSteps = this.completedSteps.filter(id => id !== stepId);
  }
  // get filteredStages() {
  //   let filtered = this.stages;
  //   if (this.searchQuery) {
  //     const query = this.searchQuery.toLowerCase();
  //     filtered = filtered.map(stage => ({
  //       ...stage,
  //       steps: stage.steps.filter((step: any) =>
  //         step.title.toLowerCase().includes(query) ||
  //         step.description.toLowerCase().includes(query) ||
  //         step.skills.some((skill: string) => skill.toLowerCase().includes(query))
  //       )
  //     })).filter(stage => stage.steps.length > 0);
  //   }
  //   if (this.selectedFilter !== 'all') {
  //     filtered = filtered.map(stage => ({
  //       ...stage,
  //       steps: stage.steps.filter((step: any) => {
  //         const isCompleted = this.completedSteps.includes(step.id);
  //         const isInProgress = this.inProgressSteps.includes(step.id);

  //         switch (this.selectedFilter) {
  //           case 'completed': return isCompleted;
  //           case 'in-progress': return isInProgress && !isCompleted;
  //           case 'not-started': return !isCompleted && !isInProgress;
  //           default: return true;
  //         }
  //       })
  //     })).filter(stage => stage.steps.length > 0);
  //   }

  //   return filtered;
  // }

  get filteredStages() {
    let filtered = this.stages;
    if (this.selectedFilter !== 'all') {
      filtered = filtered.map(stage => ({
        ...stage,
        steps: stage.steps.filter((step: any) => {
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
