import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary = {
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    pendingRequests: 0,
    totalAmount: 0
  };

  isLoading: boolean = false;
  errorMessage: string = '';
  isAdmin: boolean = false;
  isEmployee: boolean = false;
  isFinance: boolean = false;
  userFirstName: string = '';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  isHead: boolean = false;

ngOnInit(): void {
  this.isAdmin = this.authService.isAdmin();
  this.isEmployee = this.authService.isEmployee();
  this.isFinance = this.authService.isFinance();
  this.isHead = this.authService.isHead();
  this.userFirstName = this.authService.getEmail()?.split('@')[0] || '';
  this.loadDashboard();
}

  loadDashboard(): void {
  this.isLoading = true;

  this.dashboardService.getMyDashboard().subscribe({
    next: (data) => {
      this.summary = data;

      // ✅ Map finance data (TEMP mapping from existing API)
      this.financeStats.pendingPayments = data.approvedRequests;
      this.financeStats.approvedAmount = data.totalAmount;
      this.financeStats.processedPayments = data.totalRequests - data.pendingRequests;
      this.financeStats.totalPaid = data.totalAmount;

      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = err.message;
      this.isLoading = false;
    }
  });
}




  financeStats = {
  pendingPayments: 0,
  approvedAmount: 0,
  processedPayments: 0,
  totalPaid: 0
};

}