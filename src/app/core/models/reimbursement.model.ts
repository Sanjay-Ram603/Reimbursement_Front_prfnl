

export enum ReimbursementStatus {
  Draft = 1,
  Submitted = 2,
  ManagerApproved = 3,
  FinanceApproved = 4,
  Rejected = 5,
  Paid = 6
}

export interface ExpenseCategory {
  expenseCategoryId: string;
  categoryName: string;
}

export interface CreateReimbursementRequest {
  expenseCategoryId: string;
  amount: number;
  description: string;
  status: ReimbursementStatus;
  expenseDate: Date;
  attachmentPath?: string;
}


export interface ReimbursementRequestResponse {
  reimbursementRequestId: string;
  amount: number;
  description: string;
  status: ReimbursementStatus;
  attachmentPath?: string;
  createdAt?: string;
  employeeName?: string;
  employeeEmail?: string;
  employeeRole?: string;
}

export interface UpdateReimbursementRequest {
  amount?: number;
  description?: string;
}

export interface ReimbursementAttachment {
  fileName: string;
  fileUrl: string;
}

export interface UpdateReimbursementRequest {
  amount?: number;
  description?: string;
}