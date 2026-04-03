import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReimbursementService } from '../../../core/services/reimbursement.service';

@Component({
  selector: 'app-my-claims-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-claims-edit.component.html',
  styleUrl: './my-claims-edit.component.css'
})
export class MyClaimsEditComponent implements OnInit {
  requestId: string = '';
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  amount: number = 0;
  description: string = '';

  constructor(
    private route: ActivatedRoute,
    private reimbursementService: ReimbursementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    this.loadClaim();
  }

  loadClaim(): void {
    this.isLoading = true;
    this.reimbursementService.getById(this.requestId).subscribe({
      next: (data) => {
        this.amount = data.amount;
        this.description = data.description;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  onUpdate(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.reimbursementService.updateRequest(
      this.requestId,
      { amount: this.amount, description: this.description }
    ).subscribe({
      next: () => {
        this.successMessage = 'Claim updated successfully!';
        this.isSaving = false;
        setTimeout(() => { this.router.navigate(['/my-claims']); }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSaving = false;
      }
    });
  }
}