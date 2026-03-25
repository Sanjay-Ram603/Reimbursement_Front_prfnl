import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { ReimbursementService } from '../../core/services/reimbursement.service';
import { ProcessPaymentRequest, PaymentMethod } from '../../core/models/payment.model';
import { ReimbursementRequestResponse, ReimbursementStatus } from '../../core/models/reimbursement.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  requests: ReimbursementRequestResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  PaymentMethod = PaymentMethod;
  ReimbursementStatus = ReimbursementStatus;

  selectedPayment: ProcessPaymentRequest = {
    reimbursementRequestId: '',
    amount: 0,
    paymentMethod: PaymentMethod.BankTransfer
  };

  selectedRequestId: string = '';

  constructor(
    private paymentService: PaymentService,
    private reimbursementService: ReimbursementService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.reimbursementService.getMyRequests().subscribe({
      next: (data) => {
        this.requests = data.filter(
          r => r.status === ReimbursementStatus.FinanceApproved
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  selectRequest(req: ReimbursementRequestResponse): void {
    this.selectedRequestId = req.reimbursementRequestId;
    this.selectedPayment = {
      reimbursementRequestId: req.reimbursementRequestId,
      amount: req.amount,
      paymentMethod: PaymentMethod.BankTransfer
    };
  }

  processPayment(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.paymentService.processPayment(this.selectedPayment).subscribe({
      next: () => {
        this.successMessage = 'Payment processed successfully!';
        this.selectedRequestId = '';
        this.isLoading = false;
        this.loadRequests();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  cancelSelection(): void {
    this.selectedRequestId = '';
  }
}