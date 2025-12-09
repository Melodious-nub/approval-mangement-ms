import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

// TODO: Replace with real API call
// Dummy users for authentication
const DUMMY_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', active: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', active: true },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', active: true },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', active: true },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', active: false },
  { id: '6', name: 'Diana Prince', email: 'diana@example.com', active: true }
];

// Simple password mapping (in real app, passwords would be hashed)
const USER_PASSWORDS: { [email: string]: string } = {
  'john@example.com': 'password1',
  'jane@example.com': 'password2',
  'bob@example.com': 'password3',
  'alice@example.com': 'password4',
  'charlie@example.com': 'password5',
  'diana@example.com': 'password6'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private storageService: StorageService) {}

  // TODO: Replace with real API call: POST /api/auth/login
  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return of(null).pipe(
      delay(500), // Simulate API delay
      map(() => {
        const user = DUMMY_USERS.find(u => u.email === email);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.active) {
          throw new Error('User account is inactive');
        }

        if (USER_PASSWORDS[email] !== password) {
          throw new Error('Invalid email or password');
        }

        // Generate fake token
        const token = `fake_token_${Date.now()}_${user.id}`;
        
        // Store token and user
        this.storageService.setToken(token);
        this.storageService.setUser(user);

        return { token, user };
      })
    );
  }

  logout(): void {
    this.storageService.clear();
  }

  // TODO: Replace with real API call: GET /api/auth/me
  getCurrentUser(): Observable<User | null> {
    return of(null).pipe(
      delay(200), // Simulate API delay
      map(() => {
        const user = this.storageService.getUser();
        return user;
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getToken();
  }

  // Get dummy users (shared with user service)
  getDummyUsers(): User[] {
    return DUMMY_USERS;
  }
}

