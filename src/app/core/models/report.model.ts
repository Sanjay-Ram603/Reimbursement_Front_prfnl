export interface ReimbursementReport {
  reimbursementRequestId: string;
  amount: number;
  createdAt: string;
  description: string;
  employeeName: string;
  employeeEmail: string;
  status: string;
}