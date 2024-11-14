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
            checkInTime: booking.CheckInTime,
            checkOutDate: new Date(booking.CheckOutDate).toLocaleDateString(),
            checkOutTime: booking.CheckOutTime,
            imageUrl: booking.Image,
            bookingId: booking._id,
            digitalKey: booking.DigitalKey
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