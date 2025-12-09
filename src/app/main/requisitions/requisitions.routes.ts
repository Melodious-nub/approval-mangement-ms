import { Routes } from '@angular/router';

export const requisitionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./requisition-list/requisition-list.component').then(m => m.RequisitionListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./requisition-form/requisition-form.component').then(m => m.RequisitionFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./requisition-form/requisition-form.component').then(m => m.RequisitionFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./requisition-detail/requisition-detail.component').then(m => m.RequisitionDetailComponent)
  }
];

