import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [CommonModule, CardModule, ChipModule, AvatarModule, FormsModule],
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
  constructor(private viewportScroller: ViewportScroller) { }
  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0])
  }
  isCompactView = false;
  activeStep: string | null = null;
  searchQuery = '';
  completedSteps: string[] = [];

  stages = [
    {
      name: 'Foundation/Fundamentals',
      steps: [
        {
          id: 'html-css',
          title: 'HTML/CSS',
          icon: 'fab fa-html5',
          color: '#e34f26',
          backgroundColor: '#ffeee6', // Light orange (matching HTML color)
          description: 'Master semantic HTML and modern CSS techniques',
          skills: ['Semantic HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design'],
          resources: [
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: 'fas fa-book' },
            { name: 'CSS Tricks', url: 'https://css-tricks.com', icon: 'fas fa-palette' }
          ],
          duration: '2-4 weeks',
          level: 'Beginner'
        },
        {
          id: 'javascript',
          title: 'JavaScript',
          icon: 'fab fa-js-square',
          color: '#f7df1e',
          backgroundColor: '#fffae6', // Light yellow (matching JS color)
          description: 'Learn modern JavaScript and TypeScript fundamentals',
          skills: ['ES6+', 'Types', 'Interfaces', 'Classes', 'Modules'],
          duration: '4-6 weeks',
          level: 'Beginner'
        }
      ]
    },
    {
      name: 'Angular Core',
      steps: [
        {
          id: 'angular-basics',
          title: 'Angular Basics',
          icon: 'fab fa-angular',
          color: '#dd0031',
          backgroundColor: '#ffebee', // Light red (matching Angular color)
          description: 'Core Angular concepts and architecture',
          skills: ['Components', 'Templates', 'Directives', 'Pipes', 'Services'],
          duration: '3-5 weeks',
          level: 'Intermediate'
        },
        {
          id: 'angular-forms',
          title: 'Angular Forms',
          icon: 'fas fa-file-signature',
          color: '#1976d2',
          backgroundColor: '#e3f2fd', // Light blue (matching Forms theme)
          description: 'Both template-driven and reactive forms approaches',
          skills: ['FormControl', 'FormGroup', 'Validation', 'Custom Validators'],
          duration: '2-3 weeks',
          level: 'Intermediate'
        }
      ]
    },
    {
      name: 'Advanced Concepts',
      steps: [
        {
          id: 'state-management',
          title: 'State Management',
          icon: 'fas fa-project-diagram',
          color: '#6a1b9a',
          backgroundColor: '#f3e5f5', // Light purple (matching NgRx/RxJS theme)
          description: 'Manage complex application state',
          skills: ['NgRx', 'RxJS', 'Services', 'BehaviorSubject'],
          duration: '4-6 weeks',
          level: 'Advanced'
        }
      ]
    },
    {
      name: 'Ecosystem',
      steps: [
        {
          id: 'testing',
          title: 'Testing',
          icon: 'fas fa-vial',
          color: '#388e3c',
          backgroundColor: '#e8f5e9', // Light green (matching testing theme)
          description: 'Ensure application reliability',
          skills: ['Jasmine', 'Karma', 'Protractor', 'Test Bed'],
          duration: '3-5 weeks',
          level: 'Intermediate'
        }
      ]
    }
  ];

  get filteredStages() {
    if (!this.searchQuery) return this.stages;
    const query = this.searchQuery.toLowerCase();
    return this.stages.map(stage => ({
      ...stage,
      steps: stage.steps.filter(step =>
        step.title.toLowerCase().includes(query) ||
        step.description.toLowerCase().includes(query) ||
        step.skills.some(skill => skill.toLowerCase().includes(query))
      )
    })).filter(stage => stage.steps.length > 0);
  }

  get totalSteps(): number {
    return this.stages.reduce((total, stage) => total + stage.steps.length, 0);
  }

  toggleStep(stepId: string): void {
    this.activeStep = this.activeStep === stepId ? null : stepId;
  }

  toggleViewMode(): void {
    this.isCompactView = !this.isCompactView;
    this.activeStep = null;
  }

  toggleComplete(stepId: string): void {
    const index = this.completedSteps.indexOf(stepId);
    if (index === -1) {
      this.completedSteps.push(stepId);
    } else {
      this.completedSteps.splice(index, 1);
    }
  }

  // Add to your component class
  // Add to your component class
  getProgressPosition(): number {
    if (this.completedSteps.length === 0) return 0;
    if (this.completedSteps.length === this.totalSteps) return 100;

    let completedCount = 0;
    let lastCompletedPosition = 0;

    this.stages.forEach(stage => {
      stage.steps.forEach(step => {
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
