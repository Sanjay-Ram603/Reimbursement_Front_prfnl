import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdvanceApprovalRequest,
  AdvanceApprovalResponse,
  ProcessAdvanceApproval
} from '../models/reimbursement.model';

@Injectable({
  providedIn: 'root'
})
export class AdvanceApprovalService {
  private apiUrl = `${environment.apiUrl}/AdvanceApproval`;

  constructor(private http: HttpClient) {}

  createAdvanceApproval(request: AdvanceApprovalRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, request);
  }

  getMyAdvanceApprovals(): Observable<AdvanceApprovalResponse[]> {
    return this.http.get<AdvanceApprovalResponse[]>(`${this.apiUrl}/my`);
  }

  getPendingAdvanceApprovals(): Observable<AdvanceApprovalResponse[]> {
    return this.http.get<AdvanceApprovalResponse[]>(`${this.apiUrl}/pending`);
  }

  getApprovedAdvanceApprovals(): Observable<AdvanceApprovalResponse[]> {
    return this.http.get<AdvanceApprovalResponse[]>(`${this.apiUrl}/approved`);
  }

  processAdvanceApproval(id: string, request: ProcessAdvanceApproval): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, request, { responseType: 'text' });
  }

  markAdvancePaid(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/pay`, {}, { responseType: 'text' });
  }
}
