import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RequisitionService } from '../../../core/services/requisition.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Requisition } from '../../../core/models/requisition.model';
import { User } from '../../../core/models/user.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../shared/components/priority-badge/priority-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-requisition-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StatusBadgeComponent, PriorityBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './requisition-detail.component.html',
  styleUrl: './requisition-detail.component.scss'
})
export class RequisitionDetailComponent implements OnInit {
  requisition: Requisition | null = null;
  creator: User | null = null;
  approvers: User[] = [];
  currentUserId: string | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  approvalForm: FormGroup;
  canApprove: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
      }
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadRequisition(id);
      }
    });
  }

  loadRequisition(id: string): void {
    this.isLoading = true;
    this.requisitionService.getRequisitionById(id).subscribe({
      next: (requisition) => {
        this.requisition = requisition;
        if (requisition) {
          this.loadUsers(requisition);
          this.checkCanApprove();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requisition:', error);
        this.isLoading = false;
      }
    });
  }

  loadUsers(requisition: Requisition): void {
    // Load creator
    this.userService.getUserById(requisition.createdBy).subscribe(user => {
      this.creator = user;
    });

    // Load approvers
    const approverPromises = requisition.assignedApprovers.map(id =>
      this.userService.getUserById(id).toPromise()
    );

    Promise.all(approverPromises).then(users => {
      this.approvers = users.filter(u => u !== null) as User[];
    });
  }

  checkCanApprove(): void {
    if (!this.requisition || !this.currentUserId) {
      this.canApprove = false;
      return;
    }

    // Check if current user is assigned as approver
    const isAssigned = this.requisition.assignedApprovers.includes(this.currentUserId);
    
    // Check if status is Pending
    const isPending = this.requisition.status === 'Pending';

    // Check if user hasn't already approved/rejected
    const hasAlreadyActed = this.requisition.approvalHistory.some(
      action => action.approverId === this.currentUserId
    );

    this.canApprove = isAssigned && isPending && !hasAlreadyActed;
  }

  approve(): void {
    if (this.approvalForm.invalid || !this.requisition || !this.currentUserId) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const comment = this.approvalForm.get('comment')?.value;

    this.requisitionService.approveRequisition(this.requisition.id, this.currentUserId, comment).subscribe({
      next: (requisition) => {
        this.requisition = requisition;
        this.approvalForm.reset();
        this.checkCanApprove();
        this.successMessage = 'Requisition approved successfully';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error approving requisition:', error);
        this.errorMessage = error.message || 'Failed to approve requisition';
        this.isSubmitting = false;
      }
    });
  }

  reject(): void {
    if (this.approvalForm.invalid || !this.requisition || !this.currentUserId) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const comment = this.approvalForm.get('comment')?.value;

    this.requisitionService.rejectRequisition(this.requisition.id, this.currentUserId, comment).subscribe({
      next: (requisition) => {
        this.requisition = requisition;
        this.approvalForm.reset();
        this.checkCanApprove();
        this.successMessage = 'Requisition rejected';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error rejecting requisition:', error);
        this.errorMessage = error.message || 'Failed to reject requisition';
        this.isSubmitting = false;
      }
    });
  }

  getApproverName(approverId: string): string {
    const approver = this.approvers.find(a => a.id === approverId);
    return approver ? approver.name : 'Unknown';
  }

  hasApproverActed(approverId: string): boolean {
    if (!this.requisition) return false;
    return this.requisition.approvalHistory.some(a => a.approverId === approverId);
  }

  getApproverAction(approverId: string): string {
    if (!this.requisition) return '';
    const action = this.requisition.approvalHistory.find(a => a.approverId === approverId);
    return action ? action.action : '';
  }
}

