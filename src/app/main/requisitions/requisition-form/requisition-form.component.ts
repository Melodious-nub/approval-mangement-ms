import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RequisitionService } from '../../../core/services/requisition.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Requisition } from '../../../core/models/requisition.model';
import { FileAttachment } from '../../../core/models/file-attachment.model';
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
  referenceNumber: string = '';
  includeAccountsPerson: boolean = false;
  selectedFiles: FileAttachment[] = [];
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private requisitionService: RequisitionService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.requisitionForm = this.fb.group({
      referenceNumber: [{ value: '', disabled: true }],
      date: [new Date(), [Validators.required]],
      subject: ['', [Validators.required]],
      tinNumber: ['', [Validators.required]],
      binNid: ['', [Validators.required]],
      summary: ['', [Validators.required]],
      budget: [null],
      includeAccountsPerson: [false],
      accountsPersonId: [null],
      assignedApprovers: this.fb.array([], [Validators.required]),
      attachedFiles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Set max date to today
    this.maxDate = new Date().toISOString().split('T')[0];
    
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
      } else {
        // Generate reference number for new requisition
        this.generateReferenceNumber();
      }
    });

    // Watch for accounts person checkbox changes
    this.requisitionForm.get('includeAccountsPerson')?.valueChanges.subscribe(value => {
      this.includeAccountsPerson = value;
      if (!value) {
        this.requisitionForm.get('accountsPersonId')?.setValue(null);
      }
    });
  }

  loadActiveUsers(): void {
    this.userService.getActiveUsers().subscribe(users => {
      this.activeUsers = users.filter(u => u.id !== this.currentUserId);
    });
  }

  generateReferenceNumber(): void {
    // Generate format: MEMO-YYYY-NNN
    const currentYear = new Date().getFullYear();
    this.requisitionService.getRequisitions().subscribe(requisitions => {
      const yearRequisitions = requisitions.filter(r => {
        const reqYear = new Date(r.createdAt).getFullYear();
        return reqYear === currentYear;
      });
      const nextNumber = (yearRequisitions.length + 1).toString().padStart(3, '0');
      this.referenceNumber = `MEMO-${currentYear}-${nextNumber}`;
      this.requisitionForm.get('referenceNumber')?.setValue(this.referenceNumber);
    });
  }

  loadRequisition(id: string): void {
    this.isLoading = true;
    this.requisitionService.getRequisitionById(id).subscribe({
      next: (requisition) => {
        if (requisition) {
          this.referenceNumber = requisition.referenceNumber;
          this.includeAccountsPerson = !!requisition.accountsPersonId;
          this.selectedFiles = requisition.attachedFiles || [];
          
          this.requisitionForm.patchValue({
            referenceNumber: requisition.referenceNumber,
            date: requisition.date ? new Date(requisition.date) : new Date(),
            subject: requisition.subject,
            tinNumber: requisition.tinNumber,
            binNid: requisition.binNid,
            summary: requisition.summary,
            budget: requisition.budget,
            includeAccountsPerson: !!requisition.accountsPersonId,
            accountsPersonId: requisition.accountsPersonId
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

  addApprover(userId: string): void {
    if (!userId || this.approversFormArray.value.includes(userId)) {
      return;
    }
    this.approversFormArray.push(this.fb.control(userId));
  }

  removeApprover(index: number): void {
    this.approversFormArray.removeAt(index);
  }

  getSelectedApprovers(): User[] {
    const selectedIds = this.approversFormArray.value;
    return this.activeUsers.filter(u => selectedIds.includes(u.id));
  }

  getAvailableApprovers(): User[] {
    const selectedIds = this.approversFormArray.value;
    return this.activeUsers.filter(u => !selectedIds.includes(u.id));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Mock file handling - just add file metadata
      Array.from(input.files).forEach(file => {
        const fileAttachment: FileAttachment = {
          id: `file_${Date.now()}_${Math.random()}`,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date(),
          fileType: file.type || file.name.split('.').pop()
        };
        this.selectedFiles.push(fileAttachment);
      });
      // Reset input
      input.value = '';
    }
  }

  removeFile(fileId: string): void {
    this.selectedFiles = this.selectedFiles.filter(f => f.id !== fileId);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  onSubmit(isDraft: boolean = false): void {
    if (!isDraft && this.requisitionForm.invalid) {
      this.requisitionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (!this.currentUserId) {
      this.errorMessage = 'User not found';
      this.isLoading = false;
      return;
    }

    const formValue = this.requisitionForm.getRawValue();
    const requisitionData: Partial<Requisition> = {
      referenceNumber: formValue.referenceNumber || this.referenceNumber,
      date: formValue.date,
      subject: formValue.subject,
      tinNumber: formValue.tinNumber,
      binNid: formValue.binNid,
      summary: formValue.summary,
      accountsPersonId: formValue.includeAccountsPerson ? formValue.accountsPersonId : null,
      assignedApprovers: formValue.assignedApprovers || [],
      attachedFiles: this.selectedFiles,
      createdBy: this.currentUserId,
      status: isDraft ? 'Draft' as const : 'Pending' as const
    };

    if (isDraft) {
      // For draft, approvers can be empty
      if (!requisitionData.assignedApprovers || requisitionData.assignedApprovers.length === 0) {
        requisitionData.assignedApprovers = [];
      }
    } else {
      // For submission, approvers are required
      if (!requisitionData.assignedApprovers || requisitionData.assignedApprovers.length === 0) {
        this.errorMessage = 'At least one approver is required';
        this.isLoading = false;
        return;
      }
    }

    if (this.isEditMode && this.requisitionId) {
      this.requisitionService.updateRequisition(this.requisitionId, requisitionData).subscribe({
        next: () => {
          this.router.navigate(['/main/requisitions']);
        },
        error: (error) => {
          console.error('Error updating requisition:', error);
          this.errorMessage = error.message || 'Failed to update requisition';
          this.isLoading = false;
        }
      });
    } else {
      this.requisitionService.createRequisition(requisitionData as Omit<Requisition, 'id' | 'createdAt' | 'approvalHistory'>).subscribe({
        next: () => {
          this.router.navigate(['/main/requisitions']);
        },
        error: (error) => {
          console.error('Error creating requisition:', error);
          this.errorMessage = error.message || 'Failed to create requisition';
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/main/requisitions']);
  }
}

