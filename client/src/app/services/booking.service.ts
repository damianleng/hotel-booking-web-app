import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  private apiUrl = "http://localhost:3000/api/bookings";

  constructor(private http: HttpClient) {}

  createBooking(bookingData: any): Observable<any> {
    // get the token from local storage
    const token = localStorage.getItem("token");

    // create a header with the token
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    return this.http.post(this.apiUrl, bookingData, { headers });
  }
}