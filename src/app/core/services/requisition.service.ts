import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Requisition, RequisitionStatus } from '../models/requisition.model';
import { ApprovalAction, ApprovalActionType } from '../models/approval-action.model';
import { FileAttachment } from '../models/file-attachment.model';

// TODO: Replace with real API calls
// Dummy requisitions data - Updated to new memo-style structure
let DUMMY_REQUISITIONS: Requisition[] = [
  {
    id: 'req_1',
    referenceNumber: 'MEMO-2024-001',
    date: new Date('2024-01-15'),
    subject: 'Office Equipment Purchase',
    tinNumber: '123456789',
    binNid: '987654321',
    summary: 'Request for purchasing new office equipment including chairs, desks, and computers to improve productivity and efficiency in the workplace.',
    budget: 500000,
    accountsPersonId: '2',
    createdBy: '1',
    assignedApprovers: ['2', '3'],
    status: 'Pending',
    createdAt: new Date('2024-01-15'),
    approvalHistory: [],
    attachedFiles: [
      { id: 'file_1', fileName: 'quotation.pdf', fileSize: 245000, uploadDate: new Date('2024-01-15'), fileType: 'pdf' },
      { id: 'file_2', fileName: 'specification.docx', fileSize: 156000, uploadDate: new Date('2024-01-15'), fileType: 'docx' }
    ]
  },
  {
    id: 'req_2',
    referenceNumber: 'MEMO-2024-002',
    date: new Date('2024-01-10'),
    subject: 'Laptop Computers for Development Team',
    tinNumber: '111222333',
    binNid: '444555666',
    summary: 'Request for 5 new laptops for the development team to support ongoing projects and improve development efficiency.',
    budget: 750000,
    accountsPersonId: null,
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
    ],
    attachedFiles: []
  },
  {
    id: 'req_3',
    referenceNumber: 'MEMO-2024-003',
    date: new Date('2024-01-08'),
    subject: 'Monthly Stationery Order',
    tinNumber: '555666777',
    binNid: '888999000',
    summary: 'Monthly stationery order including pens, papers, folders, and other office supplies for regular operations.',
    budget: 25000,
    accountsPersonId: '2',
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
    ],
    attachedFiles: []
  },
  {
    id: 'req_4',
    referenceNumber: 'MEMO-2024-004',
    date: new Date('2024-01-20'),
    subject: 'Standing Desks for Office',
    tinNumber: '123456789',
    binNid: '987654321',
    summary: 'Request for 3 adjustable standing desks to promote better health and productivity among employees.',
    budget: 150000,
    accountsPersonId: '2',
    createdBy: '1',
    assignedApprovers: ['2', '3', '4'],
    status: 'Pending',
    createdAt: new Date('2024-01-20'),
    approvalHistory: [],
    attachedFiles: []
  },
  {
    id: 'req_5',
    referenceNumber: 'MEMO-2024-005',
    date: new Date('2024-01-22'),
    subject: 'Draft Requisition for Review',
    tinNumber: '111222333',
    binNid: '444555666',
    summary: 'This is a draft requisition that needs to be completed before submission.',
    accountsPersonId: null,
    createdBy: '2',
    assignedApprovers: [],
    status: 'Draft',
    createdAt: new Date('2024-01-22'),
    approvalHistory: [],
    attachedFiles: []
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
        // Generate reference number if not provided
        let referenceNumber = requisition.referenceNumber;
        if (!referenceNumber) {
          const currentYear = new Date().getFullYear();
          const yearRequisitions = DUMMY_REQUISITIONS.filter(r => {
            const reqYear = new Date(r.createdAt).getFullYear();
            return reqYear === currentYear;
          });
          const nextNumber = (yearRequisitions.length + 1).toString().padStart(3, '0');
          referenceNumber = `MEMO-${currentYear}-${nextNumber}`;
        }

        const newRequisition: Requisition = {
          ...requisition,
          id: `req_${Date.now()}`,
          referenceNumber,
          createdAt: new Date(),
          approvalHistory: [],
          attachedFiles: requisition.attachedFiles || []
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

