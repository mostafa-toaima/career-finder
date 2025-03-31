import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


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
    loadComponent: () => import('./auth/components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./auth/components/sign-up/sign-up.component').then((m) => m.SignUpComponent)
  },
  {
    path: 'select-university',
    loadComponent: () => import('./university/selcet-university/selcet-university.component').then((m) => m.SelcetUniversityComponent),
    canActivate: [AuthGuard] // Protected
  },
  {
    path: 'features',
    loadComponent: () => import('./About/features/features.component').then((m) => m.FeaturesComponent)
  },
  {
    path: 'career-path',
    loadComponent: () => import('./carer-path/components/carer/carer.component').then((m) => m.CarerComponent),
    canActivate: [AuthGuard] // Protected
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./carer-path/components/roadmap/roadmap.component').then((m) => m.RoadmapComponent),
    canActivate: [AuthGuard] // Protected
  }
];
