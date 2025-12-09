import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RequisitionService } from '../../../core/services/requisition.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Requisition, RequisitionStatus } from '../../../core/models/requisition.model';
import { User } from '../../../core/models/user.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-approvals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, StatusBadgeComponent, PriorityBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './my-approvals.component.html',
  styleUrl: './my-approvals.component.scss'
})
export class MyApprovalsComponent implements OnInit {
  requisitions: Requisition[] = [];
  filteredRequisitions: Requisition[] = [];
  creators: { [key: string]: User } = {};
  isLoading: boolean = true;
  statusFilter: RequisitionStatus | 'all' = 'all';
  currentUserId: string | null = null;

  statuses: (RequisitionStatus | 'all')[] = ['all', 'Pending', 'Approved', 'Rejected'];

  // Approval form state
  selectedRequisitionId: string | null = null;
  approvalForm: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private requisitionService: RequisitionService,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.approvalForm = this.fb.group({
      comment: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.loadRequisitions();
      }
    });
  }

  loadRequisitions(): void {
    if (!this.currentUserId) return;

    this.isLoading = true;
    this.requisitionService.getAssignedRequisitions(this.currentUserId).subscribe({
      next: (requisitions) => {
        this.requisitions = requisitions;
        this.loadCreators();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requisitions:', error);
        this.isLoading = false;
      }
    });
  }

  loadCreators(): void {
    const creatorIds = [...new Set(this.requisitions.map(r => r.createdBy))];
    creatorIds.forEach(id => {
      this.userService.getUserById(id).subscribe(user => {
        if (user) {
          this.creators[id] = user;
        }
      });
    });
  }

  applyFilters(): void {
    let filtered = [...this.requisitions];

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === this.statusFilter);
    }

    this.filteredRequisitions = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  canApprove(requisition: Requisition): boolean {
    if (!this.currentUserId || requisition.status !== 'Pending') {
      return false;
    }

    const isAssigned = requisition.assignedApprovers.includes(this.currentUserId);
    const hasAlreadyActed = requisition.approvalHistory.some(
      action => action.approverId === this.currentUserId
    );

    return isAssigned && !hasAlreadyActed;
  }

  openApprovalForm(requisitionId: string): void {
    this.selectedRequisitionId = requisitionId;
    this.approvalForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeApprovalForm(): void {
    this.selectedRequisitionId = null;
    this.approvalForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  approve(): void {
    if (this.approvalForm.invalid || !this.selectedRequisitionId || !this.currentUserId) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const comment = this.approvalForm.get('comment')?.value;

    this.requisitionService.approveRequisition(this.selectedRequisitionId, this.currentUserId, comment).subscribe({
      next: () => {
        this.closeApprovalForm();
        this.loadRequisitions();
        this.successMessage = 'Requisition approved successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error approving requisition:', error);
        this.errorMessage = error.message || 'Failed to approve requisition';
        this.isSubmitting = false;
      }
    });
  }

  reject(): void {
    if (this.approvalForm.invalid || !this.selectedRequisitionId || !this.currentUserId) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const comment = this.approvalForm.get('comment')?.value;

    this.requisitionService.rejectRequisition(this.selectedRequisitionId, this.currentUserId, comment).subscribe({
      next: () => {
        this.closeApprovalForm();
        this.loadRequisitions();
        this.successMessage = 'Requisition rejected';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error rejecting requisition:', error);
        this.errorMessage = error.message || 'Failed to reject requisition';
        this.isSubmitting = false;
      }
    });
  }

  getCreatorName(createdBy: string): string {
    return this.creators[createdBy]?.name || 'Unknown';
  }

  hasUserActed(requisition: Requisition): boolean {
    if (!this.currentUserId) return false;
    return requisition.approvalHistory.some(action => action.approverId === this.currentUserId);
  }

  getUserAction(requisition: Requisition): string {
    if (!this.currentUserId) return '';
    const action = requisition.approvalHistory.find(a => a.approverId === this.currentUserId);
    return action ? action.action : '';
  }
}

