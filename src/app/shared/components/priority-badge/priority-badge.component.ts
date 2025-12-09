import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisitionPriority } from '../../../core/models/requisition.model';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority-badge.component.html',
  styleUrl: './priority-badge.component.scss'
})
export class PriorityBadgeComponent {
  @Input() priority!: RequisitionPriority;

  getPriorityClass(): string {
    const classes: { [key in RequisitionPriority]: string } = {
      'Low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'High': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[this.priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

