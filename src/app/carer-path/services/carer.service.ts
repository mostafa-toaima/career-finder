import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarerService {

  constructor() { }

  stages = [
    {
      name: 'Web Fundamentals',
      id: 'fundamentals',
      icon: 'fas fa-globe',
      steps: [
        {
          id: 'html5',
          title: 'HTML',
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

  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' }
  ];

}
