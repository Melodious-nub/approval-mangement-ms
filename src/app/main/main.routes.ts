import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from '../core/guards/auth.guard';

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.usersRoutes)
      },
      {
        path: 'requisitions',
        loadChildren: () => import('./requisitions/requisitions.routes').then(m => m.requisitionsRoutes)
      },
      {
        path: 'approvals',
        loadChildren: () => import('./approvals/approvals.routes').then(m => m.approvalsRoutes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

