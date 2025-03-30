import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./About/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./About/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./auth/sign-up/sign-up.component').then((m) => m.SignUpComponent)
  },
  {
    path: 'select-university',
    loadComponent: () => import('./university/selcet-university/selcet-university.component').then((m) => m.SelcetUniversityComponent),
  },
  {
    path: 'features',
    loadComponent: () => import('./About/features/features.component').then((m) => m.FeaturesComponent)
  },
  {
    path: 'career-path',
    loadComponent: () => import('./carer-path/components/carer/carer.component').then((m) => m.CarerComponent),
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./carer-path/components/roadmap/roadmap.component').then((m) => m.RoadmapComponent),
  }
];
