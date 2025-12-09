import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequisitionService } from '../../core/services/requisition.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Requisition } from '../../core/models/requisition.model';
import { User } from '../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  myRequisitions: Requisition[] = [];
  assignedRequisitions: Requisition[] = [];
  isLoading: boolean = true;
  users: User[] = [];

  // Counters
  pendingApprovalsCount: number = 0;
  myRequisitionsPending: number = 0;
  myRequisitionsApproved: number = 0;
  myRequisitionsRejected: number = 0;

  // Computed properties for pending approvals
  get pendingRequisitions(): Requisition[] {
    return this.assignedRequisitions.filter(r => r.status === 'Pending');
  }

  get pendingRequisitionsCount(): number {
    return this.pendingRequisitions.length;
  }

  constructor(
    private requisitionService: RequisitionService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Load users for name lookup
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadData(user.id);
      }
    });
  }

  loadData(userId: string): void {
    this.isLoading = true;

    // Load my requisitions
    this.requisitionService.getMyRequisitions(userId).subscribe(requisitions => {
      this.myRequisitions = requisitions;
      this.calculateMyRequisitionsCounts();
      this.checkLoadingComplete();
    });

    // Load assigned requisitions
    this.requisitionService.getAssignedRequisitions(userId).subscribe(requisitions => {
      this.assignedRequisitions = requisitions;
      this.pendingApprovalsCount = requisitions.filter(r => r.status === 'Pending').length;
      this.checkLoadingComplete();
    });
  }

  checkLoadingComplete(): void {
    // Simple check - in real app, use combineLatest or forkJoin
    if (this.myRequisitions.length >= 0 && this.assignedRequisitions.length >= 0) {
      this.isLoading = false;
    }
  }

  calculateMyRequisitionsCounts(): void {
    this.myRequisitionsPending = this.myRequisitions.filter(r => r.status === 'Pending').length;
    this.myRequisitionsApproved = this.myRequisitions.filter(r => r.status === 'Approved').length;
    this.myRequisitionsRejected = this.myRequisitions.filter(r => r.status === 'Rejected').length;
  }

  getCreatorName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  }
}

