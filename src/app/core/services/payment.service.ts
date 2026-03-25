

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProcessPaymentRequest } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/Payment`;

  constructor(private http: HttpClient) {}

  processPayment(request: ProcessPaymentRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }
}