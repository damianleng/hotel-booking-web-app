import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import * as M from "materialize-css";
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-room-select",
  templateUrl: "./room-select.component.html",
  styleUrls: ["./room-select.component.css"],
})
export class RoomSelectComponent implements OnInit {
  // Room data
  checkInDate: string = "";
  checkOutDate: string = "";
  maxPeople: number = 0;
  availableRooms: any[] = [];
  adults: number | null = null;
  children: number | null = null;
  isFormValid: boolean = false;
  noRooms: boolean = false;
  today: string = "";

  // Initialize variables
  selectedRoom: any = null;
  totalPrice: number = 0;
  stayDuration: number = 0; // Example stay duration
  guests: number = 0; // Example number of guests

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize Materialize modal for mobile booking summary
    this.setTodayDate();
    const modalElems = document.querySelectorAll(".modal");
    M.Modal.init(modalElems);

    // Retrieve query params
    this.route.queryParams.subscribe((params) => {
      this.checkInDate = params["checkInDate"];
      this.checkOutDate = params["checkOutDate"];
      this.maxPeople = params["maxPeople"];
    });

    // Fetch available rooms based on query params
    this.getAvailableRooms(this.checkInDate, this.checkOutDate, this.maxPeople);
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
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

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

  // Function to fetch avaialble rooms from server-side
  getAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    maxPeople: number
  ) {
    const apiUrl = `${environment.apiUrl}/bookings/availability`;

    // call backend api to fetch rooms
    this.http
      .get(apiUrl, {
        params: {
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          maxPeople: maxPeople.toString(),
        },
      })
      .subscribe(
        (response: any) => {
          this.availableRooms = response.availableRooms;
          console.log("Available rooms: ", this.availableRooms);

          if (this.availableRooms.length === 0) {
            this.noRooms = true;
          }
        },
        (error) => {
          console.error("Error fetching rooms", error);
        }
      );
  }

  // function to continue searching after intitial search
  continueSearch(): void {
    const maxPeople = (this.adults || 0) + (this.children || 0);
    this.getAvailableRooms(this.checkInDate, this.checkOutDate, maxPeople);
  }

  // calculate the stay duration
  calculateStayDuration(checkInDate: string, checkOutDate: string): number {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const timeDifference = checkOut.getTime() - checkIn.getTime();

    return timeDifference / (1000 * 60 * 60 * 24);
  }

  // Select a room and calculate total price
  selectRoom(room: any): void {
    if (room && room.Price && room.MaxPeople) {
      // condition to check if a room is selected, will set the button to be disabled
      if (this.selectedRoom && this.selectedRoom != room) {
        this.selectedRoom = null;
      }

      // assign the selectedRoom
      this.selectedRoom = room;

      // calculate the stay duration
      this.stayDuration = this.calculateStayDuration(
        this.checkInDate,
        this.checkOutDate
      );

      // calculate the total price
      this.totalPrice = room.Price * this.stayDuration;

      // set the guests
      this.guests = room.MaxPeople;
    } else {
      console.error("Invalid room data:", room);
    }
  }

  // Open mobile booking summary modal
  openBookingSummary(): void {
    const modalElem = document.getElementById("mobileBookingSummary");
    if (modalElem) {
      const modalInstance = M.Modal.getInstance(modalElem);
      modalInstance.open();
      // Set a slight delay to ensure overflow is reset after modal opens
      setTimeout(() => {
        document.body.style.overflow = "visible"; // Override overflow set by Materialize
      }, 100);
    }
  }
  // Book selected room
  bookNow() {
    if (this.selectedRoom) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !user.id) {
        console.error("User not logged in or user ID not found");
        return;
      }
      console.log("User ID:", user.id);
      this.router.navigate(["/checkout"], {
        queryParams: {
          UserID: user.id, // Use the logged-in user's ID
          RoomID: this.selectedRoom._id,
          roomType: this.selectedRoom.RoomType,
          guests: this.guests,
          amenities: this.selectedRoom.Amenities,
          image: this.selectedRoom.Image,
          CheckInDate: this.checkInDate,
          CheckOutDate: this.checkOutDate,
          duration: this.stayDuration,
          totalPrice: this.totalPrice,
        },
      });
    } else {
      console.error("No Room Selected");
    }
  }

  // Reset selected room and total price
  resetSelection(): void {
    this.selectedRoom = null;
    this.totalPrice = 0;
    this.stayDuration = 0;
    this.guests = 0;
  }
}
