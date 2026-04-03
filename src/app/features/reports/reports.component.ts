import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { ReimbursementReport } from '../../core/models/report.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
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
  totalCount: number = 0;
  totalPages: number = 0;

  isAdmin: boolean = false;
  isFinance: boolean = false;
  userRole: string = '';

  filters: { label: string; value: string }[] = [];

  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isFinance = this.authService.isFinance();
    this.userRole = this.authService.getRoleFromToken() || '';
    this.setupFilters();
  }

  setupFilters(): void {
    if (this.isAdmin) {
      this.filters = [
        { label: 'All', value: 'all' },
        { label: '⏳ Pending (Submitted)', value: 'pending' },
        { label: '✅ Manager Approved', value: 'approved' },
        { label: '❌ Rejected', value: 'rejected' }
      ];
    } else if (this.isFinance) {
      this.filters = [
        { label: 'All', value: 'all' },
        { label: '⏳ Pending (Manager Approved)', value: 'financepending' },
        { label: '✅ Finance Approved', value: 'financeapproved' },
        { label: '💰 Paid', value: 'financepaid' },
        { label: '❌ Rejected', value: 'financerejected' }
      ];
    }
  }

  generateReport(): void {
    if (!this.fromDate || !this.toDate) {
      this.errorMessage = 'Please select both From and To dates!';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.hasSearched = true;

    const statusParam = this.activeFilter === 'all' ? null : this.activeFilter;

    // ✅ First get total count for pagination
    this.reportService.getTotalCount(
      this.fromDate,
      this.toDate,
      statusParam,
      this.userRole
    ).subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);

        // ✅ Then get actual data
        this.reportService.generateReport(
          this.fromDate,
          this.toDate,
          statusParam,
          this.userRole,
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
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.startIndex = 0;
    this.totalCount = 0;
    this.totalPages = 0;
    if (this.hasSearched) {
      this.generateReport();
    }
  }

  nextPage(): void {
    if (this.startIndex < this.totalPages - 1) {
      this.startIndex++;
      this.generateReportOnly();
    }
  }

  prevPage(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
      this.generateReportOnly();
    }
  }

  // ✅ Only fetch data without recounting
  generateReportOnly(): void {
    this.isLoading = true;
    const statusParam = this.activeFilter === 'all' ? null : this.activeFilter;

    this.reportService.generateReport(
      this.fromDate,
      this.toDate,
      statusParam,
      this.userRole,
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

  resetReport(): void {
    this.reports = [];
    this.fromDate = '';
    this.toDate = '';
    this.startIndex = 0;
    this.activeFilter = 'all';
    this.hasSearched = false;
    this.totalAmount = 0;
    this.totalCount = 0;
    this.totalPages = 0;
    this.errorMessage = '';
  }
}