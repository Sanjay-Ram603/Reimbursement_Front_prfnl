import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
//import { logoutGuard } from './core/guards/logout.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    //canActivate: [logoutGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    //canActivate: [logoutGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reimbursement',
    canActivate: [authGuard, roleGuard(['Employee'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/reimbursement/reimbursement-list/reimbursement-list.component').then(
            m => m.ReimbursementListComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/reimbursement/reimbursement-create/reimbursement-create.component').then(
            m => m.ReimbursementCreateComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./features/reimbursement/reimbursement-edit/reimbursement-edit.component').then(
            m => m.ReimbursementEditComponent)
      }
    ]
  },
  {
    path: 'my-claims',
    canActivate: [authGuard, roleGuard(['Manager', 'Finance'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/my-claims/my-claims-list/my-claims-list.component').then(
            m => m.MyClaimsListComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/my-claims/my-claims-create/my-claims-create.component').then(
            m => m.MyClaimsCreateComponent)
      },
      {
      path: 'edit/:id',
      loadComponent: () =>
        import('./features/my-claims/my-claims-edit/my-claims-edit.component').then(
          m => m.MyClaimsEditComponent)
    }
    ]
  },
  {
    path: 'approval',
    loadComponent: () =>
      import('./features/approval/approval.component').then(m => m.ApprovalComponent),
    canActivate: [authGuard, roleGuard(['Manager', 'Finance'])]
  },
  {
    path: 'head-approval',
    loadComponent: () =>
      import('./features/head-approval/head-approval.component').then(m => m.HeadApprovalComponent),
    canActivate: [authGuard, roleGuard(['Head'])]
  },
  {
    path: 'head-payment',
    loadComponent: () =>
      import('./features/head-payment/head-payment.component').then(m => m.HeadPaymentComponent),
    canActivate: [authGuard, roleGuard(['Head'])]
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./features/payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard, roleGuard(['Finance'])]
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard, roleGuard(['Manager', 'Finance'])]
  },
  {
    path: 'head-reports',
    loadComponent: () =>
      import('./features/head-reports/head-reports.component').then(m => m.HeadReportsComponent),
    canActivate: [authGuard, roleGuard(['Head'])]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  // Manager advance approval
  {
    path: 'advance-approval',
    canActivate: [authGuard, roleGuard(['Manager'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/advance-approval/advance-approval-list/advance-approval-list.component').then(
            m => m.AdvanceApprovalListComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/advance-approval/advance-approval-create/advance-approval-create.component').then(
            m => m.AdvanceApprovalCreateComponent)
      }
    ]
  },
  // Head reviews advance approvals
  {
    path: 'head-advance-approval',
    canActivate: [authGuard, roleGuard(['Head'])],
    loadComponent: () =>
      import('./features/head-advance-approval/head-advance-approval.component').then(
        m => m.HeadAdvanceApprovalComponent)
  },
  { path: '**', redirectTo: 'login' }
];


