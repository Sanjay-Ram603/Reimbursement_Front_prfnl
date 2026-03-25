import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: ''
  };

  roles = [
    { id: 'B9AD34D1-65C4-47BE-9295-C752ABA187EB', name: 'Manager' },
    { id: 'A61036DA-ED2D-4F28-8F1D-FDB73738BAFB', name: 'Employee' },
    { id: 'B57A53CB-8B0C-431C-A321-41ABC9007692', name: 'Finance' }
  ];

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.registerData.roleId) {
      this.errorMessage = 'Please select a role!';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
}