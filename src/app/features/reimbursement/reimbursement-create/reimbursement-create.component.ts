import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReimbursementService } from '../../../core/services/reimbursement.service';
import { ExpenseCategory } from '../../../core/models/reimbursement.model';

@Component({
  selector: 'app-reimbursement-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reimbursement-create.component.html',
  styleUrl: './reimbursement-create.component.css'
})
export class ReimbursementCreateComponent implements OnInit {
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

  // ✅ Terms & Conditions
  agreedToTerms: boolean = false;
  showTerms: boolean = false;

  // ✅ Max date = today (no future dates)
  todayDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private reimbursementService: ReimbursementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.reimbursementService.getExpenseCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only JPG, PNG and PDF files are allowed!';
        this.selectedFile = null;
        this.selectedFileName = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.errorMessage = 'File size must be less than 5MB!';
        this.selectedFile = null;
        this.selectedFileName = '';
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

  // ✅ Toggle Terms popup
  toggleTerms(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showTerms = !this.showTerms;
  }

  // ✅ Close terms when clicking outside
  @HostListener('document:click')
  onDocumentClick(): void {
    this.showTerms = false;
  }

  onSubmit(): void {
    if (!this.agreedToTerms) {
      this.errorMessage = 'Please agree to the Terms & Conditions before submitting!';
      return;
    }
    if (!this.expenseCategoryId) {
      this.errorMessage = 'Please select a category!';
      return;
    }
    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount!';
      return;
    }
    if (!this.description) {
      this.errorMessage = 'Please enter a description!';
      return;
    }
    if (!this.expenseDate) {
      this.errorMessage = 'Please select an expense date!';
      return;
    }
    // ✅ Validate no future date
    const selected = new Date(this.expenseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selected > today) {
      this.errorMessage = 'Expense date cannot be a future date!';
      return;
    }
    if (!this.selectedFile) {
      this.errorMessage = 'Please attach a receipt or document!';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.reimbursementService.createRequest(
      this.expenseCategoryId,
      this.amount,
      this.description,
      this.expenseDate,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.successMessage = 'Request submitted successfully!';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/reimbursement']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
}