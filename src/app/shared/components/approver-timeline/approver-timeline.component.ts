import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Requisition } from '../../../core/models/requisition.model';

@Component({
  selector: 'app-approver-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approver-timeline.component.html',
  styleUrl: './approver-timeline.component.scss'
})
export class ApproverTimelineComponent implements OnInit {
  @Input() requisition!: Requisition;
  approvers: (User & { status: 'Approved' | 'Rejected' | 'Waiting' | 'In Progress'; actionDate?: Date; comment?: string })[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadApprovers();
  }

  loadApprovers(): void {
    const approverPromises = this.requisition.assignedApprovers.map((approverId, index) => {
      return this.userService.getUserById(approverId).toPromise().then(user => {
        if (!user) return null;
        
        const action = this.requisition.approvalHistory.find(a => a.approverId === approverId);
        const hasPreviousApproved = index > 0 && this.requisition.approvalHistory.some(a => 
          a.approverId === this.requisition.assignedApprovers[index - 1] && a.action === 'Approved'
        );
        const isCurrentPending = this.requisition.status === 'Pending' && !action && hasPreviousApproved;
        
        return {
          ...user,
          status: action 
            ? (action.action === 'Approved' ? 'Approved' as const : 'Rejected' as const)
            : (isCurrentPending ? 'In Progress' as const : 'Waiting' as const),
          actionDate: action?.actionDate,
          comment: action?.comment
        };
      });
    });

    Promise.all(approverPromises).then(approvers => {
      this.approvers = approvers.filter(a => a !== null) as typeof this.approvers;
      // Sort by order in assignedApprovers array
      this.approvers.sort((a, b) => {
        const indexA = this.requisition.assignedApprovers.indexOf(a.id);
        const indexB = this.requisition.assignedApprovers.indexOf(b.id);
        return indexA - indexB;
      });
    });
  }

  formatUserId(id: string): string {
    // Extract numeric part from ID (e.g., '1' from 'user_123' or just '1')
    const match = id.match(/\d+/);
    return match ? match[0] : id;
  }
}

