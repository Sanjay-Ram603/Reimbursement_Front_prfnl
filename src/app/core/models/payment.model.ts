

export enum PaymentMethod {
  BankTransfer = 1,
  UPI = 2,
  Cash = 3
}

export interface ProcessPaymentRequest {
  reimbursementRequestId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}