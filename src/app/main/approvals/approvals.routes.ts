import { Routes } from '@angular/router';

export const approvalsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./my-approvals/my-approvals.component').then(m => m.MyApprovalsComponent)
  }
];

