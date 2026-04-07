import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: ''
  };

  roles: Role[] = [];

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  // ✅ Validation error messages
  errors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getRoles().subscribe({
      next: (data) => { this.roles = data; },
      error: () => { this.errorMessage = 'Failed to load roles. Please refresh.'; }
    });
  }

  // ✅ Validate First Name
  validateFirstName(): void {
    const value = this.registerData.firstName.trim();
    if (!value) {
      this.errors.firstName = 'First name is required!';
    } else if (/\d/.test(value)) {
      this.errors.firstName = 'First name cannot contain numbers!';
    } else if (value.length < 2) {
      this.errors.firstName = 'First name must be at least 2 characters!';
    } else {
      this.errors.firstName = '';
    }
  }

  // ✅ Validate Last Name
  validateLastName(): void {
    const value = this.registerData.lastName.trim();
    if (!value) {
      this.errors.lastName = 'Last name is required!';
    } else if (/\d/.test(value)) {
      this.errors.lastName = 'Last name cannot contain numbers!';
    } else if (value.length < 2) {
      this.errors.lastName = 'Last name must be at least 2 characters!';
    } else {
      this.errors.lastName = '';
    }
  }

  // ✅ Validate Email
  validateEmail(): void {
    const value = this.registerData.email.trim();
    if (!value) {
      this.errors.email = 'Email is required!';
    } else if (!value.endsWith('@gmail.com')) {
      this.errors.email = 'Email must be a valid @gmail.com address!';
    } else {
      this.errors.email = '';
    }
  }

  // ✅ Validate Password
  validatePassword(): void {
    const value = this.registerData.password;
    if (!value) {
      this.errors.password = 'Password is required!';
    } else if (value.length < 8) {
      this.errors.password = 'Password must be at least 8 characters!';
    } else if (!/[A-Z]/.test(value)) {
      this.errors.password = 'Password must contain at least one uppercase letter!';
    } else if (!/[0-9]/.test(value)) {
      this.errors.password = 'Password must contain at least one number!';
    } else {
      this.errors.password = '';
    }
  }

  // ✅ Validate Role
  validateRole(): void {
    if (!this.registerData.roleId) {
      this.errors.roleId = 'Please select a role!';
    } else {
      this.errors.roleId = '';
    }
  }

  // ✅ Check if form is valid
  isFormValid(): boolean {
    return (
      !this.errors.firstName &&
      !this.errors.lastName &&
      !this.errors.email &&
      !this.errors.password &&
      !this.errors.roleId &&
      this.registerData.firstName.trim() !== '' &&
      this.registerData.lastName.trim() !== '' &&
      this.registerData.email.trim() !== '' &&
      this.registerData.password !== '' &&
      this.registerData.roleId !== ''
    );
  }

  // ✅ Password Strength Calculator
getPasswordStrength(): number {
  const password = this.registerData.password;
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength += 33;
  if (/[A-Z]/.test(password)) strength += 33;
  if (/[0-9]/.test(password)) strength += 34;
  return strength;
}

// ✅ Password Strength Label
getPasswordLabel(): string {
  const strength = this.getPasswordStrength();
  if (strength <= 33) return 'Weak';
  if (strength <= 66) return 'Medium';
  return 'Strong';
}

  onRegister(): void {
    // ✅ Run all validations before submitting
    this.validateFirstName();
    this.validateLastName();
    this.validateEmail();
    this.validatePassword();
    this.validateRole();

    if (!this.isFormValid()) {
      return; // Stop if any validation fails
    }

    this.errorMessage = '';
    this.successMessage = '';
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