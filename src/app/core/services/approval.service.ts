

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApprovalActionRequest } from '../models/approval.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiUrl = `${environment.apiUrl}/Approval`;

  constructor(private http: HttpClient) {}

  processApproval(request: ApprovalActionRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }
}