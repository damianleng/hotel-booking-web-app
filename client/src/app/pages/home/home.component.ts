import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  checkIn: string = "";
  checkOut: string = "";
  adults: number | null = null;
  children: number | null = null;
  isFormValid: boolean = false;
  today: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setTodayDate();
  }

  setTodayDate(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2); // Add leading zero
    const day = ("0" + now.getDate()).slice(-2); // Add leading zero
    this.today = `${year}-${month}-${day}`; // Format YYYY-MM-DD
  }

  // validate the dates
  validateDates(): void {
    //
    const checkIn = new Date(this.checkIn);
    const checkOut = new Date(this.checkOut);

    if (checkIn && checkOut && checkOut > checkIn) {
      this.isFormValid = this.validateAdults();
    } else {
      this.isFormValid = false;
    }
  }

  // function to validate adult inputs
  validateAdults(): boolean {
    if (this.adults && this.adults >= 1) {
      return true;
    } else {
      return false;
    }
  }

  searchRooms() {
    const maxPeople = (this.adults || 0) + (this.children || 0);
    // navigate to the room-select page and pass parameters via query params
    this.router.navigate(["/room-select"], {
      queryParams: {
        checkInDate: this.checkIn,
        checkOutDate: this.checkOut,
        maxPeople: maxPeople,
      },
    });
  }
}
