import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReimbursementReport } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/Report`;

  constructor(private http: HttpClient) {}

  generateReport(
    fromDate: string,
    toDate: string,
    status: string | null = null,
    role: string | null = null,
    startIndex: number = 0,
    pageSize: number = 5
  ): Observable<ReimbursementReport[]> {
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    let params = new HttpParams()
      .set('fromDate', from.toISOString())
      .set('toDate', to.toISOString())
      .set('startIndex', startIndex.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<ReimbursementReport[]>(this.apiUrl, { params });
  }

  getTotalCount(
    fromDate: string,
    toDate: string,
    status: string | null = null,
    role: string | null = null
  ): Observable<number> {
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    let params = new HttpParams()
      .set('fromDate', from.toISOString())
      .set('toDate', to.toISOString());

    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<number>(`${this.apiUrl}/count`, { params });
  }
}