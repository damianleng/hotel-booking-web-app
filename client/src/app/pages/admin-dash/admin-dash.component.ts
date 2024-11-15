import { Component, OnInit } from "@angular/core";
import { BookingService } from "src/app/services/booking.service";

@Component({
  selector: "app-admin-dash",
  templateUrl: "./admin-dash.component.html",
  styleUrls: ["./admin-dash.component.css"],
})
export class AdminDashComponent implements OnInit {
  roomAvailable: number = 3;
  roomBooked: number = 6;
  roomNeedCleaning: number = 6;

  users: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    room: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
  }> = [];

  bookings: any[] = [];

  searchQuery: string = "";

  filteredUsers = [...this.users];
  selectedDate: string = "";
  showDateInput: boolean = false;

  selectedUser: any = {};
  showEditForm: boolean = false;

  showFilter: boolean = true;
  loading: boolean = false;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchAllBookings();
  }

  toggleDateInput() {
    this.showFilter = false;
    this.showDateInput = !this.showDateInput;
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split("-");
    return `${month}-${day}-${year.slice(2)}`;
  }

  formatDate_2(dateString: string): string {
    const date = new Date(dateString);

    // Extract the month, day, and year
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = (date.getUTCDate() - 1).toString().padStart(2, "0"); // Adjust day for formatting
    const year = date.getUTCFullYear().toString().slice(2); // Get the last two digits of the year

    return `${month}-${day}-${year}`;
  }

  applyDateFilter() {
    let filtered = this.users;

    this.showFilter = true;

    if (this.selectedDate) {
      const formattedSelectedDate = this.formatDate(this.selectedDate);

      // format all checkInDates and compare with selectedDate
      filtered = filtered.filter((user) => {
        const formattedCheckInDate = this.formatDate_2(user.checkInDate); // Format each checkInDate
        return formattedCheckInDate === formattedSelectedDate; // Compare formatted dates
      });
    }

    if (this.searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredUsers = filtered;
    this.showDateInput = false;
  }

  toggleEditForm(index: number): void {
    if (index >= 0) {
      this.selectedUser = { ...this.filteredUsers[index] };
      this.showEditForm = true;
    } else {
      this.showEditForm = false;
    }
  }

  saveUser(): void {
    this.loading = true;
    const bookingID = this.selectedUser.id;
    const updatedData = {
      Email: this.selectedUser.email,
      Phone: this.selectedUser.phone,
      Room: this.selectedUser.room,
      CheckInDate: this.selectedUser.checkInDate,
      CheckInTime: this.selectedUser.checkInTime,
      CheckOutDate: this.selectedUser.checkOutDate,
      CheckOutTime: this.selectedUser.checkOutTime,
    };

    console.log(this.selectedUser.checkInDate);
    console.log(this.selectedUser.checkOutDate);

    // use the bookingService
    this.bookingService.updateBookingAdmin(bookingID, updatedData).subscribe(
      (response) => {
        console.log("Booking updated successfully!", response);
        this.fetchAllBookings();
        this.showEditForm = false;
        this.loading = false;
      },
      (error) => {
        console.error("Error updating booking:", error);
        this.loading = false;
      }
    );
  }

  fetchAllBookings() {
    this.bookingService.getAllBookings().subscribe(
      (response) => {
        this.bookings = response.data;

        // Map the bookings to match the structure of the users
        this.users = this.bookings.map((booking: any) => ({
          id: booking._id,
          name: booking.UserID.Name,
          email: booking.Email,
          phone: booking.Phone,
          room: booking.RoomID.RoomNumber,
          checkInDate: booking.CheckInDate,
          checkInTime: booking.CheckInTime,
          checkOutDate: booking.CheckOutDate,
          checkOutTime: booking.CheckOutTime,
        }));
        this.filteredUsers = [...this.users];
      },
      (error) => {
        console.error("Error fetching all bookings: ", error);
      }
    );
  }
}
