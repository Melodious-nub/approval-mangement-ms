import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RequisitionService } from '../../../core/services/requisition.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { Requisition } from '../../../core/models/requisition.model';
import { User } from '../../../core/models/user.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ApproverTimelineComponent } from '../../../shared/components/approver-timeline/approver-timeline.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-requisition-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ApproverTimelineComponent, LoadingSpinnerComponent],
  templateUrl: './requisition-detail.component.html',
  styleUrl: './requisition-detail.component.scss'
})
export class RequisitionDetailComponent implements OnInit {
  requisition: Requisition | null = null;
  creator: User | null = null;
  accountsPerson: User | null = null;
  currentUserId: string | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  remarks: string = '';
  approverNames: { [id: string]: string } = {};

  approvalForm: FormGroup;
  canApprove: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requisitionService: RequisitionService,
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService,
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

    // Load accounts person if exists
    if (requisition.accountsPersonId) {
      this.userService.getUserById(requisition.accountsPersonId).subscribe(user => {
        this.accountsPerson = user;
      });
    }

    // Load approver names for remarks display
    requisition.approvalHistory.forEach(action => {
      this.userService.getUserById(action.approverId).subscribe(user => {
        if (user) {
          this.approverNames[action.approverId] = user.name;
        }
      });
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

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  approve(): void {
    if (this.approvalForm.invalid || !this.requisition || !this.currentUserId) {
      return;
    }

    this.alertService.confirm(
      'Approve Requisition',
      'Are you sure you want to approve this requisition?',
      'Approve',
      'Cancel'
    ).then((result) => {
      if (result.isConfirmed) {
        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';

        const comment = this.approvalForm.get('comment')?.value;

        this.requisitionService.approveRequisition(this.requisition!.id, this.currentUserId!, comment).subscribe({
          next: (requisition) => {
            this.requisition = requisition;
            this.approvalForm.reset();
            this.checkCanApprove();
            this.alertService.success('Success', 'Requisition approved successfully');
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error approving requisition:', error);
            this.errorMessage = error.message || 'Failed to approve requisition';
            this.alertService.error('Error', this.errorMessage);
            this.isSubmitting = false;
          }
        });
      }
    });
  }

  reject(): void {
    if (this.approvalForm.invalid || !this.requisition || !this.currentUserId) {
      return;
    }

    this.alertService.confirm(
      'Reject Requisition',
      'Are you sure you want to reject this requisition?',
      'Reject',
      'Cancel'
    ).then((result) => {
      if (result.isConfirmed) {
        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';

        const comment = this.approvalForm.get('comment')?.value;

        this.requisitionService.rejectRequisition(this.requisition!.id, this.currentUserId!, comment).subscribe({
          next: (requisition) => {
            this.requisition = requisition;
            this.approvalForm.reset();
            this.checkCanApprove();
            this.alertService.success('Success', 'Requisition rejected');
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error rejecting requisition:', error);
            this.errorMessage = error.message || 'Failed to reject requisition';
            this.alertService.error('Error', this.errorMessage);
            this.isSubmitting = false;
          }
        });
      }
    });
  }

  requestForChange(): void {
    // TODO: Implement request for change functionality
    this.alertService.info('Coming Soon', 'Request for Change feature will be available soon.');
  }

  print(): void {
    window.print();
  }

  getApproverName(approverId: string): string {
    return this.approverNames[approverId] || 'Loading...';
  }
}

