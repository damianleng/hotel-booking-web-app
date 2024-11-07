import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserBookingService } from "src/app/services/user-booking.service";
import { UpdateBookingService } from "src/app/services/update-booking.service";
import { error } from "console";

@Component({
  selector: "app-my-stay",
  templateUrl: "./my-stay.component.html",
  styleUrls: ["./my-stay.component.css"],
})
export class MyStayComponent implements OnInit {
  // Room details (dynamic based on booking)
  roomImage: string = "";
  roomName: string = "";
  roomType: string = "";
  guests: number = 0;
  address: string = "";
  confirmationCode: string = "";
  checkInDate: string = "";
  checkInTime: string = "";
  checkOutDate: string = "";
  checkOutTime: string = "";
  bookingId: string = "";

  newCheckInTime: string = "";
  newCheckOutTime: string = "";
  checkInChanged: boolean = false;
  checkOutChanged: boolean = false;

  isUpdateSuccessful: boolean = false;

  // Modal visibility states
  isCheckInModalVisible: boolean = false;
  isCheckOutModalVisible: boolean = false;

  bookings: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private userBookingService: UserBookingService,
    private updateBookingService: UpdateBookingService
  ) {}

  ngOnInit(): void {
    // Get the booking ID from the route
    const bookingId = this.route.snapshot.paramMap.get("bookingId");

    this.fetchUserBookings(bookingId);
  }

  fetchUserBookings(bookingId: string | null) {
    this.userBookingService.getUserBookings().subscribe(
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
          };
        });

        // Find the booking that matches the bookingId
        const selectedBooking = this.bookings.find(
          (booking) => booking.bookingId === bookingId
        );

        if (selectedBooking) {
          this.roomImage = selectedBooking.imageUrl;
          this.roomName = selectedBooking.roomName;
          this.roomType = selectedBooking.roomType;
          this.guests = selectedBooking.guests;
          this.address = selectedBooking.address;
          this.confirmationCode = selectedBooking.bookingId;
          this.checkInDate = selectedBooking.checkInDate;
          this.checkInTime = selectedBooking.checkInTime;
          this.checkOutDate = selectedBooking.checkOutDate;
          this.checkOutTime = selectedBooking.checkOutTime;
          this.bookingId = selectedBooking.bookingId;
        }
      },
      (error) => {
        console.error("Error fetching bookings: ", error);
      }
    );
  }

  // Open Check-In Time Modal
  openCheckInTime(): void {
    this.isCheckInModalVisible = true;
  }

  // Open Check-Out Time Modal
  openCheckOutTime(): void {
    this.isCheckOutModalVisible = true;
  }

  // Method to handle updated check-in time
  updateCheckInTime(newTime: string) {
    this.newCheckInTime = newTime;
    this.checkInChanged = this.newCheckInTime !== this.checkInTime;
    console.log("Updated Check-In Time:", this.newCheckInTime);
    // Add your logic to update the check-in time in the backend if needed
  }

  // Method to handle updated check-out time
  updateCheckOutTime(newTime: string) {
    this.newCheckOutTime = newTime;
    this.checkOutChanged = this.newCheckOutTime !== this.checkOutTime;
    console.log("Updated Check-In Time:", this.newCheckOutTime);
    // Add your logic to update the check-in time in the backend if needed
  }

  // Check if both times have been changed
  areTimesChanged(): boolean {
    return this.checkInChanged || this.checkOutChanged;
  }

  // Method to update the checkIn and checkOut times
  updateBooking() {
    const updatedBooking = {
      bookingId: this.bookingId,
      CheckInTime: this.newCheckInTime || this.checkInTime,
      CheckOutTime: this.newCheckOutTime || this.checkOutTime,
    };

    this.updateBookingService.updateBooking(updatedBooking).subscribe(
      (response) => {
        console.log("Booking updated successfully", response);
        this.isUpdateSuccessful = true;
        window.location.reload();
      },
      (error) => {
        console.error("Error updating booking: ", error);
      }
    );
  }

  // Close Modals
  closeModal(): void {
    this.isCheckInModalVisible = false;
    this.isCheckOutModalVisible = false;
  }
}
