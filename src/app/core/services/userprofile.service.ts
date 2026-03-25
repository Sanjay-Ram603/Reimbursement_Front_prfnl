

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserProfileResponse,
  UpdateUserProfileRequest
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/UserProfile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(this.apiUrl);
  }

  updateProfile(request: UpdateUserProfileRequest): Observable<any> {
    return this.http.put(this.apiUrl, request);
  }

}