import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisitionStatus } from '../../../core/models/requisition.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  @Input() status!: RequisitionStatus;

  getStatusClass(): string {
    const classes: { [key in RequisitionStatus]: string } = {
      'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[this.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

