import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getAttentionRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/attention`);
  }

  getCurrentRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-rooms`);
  }
}
