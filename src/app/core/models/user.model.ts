

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  createdAt: Date;
}

export interface Role {
  roleId: string;
  roleName: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  expiration: Date;
}

export interface RegisterResponse {
  userId: string;
  email: string;
}

export interface UserProfileResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserProfileRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
}