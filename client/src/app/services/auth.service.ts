import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private idleTimeout: any;
  private idleTimeLimits = 15 * 60 * 1000;
  private events = ["mousemove", "keydown", "scroll", "click"];

  constructor(private http: HttpClient, private router: Router) {
    this.setIdleTimer();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    this.router.navigate(["/home"]); // Redirect to home after logout
  }

  // Check if the token has expired
  checkTokenExpiry(): void {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp < currentTime) {
          // Token expired
          this.logout();
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }

  // setup the idle timer to check for user activity
  setIdleTimer() {
    this.resetIdleTimer(); // start the idle timer initially
    this.events.forEach((event) =>
      window.addEventListener(event, () => this.resetIdleTimer())
    );
  }

  // reset the idle timer
  resetIdleTimer() {
    clearTimeout(this.idleTimeout); // clear the previous timer
    this.idleTimeout = setTimeout(() => {
      // user has been idled for too long
      this.logout();
    }, this.idleTimeLimits);
  }
}
