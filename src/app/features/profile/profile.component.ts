import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '../../core/services/userprofile.service';
import {
  UserProfileResponse,
  UpdateUserProfileRequest
} from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: UserProfileResponse = {
    userId: '',
    email: '',
    firstName: '',
    lastName: ''
  };

  updateData: UpdateUserProfileRequest = {
    email: '',
    firstName: '',
    lastName: ''
  };

  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isEditMode: boolean = false;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userProfileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.updateData = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onUpdate(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.userProfileService.updateProfile(this.updateData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.isSaving = false;
        this.isEditMode = false;
        this.loadProfile();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSaving = false;
      }
    });
  }
}