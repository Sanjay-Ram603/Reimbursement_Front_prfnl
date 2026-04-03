import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { ReimbursementReport } from '../../core/models/report.model';

@Component({
  selector: 'app-head-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-reports.component.html',
  styleUrl: './head-reports.component.css'
})
export class HeadReportsComponent implements OnInit {
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

  filters = [
    { label: 'All', value: 'all' },
    { label: '⏳ Pending (Submitted)', value: 'headpending' },
    { label: '✅ Approved', value: 'headapproved' },
    { label: '💰 Paid', value: 'headpaid' },
    { label: '❌ Rejected', value: 'headrejected' }
  ];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {}

  generateReport(): void {
    if (!this.fromDate || !this.toDate) {
      this.errorMessage = 'Please select both From and To dates!';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.hasSearched = true;

    const statusParam = this.activeFilter === 'all' ? null : this.activeFilter;

    this.reportService.getTotalCount(this.fromDate, this.toDate, statusParam, 'Head').subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);
        this.reportService.generateReport(
          this.fromDate, this.toDate, statusParam, 'Head', this.startIndex, this.pageSize
        ).subscribe({
          next: (data) => {
            this.reports = data;
            this.totalAmount = data.reduce((sum, r) => sum + r.amount, 0);
            this.isLoading = false;
          },
          error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
        });
      },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  onFilterChange(): void {
    this.startIndex = 0;
    if (this.hasSearched) { this.generateReport(); }
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

  generateReportOnly(): void {
    this.isLoading = true;
    const statusParam = this.activeFilter === 'all' ? null : this.activeFilter;
    this.reportService.generateReport(
      this.fromDate, this.toDate, statusParam, 'Head', this.startIndex, this.pageSize
    ).subscribe({
      next: (data) => {
        this.reports = data;
        this.totalAmount = data.reduce((sum, r) => sum + r.amount, 0);
        this.isLoading = false;
      },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  resetReport(): void {
    this.reports = []; this.fromDate = ''; this.toDate = '';
    this.startIndex = 0; this.activeFilter = 'all';
    this.hasSearched = false; this.totalAmount = 0;
    this.totalCount = 0; this.totalPages = 0; this.errorMessage = '';
  }
}