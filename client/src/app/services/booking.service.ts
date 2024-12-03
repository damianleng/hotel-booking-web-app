import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private apiUrl = "http://localhost:3000/api/bookings";

  constructor(private http: HttpClient) {}

  createBooking(bookingData: any): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }

  updateBooking(updatedBooking: any): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${updatedBooking.bookingId}`,
      updatedBooking
    );
  }

  updateBookingStatus(updateBooking: any): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/update-status/${updateBooking.bookingId}`,
      updateBooking
    );
  }

  updateBookingAdmin(bookingID: string, updatedData: any) {
    return this.http.patch(`${this.apiUrl}/${bookingID}`, updatedData);
  }

  getUserBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-bookings`);
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  deleteBooking(bookingID: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingID}`);
  }
}
