import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserBookingService {
  private apiUrl = "http://localhost:3000/api/bookings/user-bookings";

  constructor(private http: HttpClient) {}

  getUserBookings(): Observable<any> {
    // Get token from local storage
    const token = localStorage.getItem("token");

    // Create an HTTPHeaders object with the Authorization header
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);

    return this.http.get(this.apiUrl, { headers });
  }
}
