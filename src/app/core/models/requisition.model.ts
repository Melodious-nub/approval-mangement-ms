import { ApprovalAction } from './approval-action.model';
import { FileAttachment } from './file-attachment.model';

export type RequisitionStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected';

export interface Requisition {
  id: string;
  referenceNumber: string; // Auto-generated: MEMO-YYYY-NNN format
  date: Date; // Memo date
  subject: string; // Memo subject/title
  tinNumber: string; // TIN Certificate Number
  binNid: string; // BIN/NID
  summary: string; // Memo summary/description
  budget?: number; // Budget amount for the requisition
  accountsPersonId: string | null; // Optional accounts person for budget
  createdBy: string; // userId - creator
  assignedApprovers: string[]; // userIds - approvers
  status: RequisitionStatus;
  createdAt: Date; // System creation timestamp
  approvalHistory: ApprovalAction[];
  attachedFiles: FileAttachment[]; // Attached files
  remarks?: string; // Additional remarks/comments
}

