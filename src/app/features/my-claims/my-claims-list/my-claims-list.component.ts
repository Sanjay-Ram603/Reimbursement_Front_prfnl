import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReimbursementService } from '../../../core/services/reimbursement.service';
import { ApprovalService } from '../../../core/services/approval.service';
import { ApprovalHistoryResponse } from '../../../core/models/approval.model';
import { ReimbursementRequestResponse, ReimbursementStatus } from '../../../core/models/reimbursement.model';

@Component({
  selector: 'app-my-claims-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-claims-list.component.html',
  styleUrl: './my-claims-list.component.css'
})
export class MyClaimsListComponent implements OnInit {
  claims: ReimbursementRequestResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  ReimbursementStatus = ReimbursementStatus;

  // ✅ Comments history
  historyMap: { [key: string]: ApprovalHistoryResponse[] } = {};
  showHistoryId: string = '';

  constructor(
    private reimbursementService: ReimbursementService,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading = true;
    this.reimbursementService.getMyRequests().subscribe({
      next: (data) => {
        this.claims = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  // ✅ Toggle approval history/comments
  toggleHistory(requestId: string): void {
    if (this.showHistoryId === requestId) {
      this.showHistoryId = '';
      return;
    }
    this.showHistoryId = requestId;
    if (!this.historyMap[requestId]) {
      this.approvalService.getApprovalHistory(requestId).subscribe({
        next: (data) => { this.historyMap[requestId] = data; },
        error: () => { this.historyMap[requestId] = []; }
      });
    }
  }

  deleteClaim(id: string): void {
    if (!confirm('Are you sure you want to delete this claim?')) return;
    this.reimbursementService.deleteRequest(id).subscribe({
      next: () => {
        this.successMessage = 'Claim deleted successfully!';
        this.loadClaims();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => { this.errorMessage = err.message; }
    });
  }

  downloadAttachment(id: string): void {
    this.reimbursementService.downloadAttachment(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attachment';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => { alert('No attachment found!'); }
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
      1: 'bg-secondary',
      2: 'bg-warning text-dark',
      3: 'bg-info text-dark',
      4: 'bg-primary',
      5: 'bg-danger',
      6: 'bg-success',
      7: 'status-head-approved'
    };
    return classes[status] || 'bg-secondary';
  }
}