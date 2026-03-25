

import { ReimbursementStatus } from './reimbursement.model';

export enum ApprovalStage {
  Manager = 1,
  Finance = 2
}

export interface ApprovalActionRequest {
  reimbursementRequestId: string;
  status: ReimbursementStatus;
  comments?: string;
}

export interface PendingApproval {
  requestId: string;
  employeeName: string;
  amount: number;
  status: string;
}