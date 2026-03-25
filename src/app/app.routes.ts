import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      )
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
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
            (m) => m.ReimbursementListComponent
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/reimbursement/reimbursement-create/reimbursement-create.component').then(
            (m) => m.ReimbursementCreateComponent
          )
      },

      {
      path: 'edit/:id',
      loadComponent: () =>
        import('./features/reimbursement/reimbursement-edit/reimbursement-edit.component').then(
          (m) => m.ReimbursementEditComponent
        )
    }
    ]
  },
  {
    path: 'approval',
    loadComponent: () =>
      import('./features/approval/approval.component').then(
        (m) => m.ApprovalComponent
      ),
    canActivate: [authGuard, roleGuard(['Admin', 'Finance'])]
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./features/payment/payment.component').then(
        (m) => m.PaymentComponent
      ),
    canActivate: [authGuard, roleGuard(['Finance'])]
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
    canActivate: [authGuard, roleGuard(['Admin', 'Finance'])]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      )
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];