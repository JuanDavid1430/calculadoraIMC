import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  
  // Rutas protegidas
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'calculator',
        loadComponent: () => import('./components/calculator/calculator.component').then(m => m.CalculatorComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent)
      },
      {
        path: 'recommendations',
        loadComponent: () => import('./components/recommendations/recommendations.component').then(m => m.RecommendationsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: '',
        redirectTo: '/dashboard/calculator',
        pathMatch: 'full'
      }
    ]
  },
  
  // Redirecciones
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
