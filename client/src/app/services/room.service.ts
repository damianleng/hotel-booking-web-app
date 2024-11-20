import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = "http://localhost:3000/api/rooms";

  constructor(private http: HttpClient) { }

  getAttentionRooms(): Observable <any> {
    return this.http.get(`${this.apiUrl}/attention`)
  }

  getCurrentRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-rooms`);
  }
}
