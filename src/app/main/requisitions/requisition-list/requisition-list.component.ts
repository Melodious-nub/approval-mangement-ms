import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequisitionService } from '../../../core/services/requisition.service';
import { AuthService } from '../../../core/services/auth.service';
import { Requisition, RequisitionStatus } from '../../../core/models/requisition.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-requisition-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './requisition-list.component.html',
  styleUrl: './requisition-list.component.scss'
})
export class RequisitionListComponent implements OnInit {
  requisitions: Requisition[] = [];
  filteredRequisitions: Requisition[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  statusFilter: RequisitionStatus | 'all' = 'all';
  currentUserId: string | null = null;
  openActionMenuId: string | null = null;

  statuses: (RequisitionStatus | 'all')[] = ['all', 'Draft', 'Pending', 'Approved', 'Rejected'];

  constructor(
    private requisitionService: RequisitionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });
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
      filtered = filtered.filter(req => 
        req.subject.toLowerCase().includes(term) ||
        req.referenceNumber.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === this.statusFilter);
    }

    this.filteredRequisitions = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  toggleActionMenu(requisitionId: string): void {
    this.openActionMenuId = this.openActionMenuId === requisitionId ? null : requisitionId;
  }

  closeActionMenu(): void {
    this.openActionMenuId = null;
  }

  canApprove(requisition: Requisition): boolean {
    if (!this.currentUserId || requisition.status !== 'Pending') {
      return false;
    }
    const isAssigned = requisition.assignedApprovers.includes(this.currentUserId);
    const hasActed = requisition.approvalHistory.some(a => a.approverId === this.currentUserId);
    return isAssigned && !hasActed;
  }

  isLastRow(requisitionId: string): boolean {
    if (this.filteredRequisitions.length === 0) {
      return false;
    }
    const lastIndex = this.filteredRequisitions.length - 1;
    const currentIndex = this.filteredRequisitions.findIndex(r => r.id === requisitionId);
    // Show dropdown above if it's in the last 2 rows
    return currentIndex >= lastIndex - 1 && currentIndex >= 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Check if click is outside any action menu button or dropdown
    const isClickInsideActionMenu = target.closest('.action-menu-container') !== null;
    if (!isClickInsideActionMenu && this.openActionMenuId !== null) {
      this.closeActionMenu();
    }
  }
}

