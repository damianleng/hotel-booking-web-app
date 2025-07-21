import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BookingService } from "src/app/services/booking.service";

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
  roomNumber: string = "";
  guests: number = 0;
  address: string = "";
  confirmationCode: string = "";
  checkInDate: string = "";
  checkInTime: string = "";
  checkOutDate: string = "";
  checkOutTime: string = "";
  bookingId: string = "";
  digitalKey: number = 0;

  newCheckInTime: string = "";
  newCheckOutTime: string = "";
  checkInChanged: boolean = false;
  checkOutChanged: boolean = false;

  isUpdateSuccessful: boolean = false;
  // Modal visibility states
  isCheckInModalVisible: boolean = false;
  isCheckOutModalVisible: boolean = false;
  validationMessage: string = "";
  isValid: boolean = false;

  loading: boolean = false;

  bookings: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    // Get the booking ID from the route
    const bookingId = this.route.snapshot.paramMap.get("bookingId");

    this.fetchUserBookings(bookingId);
  }

  // Subscriber to retrieve user bookings from server-side
  fetchUserBookings(bookingId: string | null) {
    this.bookingService.getUserBookings().subscribe(
      (response) => {
        this.bookings = response.data.bookings.map((booking: any) => {
          return {
            roomName: `Aurora | ${booking.RoomType}`,
            roomNumber: booking.RoomID.RoomNumber,
            roomType: booking.RoomType,
            guests: booking.Guests,
            address: "401 Custer Drive, Hays, KS, USA",
            checkInDate: new Date(booking.CheckInDate),
            checkInTime: booking.CheckInTime,
            checkOutDate: new Date(booking.CheckOutDate),
            checkOutTime: booking.CheckOutTime,
            imageUrl: booking.Image,
            bookingId: booking._id,
            digitalKey: booking.DigitalKey
          };
        });

        // Find the booking that matches the bookingId
        const selectedBooking = this.bookings.find(
          (booking) => booking.bookingId === bookingId
        );

        if (selectedBooking) {
          this.roomImage = selectedBooking.Image;
          this.roomName = selectedBooking.roomName;
          this.roomType = selectedBooking.roomType;
          this.roomNumber = selectedBooking.roomNumber;
          this.guests = selectedBooking.guests;
          this.address = selectedBooking.address;
          this.confirmationCode = selectedBooking.bookingId;
          this.checkInDate = selectedBooking.checkInDate;
          this.checkInTime = selectedBooking.checkInTime;
          this.checkOutDate = selectedBooking.checkOutDate;
          this.checkOutTime = selectedBooking.checkOutTime;
          this.bookingId = selectedBooking.bookingId;
          this.digitalKey = selectedBooking.digitalKey;
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

  updateCheckInTime(newTime: string) {
    const [hours, minutes] = newTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
  
    // Updated range: 15:00 (900 minutes) to 23:59 (1439 minutes)
    if (totalMinutes >= 15 * 60 && totalMinutes <= 23 * 60 + 59) {
      this.isValid = true; // Mark input as valid
      this.validationMessage = ""; // Clear any previous validation message
    } else {
      this.isValid = false; // Mark input as invalid
      this.validationMessage = "Invalid Check-In Time. Must be between 15:00 and 23:59.";
    }
  }

  confirmCheckInTime() {
    if (this.isValid) {
      this.newCheckInTime = this.newCheckInTime || this.checkInTime;
      this.checkInChanged = this.newCheckInTime !== this.checkInTime;
      this.isCheckInModalVisible = false; // Close the modal
    } else {
      this.validationMessage = "Please enter a valid Check-In Time before confirming.";
    }
  }
  
  updateCheckOutTime(newTime: string) {
    const [hours, minutes] = newTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
  
    // Updated range: 01:00 (60 minutes) to 12:00 (720 minutes)
    if (totalMinutes >= 1 * 60 && totalMinutes <= 12 * 60) {
      this.isValid = true; // Mark input as valid
      this.validationMessage = ""; // Clear any previous validation message
    } else {
      this.isValid = false; // Mark input as invalid
      this.validationMessage = "Invalid Check-Out Time. Must be between 01:00 and 12:00.";
    }
  }
  
  confirmCheckOutTime() {
    if (this.isValid) {
      this.newCheckOutTime = this.newCheckOutTime || this.checkOutTime;
      this.checkOutChanged = this.newCheckOutTime !== this.checkOutTime;
      this.isCheckOutModalVisible = false; // Close the modal
    } else {
      this.validationMessage = "Please enter a valid Check-Out Time before confirming.";
    }
  }
  

  // Check if both times have been changed
  areTimesChanged(): boolean {
    return this.checkInChanged || this.checkOutChanged;
  }

  // Method to update the checkIn and checkOut times
  updateBooking() {
    this.loading = true;
    const updatedBooking = {
      bookingId: this.bookingId,
      CheckInTime: this.newCheckInTime || this.checkInTime,
      CheckOutTime: this.newCheckOutTime || this.checkOutTime,
      DigitalKey: Math.floor(1000 + Math.random() * 9000) // Generate 4-digit random number
    };

    // Subscriber to update bookings
    this.bookingService.updateBooking(updatedBooking).subscribe(
      (response) => {
        console.log("Booking updated successfully", response);
        this.isUpdateSuccessful = true;
        this.loading = false;
        window.location.reload();
      },
      (error) => {
        console.error("Error updating booking: ", error);
        this.loading = false;
      }
    );
  }

  // Close Modals
  closeModal(): void {
    this.validationMessage = "";
    this.isCheckInModalVisible = false;
    this.isCheckOutModalVisible = false;
  }
}
