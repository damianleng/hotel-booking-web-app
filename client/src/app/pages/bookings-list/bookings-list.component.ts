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
  upcomingBookings: any[] = [];
  currentBookings: any[] = [];
  pastBookings: any[] = [];
  noCurrentRooms: boolean = false;
  noUpcomingRooms: boolean = false;
  noPastRooms: boolean = false;

  constructor(private router: Router, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchUserBookings();
  }

  fetchUserBookings() {
    this.bookingService.getUserBookings().subscribe(
      (response) => {
        const currentDate = new Date();

        this.upcomingBookings = response.data.bookings
          .filter((booking: any) => {
            let checkInDate = new Date(booking.CheckInDate);
            checkInDate = new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000);
            // Upcoming bookings are those where CheckInDate is after the current date
            return checkInDate > currentDate;
          })
          .map((booking: any) => this.formatBooking(booking));

        this.currentBookings = response.data.bookings
          .filter((booking: any) => {
            let checkInDate = new Date(booking.CheckInDate);
            checkInDate = new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000);
            let checkOutDate = new Date(booking.CheckOutDate);
            checkOutDate = new Date(checkOutDate.getTime() + 24 * 60 * 60 * 1000);

            return checkInDate <= currentDate && checkOutDate >= currentDate;
          })
          .map((booking: any) => this.formatBooking(booking));

        this.pastBookings = response.data.bookings
          .filter((booking: any) => {
            let checkOutDate = new Date(booking.CheckOutDate);
            checkOutDate = new Date(checkOutDate.getTime() + 24 * 60 * 60 * 1000);
            return checkOutDate < currentDate;
          })
          .map((booking: any) => this.formatBooking(booking));

        this.noCurrentRooms = this.currentBookings.length === 0;
        this.noUpcomingRooms = this.upcomingBookings.length === 0;
        this.noPastRooms = this.pastBookings.length === 0;

        console.log("Upcoming Bookings: ", this.upcomingBookings);
        console.log("Upcoming Bookings: ", this.currentBookings);
        console.log("Past Bookings: ", this.pastBookings);
      },
      (error) => {
        console.error("Error fetching bookings: ", error);

        if (
          error.error &&
          error.error.message === "No bookings found for this user"
        ) {
          this.noCurrentRooms = true;
          this.noUpcomingRooms = true;
          this.noPastRooms = true;
        }
      }
    );
  }

  // Format a booking for consistent display
  private formatBooking(booking: any): any {
    return {
      roomName: `Aurora | ${booking.RoomType}`,
      roomType: booking.RoomType,
      guests: booking.Guests,
      address: "401 Custer Drive, Hays, KS, USA",
      checkInDate: booking.CheckInDate,
      checkInTime: booking.CheckInTime,
      checkOutDate: booking.CheckOutDate,
      checkOutTime: booking.CheckOutTime,
      imageUrl: booking.Image,
      bookingId: booking._id,
      digitalKey: booking.DigitalKey,
    };
  }

  // Navigate to My Stay page with the booking ID
  viewBookingDetails(bookingId: number): void {
    this.router.navigate(["/my-stay", bookingId]);
  }
}
