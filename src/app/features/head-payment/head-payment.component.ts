import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { ReimbursementService } from '../../core/services/reimbursement.service';
import { AdvanceApprovalService } from '../../core/services/advance-approval.service';
import { ProcessPaymentRequest, PaymentMethod } from '../../core/models/payment.model';
import { ReimbursementRequestResponse, ReimbursementStatus, AdvanceApprovalResponse } from '../../core/models/reimbursement.model';

@Component({
  selector: 'app-head-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-payment.component.html',
  styleUrl: './head-payment.component.css'
})
export class HeadPaymentComponent implements OnInit {
  // Regular claims
  requests: ReimbursementRequestResponse[] = [];
  selectedRequestId = '';
  selectedPayment: ProcessPaymentRequest = {
    reimbursementRequestId: '',
    amount: 0,
    paymentMethod: PaymentMethod.BankTransfer
  };

  // Advance approvals
  advanceRequests: AdvanceApprovalResponse[] = [];
  selectedAdvanceId = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  PaymentMethod = PaymentMethod;
  ReimbursementStatus = ReimbursementStatus;

  constructor(
    private paymentService: PaymentService,
    private reimbursementService: ReimbursementService,
    private advanceApprovalService: AdvanceApprovalService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Load regular claims
    this.reimbursementService.getHeadRequests().subscribe({
      next: (data) => {
        this.requests = data.filter(r => r.status === ReimbursementStatus.HeadApproved);
        this.isLoading = false;
      },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });

    // Load approved advance requests
    this.advanceApprovalService.getApprovedAdvanceApprovals().subscribe({
      next: (data) => { this.advanceRequests = data; },
      error: () => { /* non-critical, silently ignore */ }
    });
  }

  selectRequest(req: ReimbursementRequestResponse): void {
    this.selectedAdvanceId = '';
    this.selectedRequestId = req.reimbursementRequestId;
    this.selectedPayment = {
      reimbursementRequestId: req.reimbursementRequestId,
      amount: req.amount,
      paymentMethod: PaymentMethod.BankTransfer
    };
  }

  processPayment(): void {
    this.isLoading = true;
    this.paymentService.processPayment(this.selectedPayment).subscribe({
      next: () => {
        this.successMessage = 'Payment processed successfully!';
        this.selectedRequestId = '';
        this.isLoading = false;
        this.loadAll();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  selectAdvance(adv: AdvanceApprovalResponse): void {
    this.selectedRequestId = '';
    this.selectedAdvanceId = adv.advanceApprovalId;
  }

  processAdvancePayment(): void {
    this.isLoading = true;
    this.advanceApprovalService.markAdvancePaid(this.selectedAdvanceId).subscribe({
      next: () => {
        this.successMessage = 'Advance payment processed successfully!';
        this.selectedAdvanceId = '';
        this.isLoading = false;
        this.loadAll();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  cancelSelection(): void {
    this.selectedRequestId = '';
    this.selectedAdvanceId = '';
  }

  getSelectedAdvance(): AdvanceApprovalResponse | undefined {
    return this.advanceRequests.find(a => a.advanceApprovalId === this.selectedAdvanceId);
  }
}
