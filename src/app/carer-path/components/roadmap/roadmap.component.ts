import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

type FilterOption = 'all' | 'completed' | 'in-progress' | 'not-started';
type StepStatus = 'completed' | 'in-progress' | 'not-started';

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
  activeStage: string | null = null;
  searchQuery = '';
  completedSteps: string[] = [];
  allStepsVisible = false;
  allStagesVisible = false;
  showAllSteps = false;
  selectedFilter: FilterOption = 'all';
  inProgressSteps: string[] = []; // Add steps that are in progress here
  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' }
  ];


  stages = [
    {
      name: 'Web Fundamentals',
      id: 'fundamentals',
      icon: 'fas fa-globe',
      steps: [
        {
          id: 'html5',
          title: 'HTML5',
          icon: 'fab fa-html5',
          color: '#e34f26',
          backgroundColor: '#ffeee6',
          description: 'Master semantic HTML5, forms, accessibility, and SEO basics',
          skills: ['Semantic HTML', 'Accessibility', 'SEO', 'HTML5 APIs'],
          resources: [
            { name: 'MDN HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', icon: 'fas fa-book' },
            { name: 'HTML5 Doctor', url: 'http://html5doctor.com', icon: 'fas fa-stethoscope' },
            { name: 'WebAIM', url: 'https://webaim.org', icon: 'fas fa-universal-access' }
          ],
          duration: '2-3 weeks',
          level: 'Beginner'
        },
        {
          id: 'css3',
          title: 'CSS3',
          icon: 'fab fa-css3-alt',
          color: '#264de4',
          backgroundColor: '#e6eeff',
          description: 'Modern CSS including Flexbox, Grid, animations and responsive design',
          skills: ['Flexbox', 'CSS Grid', 'Animations', 'Responsive Design', 'Variables'],
          resources: [
            { name: 'CSS Tricks', url: 'https://css-tricks.com', icon: 'fas fa-palette' },
            { name: 'Grid by Example', url: 'https://gridbyexample.com', icon: 'fas fa-th' },
            { name: 'Flexbox Froggy', url: 'https://flexboxfroggy.com', icon: 'fas fa-frog' }
          ],
          duration: '3-4 weeks',
          level: 'Beginner'
        },
        {
          id: 'javascript-es6',
          title: 'JavaScript & ES6+',
          icon: 'fab fa-js-square',
          color: '#f7df1e',
          backgroundColor: '#fffae6',
          description: 'Modern JavaScript features and best practices',
          skills: ['ES6+ Syntax', 'DOM Manipulation', 'Async/Await', 'Promises', 'Modules'],
          resources: [
            { name: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net', icon: 'fas fa-book' },
            { name: 'You Don\'t Know JS', url: 'https://github.com/getify/You-Dont-Know-JS', icon: 'fab fa-github' },
            { name: 'JavaScript.info', url: 'https://javascript.info', icon: 'fas fa-info-circle' }
          ],
          duration: '4-6 weeks',
          level: 'Beginner'
        }
      ]
    },
    {
      name: 'Frontend Tools',
      id: 'tools',
      icon: 'fas fa-tools',
      steps: [
        {
          id: 'git',
          title: 'Git & Version Control',
          icon: 'fab fa-git-alt',
          color: '#f05032',
          backgroundColor: '#feece8',
          description: 'Version control and collaboration with Git',
          skills: ['Git Commands', 'Branching', 'Merging', 'GitHub/GitLab'],
          resources: [
            { name: 'Pro Git Book', url: 'https://git-scm.com/book', icon: 'fas fa-book' },
            { name: 'GitHub Learning Lab', url: 'https://lab.github.com', icon: 'fab fa-github' },
            { name: 'Learn Git Branching', url: 'https://learngitbranching.js.org', icon: 'fas fa-code-branch' }
          ],
          duration: '2-3 weeks',
          level: 'Beginner'
        },
        {
          id: 'npm',
          title: 'Package Managers',
          icon: 'fab fa-npm',
          color: '#cb3837',
          backgroundColor: '#ffebee',
          description: 'Working with npm/yarn and package management',
          skills: ['npm/yarn', 'package.json', 'Dependencies', 'Scripts'],
          resources: [
            { name: 'npm Docs', url: 'https://docs.npmjs.com', icon: 'fas fa-book' },
            { name: 'Yarn Docs', url: 'https://yarnpkg.com/getting-started', icon: 'fas fa-book' }
          ],
          duration: '1-2 weeks',
          level: 'Beginner'
        },
        {
          id: 'build-tools',
          title: 'Build Tools',
          icon: 'fas fa-cogs',
          color: '#4db6ac',
          backgroundColor: '#e0f2f1',
          description: 'Modern JavaScript build tools and bundlers',
          skills: ['Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier'],
          resources: [
            { name: 'Webpack Guide', url: 'https://webpack.js.org/guides/', icon: 'fas fa-book' },
            { name: 'Vite Docs', url: 'https://vitejs.dev/guide/', icon: 'fas fa-bolt' }
          ],
          duration: '2-3 weeks',
          level: 'Intermediate'
        }
      ]
    },
    {
      name: 'Frontend Frameworks',
      id: 'frameworks',
      icon: 'fas fa-layer-group',
      steps: [
        {
          id: 'react',
          title: 'React',
          icon: 'fab fa-react',
          color: '#61dafb',
          backgroundColor: '#e6f7ff',
          description: 'Building user interfaces with React',
          skills: ['Components', 'Hooks', 'Context', 'JSX', 'React Router'],
          resources: [
            { name: 'React Docs', url: 'https://react.dev', icon: 'fas fa-book' },
            { name: 'React Tutorial', url: 'https://react-tutorial.app', icon: 'fas fa-graduation-cap' }
          ],
          duration: '4-6 weeks',
          level: 'Intermediate'
        },
        {
          id: 'vue',
          title: 'Vue.js',
          icon: 'fab fa-vuejs',
          color: '#42b883',
          backgroundColor: '#e8f5e9',
          description: 'The progressive JavaScript framework',
          skills: ['Components', 'Directives', 'Vuex', 'Composition API'],
          resources: [
            { name: 'Vue Docs', url: 'https://vuejs.org/guide/introduction.html', icon: 'fas fa-book' },
            { name: 'Vue Mastery', url: 'https://www.vuemastery.com', icon: 'fas fa-graduation-cap' }
          ],
          duration: '3-5 weeks',
          level: 'Intermediate'
        },
        {
          id: 'angular',
          title: 'Angular',
          icon: 'fab fa-angular',
          color: '#dd0031',
          backgroundColor: '#ffebee',
          description: 'Platform for building web applications',
          skills: ['Components', 'Directives', 'Services', 'RxJS', 'Dependency Injection'],
          resources: [
            { name: 'Angular Docs', url: 'https://angular.io/docs', icon: 'fas fa-book' },
            { name: 'Angular University', url: 'https://angular-university.io', icon: 'fas fa-graduation-cap' }
          ],
          duration: '4-6 weeks',
          level: 'Intermediate'
        }
      ]
    },
    {
      name: 'Advanced Topics',
      id: 'advanced',
      icon: 'fas fa-brain',
      steps: [
        {
          id: 'typescript',
          title: 'TypeScript',
          icon: 'fas fa-code',
          color: '#3178c6',
          backgroundColor: '#e6f0ff',
          description: 'Typed superset of JavaScript',
          skills: ['Types', 'Interfaces', 'Generics', 'Decorators', 'Utility Types'],
          resources: [
            { name: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/', icon: 'fas fa-book' },
            { name: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript/', icon: 'fas fa-database' }
          ],
          duration: '3-4 weeks',
          level: 'Intermediate'
        },
        {
          id: 'state-management',
          title: 'State Management',
          icon: 'fas fa-project-diagram',
          color: '#6a1b9a',
          backgroundColor: '#f3e5f5',
          description: 'Managing complex application state',
          skills: ['Redux', 'Context API', 'MobX', 'NgRx', 'Pinia'],
          resources: [
            { name: 'Redux Docs', url: 'https://redux.js.org', icon: 'fas fa-book' },
            { name: 'NgRx Docs', url: 'https://ngrx.io/docs', icon: 'fas fa-book' }
          ],
          duration: '3-5 weeks',
          level: 'Advanced'
        },
        {
          id: 'testing',
          title: 'Testing',
          icon: 'fas fa-vial',
          color: '#388e3c',
          backgroundColor: '#e8f5e9',
          description: 'Frontend testing methodologies',
          skills: ['Jest', 'Testing Library', 'Cypress', 'Vitest', 'Test Coverage'],
          resources: [
            { name: 'Testing Library', url: 'https://testing-library.com', icon: 'fas fa-vial' },
            { name: 'Jest Docs', url: 'https://jestjs.io', icon: 'fas fa-book' },
            { name: 'Cypress Docs', url: 'https://docs.cypress.io', icon: 'fas fa-book' }
          ],
          duration: '3-4 weeks',
          level: 'Intermediate'
        }
      ]
    },
    {
      name: 'Performance & Optimization',
      id: 'performance',
      icon: 'fas fa-tachometer-alt',
      steps: [
        {
          id: 'web-performance',
          title: 'Web Performance',
          icon: 'fas fa-stopwatch',
          color: '#ff7043',
          backgroundColor: '#fff3e0',
          description: 'Optimizing frontend performance',
          skills: ['Lazy Loading', 'Code Splitting', 'Caching', 'Bundle Analysis'],
          resources: [
            { name: 'Web.dev Performance', url: 'https://web.dev/learn/#performance', icon: 'fas fa-book' },
            { name: 'Lighthouse', url: 'https://developer.chrome.com/docs/lighthouse/overview/', icon: 'fas fa-search' }
          ],
          duration: '2-3 weeks',
          level: 'Advanced'
        },
        {
          id: 'web-security',
          title: 'Web Security',
          icon: 'fas fa-shield-alt',
          color: '#0288d1',
          backgroundColor: '#e3f2fd',
          description: 'Frontend security best practices',
          skills: ['CORS', 'CSRF', 'XSS', 'Content Security Policy'],
          resources: [
            { name: 'OWASP Security', url: 'https://owasp.org/www-project-top-ten/', icon: 'fas fa-shield-alt' },
            { name: 'Security Checklist', url: 'https://web.dev/security/', icon: 'fas fa-check-circle' }
          ],
          duration: '2-3 weeks',
          level: 'Advanced'
        }
      ]
    },
    {
      name: 'Modern CSS',
      id: 'modern-css',
      icon: 'fas fa-paint-brush',
      steps: [
        {
          id: 'css-frameworks',
          title: 'CSS Frameworks',
          icon: 'fab fa-css3-alt',
          color: '#2196f3',
          backgroundColor: '#e3f2fd',
          description: 'Working with CSS frameworks and methodologies',
          skills: ['Tailwind CSS', 'Bootstrap', 'CSS-in-JS', 'BEM', 'Utility-First'],
          resources: [
            { name: 'Tailwind Docs', url: 'https://tailwindcss.com/docs', icon: 'fas fa-book' },
            { name: 'Bootstrap Docs', url: 'https://getbootstrap.com/docs', icon: 'fas fa-book' }
          ],
          duration: '2-3 weeks',
          level: 'Intermediate'
        },
        {
          id: 'design-systems',
          title: 'Design Systems',
          icon: 'fas fa-swatchbook',
          color: '#7b1fa2',
          backgroundColor: '#f3e5f5',
          description: 'Building and maintaining design systems',
          skills: ['Storybook', 'Component Libraries', 'Design Tokens', 'Theming'],
          resources: [
            { name: 'Storybook', url: 'https://storybook.js.org', icon: 'fas fa-book' },
            { name: 'Design Systems Repo', url: 'https://designsystemsrepo.com', icon: 'fas fa-bookmark' }
          ],
          duration: '3-4 weeks',
          level: 'Advanced'
        }
      ]
    }
  ];
  get filteredStages() {
    let filtered = this.stages;

    // Apply search filter if there's a query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.map(stage => ({
        ...stage,
        steps: stage.steps.filter(step =>
          step.title.toLowerCase().includes(query) ||
          step.description.toLowerCase().includes(query) ||
          step.skills.some(skill => skill.toLowerCase().includes(query))
        )
      })).filter(stage => stage.steps.length > 0);
    }

    // Apply status filter
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

  filterStages(): void {
    // No need to modify this.stages directly, we'll handle filtering in the getter
    // Just trigger change detection by updating a property
    this.searchQuery = this.searchQuery; // This will trigger the filteredStages getter
  }
  private getStepStatus(stepId: string): StepStatus {
    if (this.completedSteps.includes(stepId)) {
      return 'completed';
    }
    return 'not-started';
  }
  get totalSteps(): number {
    return this.stages.reduce((total, stage) => total + stage.steps.length, 0);
  }

  toggleStep(stepId: string): void {
    this.activeStep = this.activeStep === stepId ? null : stepId;
  }
  toggleStage(stageId: string): void {
    this.activeStage = this.activeStage === stageId ? null : stageId;
  }
  toggleInProgress(stepId: string): void {
    const index = this.inProgressSteps.indexOf(stepId);

    if (index === -1) {
      // Add to in-progress
      this.inProgressSteps.push(stepId);

      // Remove from completed if it was there
      this.completedSteps = this.completedSteps.filter(id => id !== stepId);
    } else {
      // Remove from in-progress
      this.inProgressSteps.splice(index, 1);
    }

    // Optional: Close the step details after marking
    if (this.activeStep === stepId) {
      this.activeStep = null;
    }
  }
  toggleViewMode(): void {
    this.isCompactView = !this.isCompactView;
    this.activeStep = null;
    this.activeStage = null;
  }

  toggleComplete(stepId: string): void {
    const index = this.completedSteps.indexOf(stepId);
    if (index === -1) {
      this.completedSteps.push(stepId);
    } else {
      this.completedSteps.splice(index, 1);
    }
  }
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

  // Add to your component class
  expandedSections: { [key: string]: boolean } = {
    foundation: true,
    core: true,
    internet: true,
    vcs: true
  };

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }
  isSectionExpanded(section: string): boolean {
    return this.expandedSections[section];
  }
  isStepCompleted(stepId: string): boolean {
    return this.completedSteps.includes(stepId);
  }
  isStepActive(stepId: string): boolean {
    return this.activeStep === stepId;
  }
  isStageActive(stageId: string): boolean {
    return this.activeStage === stageId;
  }
  toggleAllSteps() {
    this.allStepsVisible = !this.allStepsVisible;
  }
  toggleAllStages() {
    this.allStagesVisible = !this.allStagesVisible;
  }
  // Track step progress
  startStep(stepId: string): void {
    // Only add to in-progress if not already started or completed
    if (!this.inProgressSteps.includes(stepId) && !this.completedSteps.includes(stepId)) {
      this.inProgressSteps.push(stepId);
    }
  }

  completeStep(stepId: string): void {
    // Only complete if it was in progress
    if (this.inProgressSteps.includes(stepId)) {
      // Remove from in-progress
      this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
      // Add to completed (if not already there)
      if (!this.completedSteps.includes(stepId)) {
        this.completedSteps.push(stepId);
      }
    }
  }

  resetStep(stepId: string): void {
    // Reset to "Not Started" state
    this.inProgressSteps = this.inProgressSteps.filter(id => id !== stepId);
    this.completedSteps = this.completedSteps.filter(id => id !== stepId);
  }
}
