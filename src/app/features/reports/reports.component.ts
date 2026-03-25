import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { ReimbursementReport } from '../../core/models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reports: ReimbursementReport[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  hasSearched: boolean = false;

  fromDate: string = '';
  toDate: string = '';
  pageSize: number = 5;
  startIndex: number = 0;
  activeFilter: string = 'all';

  totalAmount: number = 0;

  // ✅ Matching exactly your backend status values
  filters = [
    { label: 'All', value: 'all' },
    { label: '⏳ Pending', value: 'pending' },
    { label: '✅ Approved', value: 'approved' },
    { label: '❌ Rejected', value: 'rejected' }
  ];

  constructor(private reportService: ReportService) {}

  generateReport(): void {
    if (!this.fromDate || !this.toDate) {
      this.errorMessage = 'Please select both From and To dates!';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.hasSearched = true;

    const statusParam = this.activeFilter === 'all' ? null : this.activeFilter;

    this.reportService.generateReport(
      this.fromDate,
      this.toDate,
      statusParam,
      this.startIndex,
      this.pageSize
    ).subscribe({
      next: (data) => {
        this.reports = data;
        this.totalAmount = data.reduce((sum, r) => sum + r.amount, 0);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.activeFilter = filterValue;
    this.startIndex = 0;
    // ✅ Regenerate report with new status filter
    if (this.hasSearched) {
      this.generateReport();
    }
  }

  nextPage(): void {
    this.startIndex++;
    this.generateReport();
  }

  prevPage(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.generateReport();
    }
  }

  resetReport(): void {
    this.reports = [];
    this.fromDate = '';
    this.toDate = '';
    this.startIndex = 0;
    this.activeFilter = 'all';
    this.hasSearched = false;
    this.totalAmount = 0;
    this.errorMessage = '';
  }
}