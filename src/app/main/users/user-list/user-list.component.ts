import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AlertService } from '../../../core/services/alert.service';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  activeFilter: 'all' | 'active' | 'inactive' = 'all';

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Apply active/inactive filter
    if (this.activeFilter === 'active') {
      filtered = filtered.filter(user => user.active);
    } else if (this.activeFilter === 'inactive') {
      filtered = filtered.filter(user => !user.active);
    }

    this.filteredUsers = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  deactivateUser(userId: string): void {
    this.alertService.confirm(
      'Deactivate User',
      'Are you sure you want to deactivate this user?',
      'Deactivate',
      'Cancel'
    ).then((result) => {
      if (result.isConfirmed) {
        this.userService.deactivateUser(userId).subscribe({
          next: () => {
            this.loadUsers();
            this.alertService.success('Success', 'User deactivated successfully');
          },
          error: (error) => {
            console.error('Error deactivating user:', error);
            this.alertService.error('Error', 'Failed to deactivate user');
          }
        });
      }
    });
  }
}

