import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApprovalService } from '../../core/services/approval.service';
import { ReimbursementService } from '../../core/services/reimbursement.service';
import { AuthService } from '../../core/services/auth.service';
import { ApprovalActionRequest, ApprovalHistoryResponse } from '../../core/models/approval.model';
import { ReimbursementRequestResponse, ReimbursementStatus } from '../../core/models/reimbursement.model';
import { AttachmentPreviewComponent } from '../../shared/attachment-preview/attachment-preview.component';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, AttachmentPreviewComponent],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.css'
})
export class ApprovalComponent implements OnInit {
  allRequests: ReimbursementRequestResponse[] = [];
  filteredRequests: ReimbursementRequestResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  selectedRequestId: string = '';
  comments: string = '';
  ReimbursementStatus = ReimbursementStatus;

  isAdmin: boolean = false;
  isFinance: boolean = false;

  dateFilter: string = 'recent';
  amountFilter: string = 'all';

  // ✅ History tracking
  historyMap: { [key: string]: ApprovalHistoryResponse[] } = {};
  showHistoryId: string = '';

  constructor(
    private approvalService: ApprovalService,
    private reimbursementService: ReimbursementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isFinance = this.authService.isFinance();
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.reimbursementService.getAllRequests().subscribe({
      next: (data) => {
        if (this.isAdmin) {
          this.allRequests = data.filter(
            r => r.status === ReimbursementStatus.Submitted
          );
        } else if (this.isFinance) {
          this.allRequests = data.filter(
            r => r.status === ReimbursementStatus.ManagerApproved ||
                 r.status === ReimbursementStatus.HeadApproved
          );
        }
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allRequests];

    switch (this.amountFilter) {
      case 'below10k':
        result = result.filter(r => r.amount < 10000);
        break;
      case '10kTo50k':
        result = result.filter(r => r.amount >= 10000 && r.amount <= 50000);
        break;
      case 'above50k':
        result = result.filter(r => r.amount > 50000);
        break;
    }

    if (this.dateFilter === 'recent') {
      result = [...result].sort((a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    } else if (this.dateFilter === 'oldest') {
      result = [...result].sort((a, b) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
    }

    this.filteredRequests = result;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  processApproval(requestId: string, status: ReimbursementStatus): void {
    const request: ApprovalActionRequest = {
      reimbursementRequestId: requestId,
      status: status,
      comments: this.comments
    };

    this.approvalService.processApproval(request).subscribe({
      next: () => {
        this.successMessage = 'Action processed successfully!';
        this.comments = '';
        this.selectedRequestId = '';
        this.loadRequests();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  toggleComments(requestId: string): void {
    this.selectedRequestId =
      this.selectedRequestId === requestId ? '' : requestId;
    this.comments = '';
  }

  downloadAttachment(requestId: string): void {
    this.approvalService.downloadAttachment(requestId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attachment';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('No attachment found!');
      }
    });
  }

  getStatusLabel(status: ReimbursementStatus): string {
    const labels: Record<number, string> = {
      1: 'Draft', 2: 'Submitted', 3: 'Manager Approved',
      4: 'Finance Approved', 5: 'Rejected', 6: 'Paid', 7: 'Head Approved'
    };
    return labels[status] || 'Unknown';
  }

  getStatusClass(status: ReimbursementStatus): string {
    const classes: Record<number, string> = {
      1: 'bg-secondary', 2: 'bg-warning text-dark', 3: 'bg-info text-dark',
      4: 'bg-primary', 5: 'bg-danger', 6: 'bg-success', 7: 'bg-purple'
    };
    return classes[status] || 'bg-secondary';
  }
}