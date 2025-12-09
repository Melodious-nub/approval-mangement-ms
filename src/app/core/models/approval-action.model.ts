export type ApprovalActionType = 'Approved' | 'Rejected';

export interface ApprovalAction {
  approverId: string;
  action: ApprovalActionType;
  comment: string;
  actionDate: Date;
}

