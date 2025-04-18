import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./About/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'select-university',
    loadComponent: () => import('./university/selcet-university/selcet-university.component').then((m) => m.SelectUniversityComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'features',
    loadComponent: () => import('./About/features/features.component').then((m) => m.FeaturesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'career-path',
    loadComponent: () => import('./carer-path/components/carer/carer.component').then((m) => m.CarerComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./carer-path/components/roadmap/roadmap.component').then((m) => m.RoadmapComponent),
    canActivate: [AuthGuard]
  }
];
