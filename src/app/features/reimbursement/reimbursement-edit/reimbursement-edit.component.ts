import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReimbursementService } from '../../../core/services/reimbursement.service';

@Component({
  selector: 'app-reimbursement-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reimbursement-edit.component.html',
  styleUrl: './reimbursement-edit.component.css'
})
export class ReimbursementEditComponent implements OnInit {
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
    this.loadRequest();
  }

  loadRequest(): void {
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

    // ✅ Send exact fields backend expects
    const payload = {
      amount: this.amount,
      description: this.description
    };

    this.reimbursementService.updateRequest(
      this.requestId,
      payload
    ).subscribe({
      next: () => {
        this.successMessage = 'Request updated successfully!';
        this.isSaving = false;
        setTimeout(() => {
          this.router.navigate(['/reimbursement']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSaving = false;
      }
    });
  }
}