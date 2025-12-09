import { ApprovalAction } from './approval-action.model';

export type RequisitionStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected';
export type RequisitionPriority = 'Low' | 'Medium' | 'High';
export type RequisitionCategory = 'Office Supplies' | 'IT Equipment' | 'Furniture' | 'Utilities' | 'Other';

export interface Requisition {
  id: string;
  title: string;
  description: string;
  category: RequisitionCategory;
  priority: RequisitionPriority;
  createdBy: string; // userId
  assignedApprovers: string[]; // userIds
  status: RequisitionStatus;
  createdAt: Date;
  approvalHistory: ApprovalAction[];
}

