import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdvanceApprovalService } from '../../../core/services/advance-approval.service';
import { AdvanceApprovalResponse } from '../../../core/models/reimbursement.model';

@Component({
  selector: 'app-advance-approval-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './advance-approval-list.component.html',
  styleUrl: './advance-approval-list.component.css'
})
export class AdvanceApprovalListComponent implements OnInit {
  advances: AdvanceApprovalResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private advanceService: AdvanceApprovalService) {}

  ngOnInit(): void {
    this.loadAdvances();
  }

  loadAdvances(): void {
    this.isLoading = true;
    this.advanceService.getMyAdvanceApprovals().subscribe({
      next: (data) => { this.advances = data; this.isLoading = false; },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  getStatusClass(status: string, isPaid: boolean = false): string {
    if (isPaid) return 'bg-success';
    switch (status) {
      case 'Approved': return 'status-head-approved';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  }

  getStatusLabel(status: string, isPaid: boolean = false): string {
    if (isPaid) return 'Paid';
    switch (status) {
      case 'Approved': return 'Head Approved';
      case 'Rejected': return 'Rejected';
      default: return 'Pending';
    }
  }
}
