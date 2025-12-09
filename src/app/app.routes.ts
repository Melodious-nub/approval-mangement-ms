import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.routes').then(m => m.mainRoutes)
  },
  {
    path: '',
    redirectTo: '/main/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/main/dashboard'
  }
];
