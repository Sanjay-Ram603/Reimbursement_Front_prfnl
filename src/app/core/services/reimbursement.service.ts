import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ReimbursementRequestResponse,
  UpdateReimbursementRequest,
  ExpenseCategory
} from '../models/reimbursement.model';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  private apiUrl = `${environment.apiUrl}/ReimbursementRequest`;
  private categoryUrl = `${environment.apiUrl}/ExpenseCategory`;

  constructor(private http: HttpClient) {}

  // ✅ CREATE REQUEST WITH FILE - sends as FormData
  createRequest(
    expenseCategoryId: string,
    amount: number,
    description: string,
    expenseDate: string,
    attachment: File
  ): Observable<string> {
    const formData = new FormData();
    formData.append('ExpenseCategoryId', expenseCategoryId);
    formData.append('Amount', amount.toString());
    formData.append('Description', description);
    formData.append('ExpenseDate', expenseDate);
    formData.append('Attachment', attachment, attachment.name);
    return this.http.post<string>(this.apiUrl, formData);
  }

  // ✅ GET MY REQUESTS
  getMyRequests(): Observable<ReimbursementRequestResponse[]> {
    return this.http.get<ReimbursementRequestResponse[]>(this.apiUrl);
  }

  // ✅ GET BY ID
  getById(id: string): Observable<ReimbursementRequestResponse> {
    return this.http.get<ReimbursementRequestResponse>(`${this.apiUrl}/${id}`);
  }

  // ✅ UPDATE REQUEST
 updateRequest(id: string, request: { amount?: number; description?: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, request, { responseType: 'text' });
}

  getAllRequests(): Observable<ReimbursementRequestResponse[]> {
  return this.http.get<ReimbursementRequestResponse[]>(`${this.apiUrl}/all`);
}

  // ✅ DELETE REQUEST
  deleteRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getHeadRequests(): Observable<ReimbursementRequestResponse[]> {
  return this.http.get<ReimbursementRequestResponse[]>(`${this.apiUrl}/head`);
}

  // ✅ DOWNLOAD ATTACHMENT
  downloadAttachment(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: 'blob'
    });
  }

  // ✅ GET EXPENSE CATEGORIES
  getExpenseCategories(): Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>(this.categoryUrl);
  }
}