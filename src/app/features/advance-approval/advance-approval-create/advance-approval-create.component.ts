import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdvanceApprovalService } from '../../../core/services/advance-approval.service';

@Component({
  selector: 'app-advance-approval-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './advance-approval-create.component.html',
  styleUrl: './advance-approval-create.component.css'
})
export class AdvanceApprovalCreateComponent {
  purpose = '';
  requestedAmount = 0;
  description = '';
  expectedDate = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private advanceService: AdvanceApprovalService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.purpose) { this.errorMessage = 'Purpose is required!'; return; }
    if (!this.requestedAmount || this.requestedAmount <= 0) { this.errorMessage = 'Please enter a valid amount!'; return; }
    if (!this.expectedDate) { this.errorMessage = 'Please select an expected date!'; return; }
    if (this.requestedAmount > 20000) { this.errorMessage = 'Amount cannot exceed monthly limit of ₹20,000!'; return; }

    this.errorMessage = '';
    this.isLoading = true;

    this.advanceService.createAdvanceApproval({
      purpose: this.purpose,
      requestedAmount: this.requestedAmount,
      description: this.description,
      expectedDate: new Date(this.expectedDate)
    }).subscribe({
      next: () => {
        this.successMessage = 'Advance approval request submitted successfully!';
        this.isLoading = false;
        setTimeout(() => { this.router.navigate(['/advance-approval']); }, 2000);
      },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }
}
