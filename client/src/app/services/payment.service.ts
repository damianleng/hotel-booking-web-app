import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  
  // Create a payment intent (this sends a request to your backend)
  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-payment-intent`, {
      Amount: amount, // Amount should be in cents (e.g., 1000 = $10)
    });
  }
}
