import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BookingService } from "src/app/services/booking.service";

@Component({
  selector: "app-bookings-list",
  templateUrl: "./bookings-list.component.html",
  styleUrls: ["./bookings-list.component.css"],
})
export class BookingsListComponent {
  // Mock data for bookings
  bookings: any[] = [];
  noRooms: boolean = false;

  constructor(
    private router: Router,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.fetchUserBookings();
  }

  fetchUserBookings() {
    this.bookingService.getUserBookings().subscribe(
      (response) => {
        this.bookings = response.data.bookings.map((booking: any) => {
          return {
            roomName: `Aurora | ${booking.RoomType}`,
            roomType: booking.RoomType,
            guests: booking.Guests,
            address: "401 Custer Drive, Hays, KS, USA",
            checkInDate: new Date(booking.CheckInDate).toLocaleDateString(),
            checkInTime: "4:00 PM",
            checkOutDate: new Date(booking.CheckOutDate).toLocaleDateString(),
            checkOutTime: "11:00 AM",
            imageUrl: booking.Image,
            bookingId: booking._id,
          };
        });
        console.log(response.data.bookings);
      },
      (error) => {
        console.error("Error fetching bookings: ", error);
      }
    );
  }

  // Navigate to My Stay page with the booking ID
  viewBookingDetails(bookingId: number): void {
    this.router.navigate(["/my-stay", bookingId]);
  }
}