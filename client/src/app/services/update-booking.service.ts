import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UpdateBookingService {
  private apiUrl = "http://localhost:3000/api/bookings";

  constructor(private http: HttpClient) {}

  updateBooking(updatedBooking: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${updatedBooking.bookingId}`, updatedBooking);
  }
}
