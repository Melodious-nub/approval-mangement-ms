import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Requisition, RequisitionStatus } from '../models/requisition.model';
import { ApprovalAction, ApprovalActionType } from '../models/approval-action.model';

// TODO: Replace with real API calls
// Dummy requisitions data
let DUMMY_REQUISITIONS: Requisition[] = [
  {
    id: 'req_1',
    title: 'Office Chairs',
    description: 'Need 10 ergonomic office chairs for the new office space',
    category: 'Furniture',
    priority: 'High',
    createdBy: '1',
    assignedApprovers: ['2', '3'],
    status: 'Pending',
    createdAt: new Date('2024-01-15'),
    approvalHistory: []
  },
  {
    id: 'req_2',
    title: 'Laptop Computers',
    description: 'Request for 5 new laptops for the development team',
    category: 'IT Equipment',
    priority: 'High',
    createdBy: '2',
    assignedApprovers: ['1'],
    status: 'Approved',
    createdAt: new Date('2024-01-10'),
    approvalHistory: [
      {
        approverId: '1',
        action: 'Approved',
        comment: 'Approved for budget allocation',
        actionDate: new Date('2024-01-11')
      }
    ]
  },
  {
    id: 'req_3',
    title: 'Stationery Supplies',
    description: 'Monthly stationery order - pens, papers, folders',
    category: 'Office Supplies',
    priority: 'Low',
    createdBy: '3',
    assignedApprovers: ['4'],
    status: 'Rejected',
    createdAt: new Date('2024-01-08'),
    approvalHistory: [
      {
        approverId: '4',
        action: 'Rejected',
        comment: 'Budget constraints, please reduce quantity',
        actionDate: new Date('2024-01-09')
      }
    ]
  },
  {
    id: 'req_4',
    title: 'Standing Desks',
    description: 'Request for 3 adjustable standing desks',
    category: 'Furniture',
    priority: 'Medium',
    createdBy: '1',
    assignedApprovers: ['2', '3', '4'],
    status: 'Pending',
    createdAt: new Date('2024-01-20'),
    approvalHistory: []
  },
  {
    id: 'req_5',
    title: 'Draft Requisition',
    description: 'This is a draft requisition',
    category: 'Office Supplies',
    priority: 'Low',
    createdBy: '2',
    assignedApprovers: [],
    status: 'Draft',
    createdAt: new Date('2024-01-22'),
    approvalHistory: []
  }
];

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  // TODO: Replace with real API call: GET /api/requisitions
  getRequisitions(): Observable<Requisition[]> {
    return of(DUMMY_REQUISITIONS).pipe(
      delay(300), // Simulate API delay
      map(requisitions => requisitions.map(r => ({ ...r })))
    );
  }

  // TODO: Replace with real API call: GET /api/requisitions/:id
  getRequisitionById(id: string): Observable<Requisition | null> {
    return of(null).pipe(
      delay(200), // Simulate API delay
      map(() => {
        const requisition = DUMMY_REQUISITIONS.find(r => r.id === id);
        return requisition ? { ...requisition } : null;
      })
    );
  }

  // TODO: Replace with real API call: GET /api/requisitions?createdBy=:userId
  getMyRequisitions(userId: string): Observable<Requisition[]> {
    return of(null).pipe(
      delay(300), // Simulate API delay
      map(() => {
        return DUMMY_REQUISITIONS
          .filter(r => r.createdBy === userId)
          .map(r => ({ ...r }));
      })
    );
  }

  // TODO: Replace with real API call: GET /api/requisitions?assignedTo=:userId
  getAssignedRequisitions(userId: string): Observable<Requisition[]> {
    return of(null).pipe(
      delay(300), // Simulate API delay
      map(() => {
        return DUMMY_REQUISITIONS
          .filter(r => r.assignedApprovers.includes(userId))
          .map(r => ({ ...r }));
      })
    );
  }

  // TODO: Replace with real API call: POST /api/requisitions
  createRequisition(requisition: Omit<Requisition, 'id' | 'createdAt' | 'approvalHistory'>): Observable<Requisition> {
    return of(null).pipe(
      delay(400), // Simulate API delay
      map(() => {
        const newRequisition: Requisition = {
          ...requisition,
          id: `req_${Date.now()}`,
          createdAt: new Date(),
          approvalHistory: []
        };
        DUMMY_REQUISITIONS.push(newRequisition);
        return { ...newRequisition };
      })
    );
  }

  // TODO: Replace with real API call: PUT /api/requisitions/:id
  updateRequisition(id: string, updates: Partial<Requisition>): Observable<Requisition> {
    return of(null).pipe(
      delay(400), // Simulate API delay
      map(() => {
        const index = DUMMY_REQUISITIONS.findIndex(r => r.id === id);
        if (index === -1) {
          throw new Error('Requisition not found');
        }
        DUMMY_REQUISITIONS[index] = { ...DUMMY_REQUISITIONS[index], ...updates };
        return { ...DUMMY_REQUISITIONS[index] };
      })
    );
  }

  // TODO: Replace with real API call: POST /api/requisitions/:id/approve
  approveRequisition(id: string, approverId: string, comment: string): Observable<Requisition> {
    return of(null).pipe(
      delay(400), // Simulate API delay
      map(() => {
        const requisition = DUMMY_REQUISITIONS.find(r => r.id === id);
        if (!requisition) {
          throw new Error('Requisition not found');
        }

        if (!requisition.assignedApprovers.includes(approverId)) {
          throw new Error('User is not assigned as approver');
        }

        // Check if already approved/rejected by this user
        const existingAction = requisition.approvalHistory.find(a => a.approverId === approverId);
        if (existingAction) {
          throw new Error('User has already taken action on this requisition');
        }

        // Add approval action
        const approvalAction: ApprovalAction = {
          approverId,
          action: 'Approved',
          comment,
          actionDate: new Date()
        };
        requisition.approvalHistory.push(approvalAction);

        // Check if all approvers have approved
        const allApproved = requisition.assignedApprovers.every(approverId => 
          requisition.approvalHistory.some(a => a.approverId === approverId && a.action === 'Approved')
        );

        if (allApproved) {
          requisition.status = 'Approved';
        }

        return { ...requisition };
      })
    );
  }

  // TODO: Replace with real API call: POST /api/requisitions/:id/reject
  rejectRequisition(id: string, approverId: string, comment: string): Observable<Requisition> {
    return of(null).pipe(
      delay(400), // Simulate API delay
      map(() => {
        const requisition = DUMMY_REQUISITIONS.find(r => r.id === id);
        if (!requisition) {
          throw new Error('Requisition not found');
        }

        if (!requisition.assignedApprovers.includes(approverId)) {
          throw new Error('User is not assigned as approver');
        }

        // Check if already approved/rejected by this user
        const existingAction = requisition.approvalHistory.find(a => a.approverId === approverId);
        if (existingAction) {
          throw new Error('User has already taken action on this requisition');
        }

        // Add rejection action
        const rejectionAction: ApprovalAction = {
          approverId,
          action: 'Rejected',
          comment,
          actionDate: new Date()
        };
        requisition.approvalHistory.push(rejectionAction);

        // Any rejection means rejected
        requisition.status = 'Rejected';

        return { ...requisition };
      })
    );
  }
}

