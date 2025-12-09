import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[];

  constructor(private authService: AuthService) {
    // Share dummy users from auth service
    this.users = [...this.authService.getDummyUsers()];
  }

  // TODO: Replace with real API call: GET /api/users
  getUsers(): Observable<User[]> {
    return of(this.users).pipe(
      delay(300), // Simulate API delay
      map(users => [...users]) // Return copy
    );
  }

  // TODO: Replace with real API call: GET /api/users/:id
  getUserById(id: string): Observable<User | null> {
    return of(null).pipe(
      delay(200), // Simulate API delay
      map(() => {
        const user = this.users.find(u => u.id === id);
        return user ? { ...user } : null;
      })
    );
  }

  // TODO: Replace with real API call: POST /api/users
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return of(null).pipe(
      delay(400), // Simulate API delay
      map(() => {
        // Check if email already exists
        if (this.users.some(u => u.email === user.email)) {
          throw new Error('Email already exists');
        }

        const newUser: User = {
          ...user,
          id: `user_${Date.now()}`, // Generate ID
          password: user.password // Store password (in real app, this would be hashed)
        };
        this.users.push(newUser);
        // Also update auth service dummy users
        this.authService.updateDummyUsers(this.users);
        return { ...newUser };
      })
    );
  }

  // TODO: Replace with real API call: PUT /api/users/:id
  updateUser(id: string, updates: Partial<Omit<User, 'id'>>): Observable<User> {
    return of(null).pipe(
      delay(400), // Simulate API delay
      map(() => {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
          throw new Error('User not found');
        }
        
        // Check email uniqueness if email is being updated
        if (updates.email && this.users.some((u, i) => i !== index && u.email === updates.email)) {
          throw new Error('Email already exists');
        }

        // Only update password if provided
        const userUpdates = { ...updates };
        if (!userUpdates.password) {
          delete userUpdates.password;
        } else {
          // In real app, password would be hashed
          userUpdates.password = userUpdates.password;
        }

        this.users[index] = { ...this.users[index], ...userUpdates };
        // Also update auth service dummy users
        this.authService.updateDummyUsers(this.users);
        return { ...this.users[index] };
      })
    );
  }

  // TODO: Replace with real API call: DELETE /api/users/:id or PATCH /api/users/:id/deactivate
  deactivateUser(id: string): Observable<User> {
    return of(null).pipe(
      delay(300), // Simulate API delay
      map(() => {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
          throw new Error('User not found');
        }
        this.users[index] = { ...this.users[index], active: false };
        return { ...this.users[index] };
      })
    );
  }

  // Get active users only
  getActiveUsers(): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(u => u.active))
    );
  }
}

