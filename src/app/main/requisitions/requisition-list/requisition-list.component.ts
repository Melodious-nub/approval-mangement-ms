import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequisitionService } from '../../../core/services/requisition.service';
import { Requisition, RequisitionStatus, RequisitionPriority } from '../../../core/models/requisition.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-requisition-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent, PriorityBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './requisition-list.component.html',
  styleUrl: './requisition-list.component.scss'
})
export class RequisitionListComponent implements OnInit {
  requisitions: Requisition[] = [];
  filteredRequisitions: Requisition[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  statusFilter: RequisitionStatus | 'all' = 'all';
  priorityFilter: RequisitionPriority | 'all' = 'all';

  statuses: (RequisitionStatus | 'all')[] = ['all', 'Draft', 'Pending', 'Approved', 'Rejected'];
  priorities: (RequisitionPriority | 'all')[] = ['all', 'Low', 'Medium', 'High'];

  constructor(private requisitionService: RequisitionService) {}

  ngOnInit(): void {
    this.loadRequisitions();
  }

  loadRequisitions(): void {
    this.isLoading = true;
    this.requisitionService.getRequisitions().subscribe({
      next: (requisitions) => {
        this.requisitions = requisitions;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requisitions:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.requisitions];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(req => req.title.toLowerCase().includes(term));
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === this.statusFilter);
    }

    // Apply priority filter
    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter(req => req.priority === this.priorityFilter);
    }

    this.filteredRequisitions = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }
}

