import { Routes } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/About/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'build-career',
    loadComponent: () => import('./components/university/components/career-path-selector/career-path-selector.component').then((m) => m.CareerPathSelectorComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'features',
    loadComponent: () => import('./components/About/features/features.component').then((m) => m.FeaturesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'career-path',
    children: [
      {
        path: '',
        redirectTo: 'frontend',
        pathMatch: 'full'
      },
      {
        path: ':trackId',
        loadComponent: () => import('./components/carer-path/components/track/track.component').then((m) => m.TrackComponent),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./components/carer-path/components/roadmap/roadmap.component').then((m) => m.RoadmapComponent),
    canActivate: [AuthGuard]
  }
];
