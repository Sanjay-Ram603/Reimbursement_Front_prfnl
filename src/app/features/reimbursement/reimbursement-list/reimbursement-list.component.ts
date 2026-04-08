import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReimbursementService } from '../../../core/services/reimbursement.service';
import { ApprovalService } from '../../../core/services/approval.service';
import { ApprovalHistoryResponse } from '../../../core/models/approval.model';
import { ReimbursementRequestResponse, ReimbursementStatus } from '../../../core/models/reimbursement.model';
import { AttachmentPreviewComponent } from '../../../shared/attachment-preview/attachment-preview.component';

@Component({
  selector: 'app-reimbursement-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AttachmentPreviewComponent],
  templateUrl: './reimbursement-list.component.html',
  styleUrl: './reimbursement-list.component.css'
})
export class ReimbursementListComponent implements OnInit {
  allRequests: ReimbursementRequestResponse[] = [];
  filteredRequests: ReimbursementRequestResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  activeFilter: string = 'All';
  ReimbursementStatus = ReimbursementStatus;
  filters = ['All', 'Pending', 'Approved', 'Rejected', 'Paid'];

  // ✅ Comments history
  historyMap: { [key: string]: ApprovalHistoryResponse[] } = {};
  showHistoryId: string = '';

  constructor(
    private reimbursementService: ReimbursementService,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.reimbursementService.getMyRequests().subscribe({
      next: (data) => {
        this.allRequests = data;
        this.applyFilter(this.activeFilter);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  applyFilter(filter: string): void {
    this.activeFilter = filter;
    switch (filter) {
      case 'Pending':
        this.filteredRequests = this.allRequests.filter(
          r => r.status === ReimbursementStatus.Submitted ||
               r.status === ReimbursementStatus.Draft
        );
        break;
      case 'Approved':
        this.filteredRequests = this.allRequests.filter(
          r => r.status === ReimbursementStatus.ManagerApproved ||
               r.status === ReimbursementStatus.FinanceApproved
        );
        break;
      case 'Rejected':
        this.filteredRequests = this.allRequests.filter(
          r => r.status === ReimbursementStatus.Rejected
        );
        break;
      case 'Paid':
        this.filteredRequests = this.allRequests.filter(
          r => r.status === ReimbursementStatus.Paid
        );
        break;
      default:
        this.filteredRequests = this.allRequests;
        break;
    }
  }

  getFilterCount(filter: string): number {
    switch (filter) {
      case 'Pending':
        return this.allRequests.filter(
          r => r.status === ReimbursementStatus.Submitted ||
               r.status === ReimbursementStatus.Draft
        ).length;
      case 'Approved':
        return this.allRequests.filter(
          r => r.status === ReimbursementStatus.ManagerApproved ||
               r.status === ReimbursementStatus.FinanceApproved
        ).length;
      case 'Rejected':
        return this.allRequests.filter(
          r => r.status === ReimbursementStatus.Rejected
        ).length;
      case 'Paid':
        return this.allRequests.filter(
          r => r.status === ReimbursementStatus.Paid
        ).length;
      default:
        return this.allRequests.length;
    }
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
        next: (data) => {
          this.historyMap[requestId] = data;
        },
        error: () => {
          this.historyMap[requestId] = [];
        }
      });
    }
  }

  deleteRequest(id: string): void {
    if (!confirm('Are you sure you want to delete this request?')) return;
    this.reimbursementService.deleteRequest(id).subscribe({
      next: () => {
        this.successMessage = 'Request deleted successfully!';
        this.loadRequests();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
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