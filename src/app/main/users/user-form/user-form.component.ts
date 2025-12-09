import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.userId = id;
        this.loadUser(id);
      }
    });
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        if (user) {
          this.userForm.patchValue(user);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.errorMessage = 'Failed to load user';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.userForm.value;

    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/main/users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.errorMessage = 'Failed to update user';
          this.isLoading = false;
        }
      });
    } else {
      this.userService.createUser(formValue).subscribe({
        next: () => {
          this.router.navigate(['/main/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.errorMessage = 'Failed to create user';
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/main/users']);
  }
}

