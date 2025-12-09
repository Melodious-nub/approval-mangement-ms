import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RequisitionService } from '../../../core/services/requisition.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Requisition, RequisitionCategory, RequisitionPriority } from '../../../core/models/requisition.model';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-requisition-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './requisition-form.component.html',
  styleUrl: './requisition-form.component.scss'
})
export class RequisitionFormComponent implements OnInit {
  requisitionForm: FormGroup;
  isEditMode: boolean = false;
  requisitionId: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  activeUsers: User[] = [];
  currentUserId: string | null = null;

  categories: RequisitionCategory[] = ['Office Supplies', 'IT Equipment', 'Furniture', 'Utilities', 'Other'];
  priorities: RequisitionPriority[] = ['Low', 'Medium', 'High'];

  constructor(
    private fb: FormBuilder,
    private requisitionService: RequisitionService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.requisitionForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      priority: ['Medium', [Validators.required]],
      assignedApprovers: this.fb.array([], [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadActiveUsers();
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
      }
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.requisitionId = id;
        this.loadRequisition(id);
      }
    });
  }

  loadActiveUsers(): void {
    this.userService.getActiveUsers().subscribe(users => {
      this.activeUsers = users;
    });
  }

  loadRequisition(id: string): void {
    this.isLoading = true;
    this.requisitionService.getRequisitionById(id).subscribe({
      next: (requisition) => {
        if (requisition) {
          this.requisitionForm.patchValue({
            title: requisition.title,
            description: requisition.description,
            category: requisition.category,
            priority: requisition.priority
          });
          // Set approvers
          const approversArray = this.requisitionForm.get('assignedApprovers') as FormArray;
          approversArray.clear();
          requisition.assignedApprovers.forEach(approverId => {
            approversArray.push(this.fb.control(approverId));
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requisition:', error);
        this.errorMessage = 'Failed to load requisition';
        this.isLoading = false;
      }
    });
  }

  get approversFormArray(): FormArray {
    return this.requisitionForm.get('assignedApprovers') as FormArray;
  }

  toggleApprover(userId: string): void {
    const approversArray = this.approversFormArray;
    const index = approversArray.value.indexOf(userId);

    if (index > -1) {
      approversArray.removeAt(index);
    } else {
      approversArray.push(this.fb.control(userId));
    }
  }

  isApproverSelected(userId: string): boolean {
    return this.approversFormArray.value.includes(userId);
  }

  onSubmit(isDraft: boolean = false): void {
    if (!isDraft && this.requisitionForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (!this.currentUserId) {
      this.errorMessage = 'User not found';
      this.isLoading = false;
      return;
    }

    const formValue = this.requisitionForm.value;
    const requisitionData = {
      ...formValue,
      createdBy: this.currentUserId,
      status: isDraft ? 'Draft' as const : 'Pending' as const
    };

    if (isDraft) {
      // For draft, approvers can be empty
      if (!requisitionData.assignedApprovers || requisitionData.assignedApprovers.length === 0) {
        requisitionData.assignedApprovers = [];
      }
    }

    if (this.isEditMode && this.requisitionId) {
      this.requisitionService.updateRequisition(this.requisitionId, requisitionData).subscribe({
        next: () => {
          this.router.navigate(['/main/requisitions']);
        },
        error: (error) => {
          console.error('Error updating requisition:', error);
          this.errorMessage = 'Failed to update requisition';
          this.isLoading = false;
        }
      });
    } else {
      this.requisitionService.createRequisition(requisitionData).subscribe({
        next: () => {
          this.router.navigate(['/main/requisitions']);
        },
        error: (error) => {
          console.error('Error creating requisition:', error);
          this.errorMessage = 'Failed to create requisition';
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/main/requisitions']);
  }
}

