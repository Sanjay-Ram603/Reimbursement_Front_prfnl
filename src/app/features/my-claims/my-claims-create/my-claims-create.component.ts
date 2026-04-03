import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReimbursementService } from '../../../core/services/reimbursement.service';
import { ExpenseCategory } from '../../../core/models/reimbursement.model';

@Component({
  selector: 'app-my-claims-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-claims-create.component.html',
  styleUrl: './my-claims-create.component.css'
})
export class MyClaimsCreateComponent implements OnInit {
  categories: ExpenseCategory[] = [];
  expenseCategoryId: string = '';
  amount: number = 0;
  description: string = '';
  expenseDate: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private reimbursementService: ReimbursementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reimbursementService.getExpenseCategories().subscribe({
      next: (data) => { this.categories = data; },
      error: (err) => { this.errorMessage = err.message; }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only JPG, PNG and PDF files are allowed!';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB!';
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.errorMessage = '';
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  onSubmit(): void {
    if (!this.expenseCategoryId) { this.errorMessage = 'Please select a category!'; return; }
    if (!this.amount || this.amount <= 0) { this.errorMessage = 'Please enter a valid amount!'; return; }
    if (!this.description) { this.errorMessage = 'Please enter a description!'; return; }
    if (!this.expenseDate) { this.errorMessage = 'Please select an expense date!'; return; }
    if (!this.selectedFile) { this.errorMessage = 'Please attach a receipt!'; return; }

    this.errorMessage = '';
    this.isLoading = true;

    this.reimbursementService.createRequest(
      this.expenseCategoryId,
      this.amount,
      this.description,
      this.expenseDate,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.successMessage = 'Claim submitted successfully!';
        this.isLoading = false;
        setTimeout(() => { this.router.navigate(['/my-claims']); }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
}