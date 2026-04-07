import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdvanceApprovalService } from '../../core/services/advance-approval.service';
import { AdvanceApprovalResponse } from '../../core/models/reimbursement.model';

@Component({
  selector: 'app-head-advance-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-advance-approval.component.html',
  styleUrl: './head-advance-approval.component.css'
})
export class HeadAdvanceApprovalComponent implements OnInit {
  advances: AdvanceApprovalResponse[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedId = '';
  comments = '';

  constructor(private advanceService: AdvanceApprovalService) {}

  ngOnInit(): void {
    this.loadAdvances();
  }

  loadAdvances(): void {
    this.isLoading = true;
    this.advanceService.getPendingAdvanceApprovals().subscribe({
      next: (data) => { this.advances = data; this.isLoading = false; },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  process(id: string, status: string): void {
    this.advanceService.processAdvanceApproval(id, { status, comments: this.comments }).subscribe({
      next: () => {
        this.successMessage = `Request ${status} successfully!`;
        this.selectedId = '';
        this.comments = '';
        this.loadAdvances();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => { this.errorMessage = err.message; }
    });
  }

  toggleComment(id: string): void {
    this.selectedId = this.selectedId === id ? '' : id;
    this.comments = '';
  }
}
