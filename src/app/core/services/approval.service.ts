import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApprovalActionRequest, ApprovalHistoryResponse } from '../models/approval.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiUrl = `${environment.apiUrl}/Approval`;

  constructor(private http: HttpClient) {}

  processApproval(request: ApprovalActionRequest): Observable<any> {
    return this.http.post(this.apiUrl, request, { responseType: 'text' });
  }

  getApprovalHistory(requestId: string): Observable<ApprovalHistoryResponse[]> {
    return this.http.get<ApprovalHistoryResponse[]>(
      `${this.apiUrl}/${requestId}/history`
    );
  }

  downloadAttachment(requestId: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${requestId}/attachment`,
      { responseType: 'blob' }
    );
  }
}