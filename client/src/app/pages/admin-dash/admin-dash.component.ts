import { Component, OnInit } from "@angular/core";
import { BookingService } from "src/app/services/booking.service";
import { RoomService } from "src/app/services/room.service";

@Component({
  selector: "app-admin-dash",
  templateUrl: "./admin-dash.component.html",
  styleUrls: ["./admin-dash.component.css"],
})
export class AdminDashComponent implements OnInit {
  roomAvailable: number = 0;
  roomBooked: number = 0;
  roomNeedCleaning: number = 0;

  // Will hold data from the API calls
  availableRooms: any[] = [];
  bookedRooms: any[] = [];
  cleaningRooms: any[] = [];
  maintanenceRooms: any[] = [];

  users: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    room: string;
    roomStatus: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
  }> = [];

  bookings: any[] = [];
  attentionRooms: any[] = [];

  searchQuery: string = "";

  filteredUsers = [...this.users];
  selectedDate: string = "";
  showDateInput: boolean = false;

  selectedUser: any = {};
  showEditForm: boolean = false;

  showFilter: boolean = true;
  loading: boolean = false;

  bookingToDelete: string | null = null;

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.fetchAllBookings();
    this.getAvailableRooms();
    this.getAttentionRooms();
    this.setTodayDate();
    this.applyDateFilter();

    document.addEventListener("DOMContentLoaded", () => {
      const elems = document.querySelectorAll(".modal");
      M.Modal.init(elems);
    });
  }

  setTodayDate(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2); // Add leading zero
    const day = ("0" + now.getDate()).slice(-2); // Add leading zero
    this.selectedDate = `${year}-${month}-${day}`; // Format YYYY-MM-DD
  }

  openAvailableRoomsModal(): void {
    const modal = document.getElementById("availableRoomsModal");
    if (modal) {
      const instance = M.Modal.getInstance(modal);
      instance.open();
    }
  }

  openCleaningRoomsModal(): void {
    const modal = document.getElementById("cleaningRoomsModal");
    if (modal) {
      const instance = M.Modal.getInstance(modal);
      instance.open();
    }
  }

  // Function to open the delete confirmation modal
  openDeleteModal(bookingID: string): void {
    this.bookingToDelete = bookingID;
    const modal = document.getElementById("deleteConfirmationModal");
    if (modal) {
      const instance = M.Modal.getInstance(modal);
      instance.open();
    }
  }

  // Function to handle deletion confirmation
  confirmDelete(): void {
    if (this.bookingToDelete) {
      // Call your delete method with the booking ID
      this.deleteBooking(this.bookingToDelete);

      // Close the modal
      const modal = document.getElementById("deleteConfirmationModal");
      if (modal) {
        const instance = M.Modal.getInstance(modal);
        instance.close();
      }

      // Reset the booking ID
      this.bookingToDelete = null;
    }
  }

  // Function to cancel deletion
  cancelDelete(): void {
    this.bookingToDelete = null; // Reset booking ID
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
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so add 1
    const day = date.getUTCDate().toString().padStart(2, "0"); // No need to subtract 1 from the day
    const year = date.getUTCFullYear().toString().slice(2); // Get the last two digits of the year

    return `${month}-${day}-${year}`;
  }

  refreshTable(): void {
    this.fetchAllBookings();
  }

  applyDateFilter() {
    let filtered = this.users;
    let filteredRooms = this.bookedRooms;

    this.showFilter = true;

    if (this.selectedDate) {
      const formattedSelectedDate = this.formatDate(this.selectedDate);

      // format all checkInDates and compare with selectedDate
      filtered = filtered.filter((user) => {
        const formattedCheckInDate = this.formatDate_2(user.checkInDate); // Format each checkInDate
        return formattedCheckInDate === formattedSelectedDate; // Compare formatted dates
      });

      // Filter rooms based on selected date
      filteredRooms = filteredRooms.filter((booking) => {
      const formattedCheckInDate = this.formatDate_2(booking.CheckInDate); // Format each checkInDate
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
    this.bookedRooms = filteredRooms;
    this.showDateInput = false;

    // Update room counts
    this.roomAvailable = this.bookings.filter(
      (booking) => booking.RoomStatus === "Available"
    ).length;
    this.roomNeedCleaning = this.bookings.filter(
      (booking) => booking.RoomStatus === "Cleaning" || booking.RoomStatus === "Maintenance"
    ).length;

    // Call getAttentionRooms with the selected date
    this.getAttentionRooms(this.selectedDate);

    // Call getAvailableRooms with the selected date
    this.getAvailableRooms(this.selectedDate);
  }

  toggleEditForm(index: number): void {
    if (index >= 0) {
      this.selectedUser = { ...this.filteredUsers[index] };
      this.showEditForm = true;
    } else {
      this.showEditForm = false;
    }
  }

  deleteBooking(bookingID: string): void {
    // use the bookingService
    this.bookingService.deleteBooking(bookingID).subscribe(
      (response) => {
        this.fetchAllBookings();
      },
      (error) => {
        console.error("Unable to delete booking: ", error);
      }
    );
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
      // Filter bookings for "Occupied" or "Reserved" status
      const filteredBookings = response.data.filter((booking: any) => 
        booking.RoomStatus === "Occupied" || booking.RoomStatus === "Reserved"
      );

      this.bookings = filteredBookings;
        this.roomBooked = this.bookings.length;

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
          roomStatus: booking.RoomStatus,
        }));
        this.filteredUsers = [...this.users];
        this.bookedRooms = this.bookings;
      },
      (error) => {
        console.error("Error fetching all bookings: ", error);
      }
    );
  }

  getAvailableRooms(selectedDate?: string): void {
    // Step 1: Fetch all rooms
    this.roomService.getAllRooms().subscribe(
      (roomResponse) => {
        // Store all rooms in the component's state
        const allRooms = roomResponse.data;
  
        // Step 2: Fetch all bookings with status "Occupied" or "Reserved"
        this.bookingService.getAllBookings().subscribe(
          (bookingResponse) => {
            let occupiedOrReservedRooms = bookingResponse.data
              .filter(
                (booking: any) =>
                  booking.RoomStatus === "Occupied" ||
                  booking.RoomStatus === "Reserved" ||
                  booking.RoomStatus === "Cleaning" ||
                  booking.RoomStatus === "Maintenance"
              )
              .map((booking: any) => booking.RoomID.RoomNumber);
  
            // If a date is selected, filter the bookings by the selected date
            if (selectedDate) {
              const formattedSelectedDate = this.formatDate(selectedDate);
              occupiedOrReservedRooms = bookingResponse.data
                .filter((booking: any) => {
                  const formattedCheckInDate = this.formatDate_2(booking.CheckInDate);
                  return formattedCheckInDate === formattedSelectedDate;
                })
                .map((booking: any) => booking.RoomID.RoomNumber);
            }
  
            // Step 3: Filter out the rooms that are occupied or reserved
            this.availableRooms = allRooms.filter(
              (room: any) => !occupiedOrReservedRooms.includes(room.RoomNumber)
            );
            this.roomAvailable = this.availableRooms.length;
          },
          (error) => {
            console.error("Error fetching bookings: ", error);
          }
        );
      },
      (error) => {
        console.error("Error fetching rooms: ", error);
      }
    );
  }
  

  getAttentionRooms(selectedDate?: string): void {
    this.bookingService.getAllBookings().subscribe(
      (response) => {
        // Filter bookings for "Cleaning" or "Maintenance" status
        let filteredBookings = response.data.filter(
          (booking: any) =>
            booking.RoomStatus === "Cleaning" || booking.RoomStatus === "Maintenance"
        );
  
        // If a date is selected, filter the bookings by the selected date
        if (selectedDate) {
          const formattedSelectedDate = this.formatDate(selectedDate);
          filteredBookings = filteredBookings.filter((booking: any) => {
            const formattedCheckOutDate = this.formatDate_2(booking.CheckOutDate);
            return formattedCheckOutDate === formattedSelectedDate;
          });
        }
  
        this.attentionRooms = filteredBookings;
        this.roomNeedCleaning = this.attentionRooms.length;
  
        // Map the bookings to match the structure of the rooms needing attention
        this.cleaningRooms = this.attentionRooms
          .filter((booking: any) => booking.RoomStatus === "Cleaning")
          .map((booking: any) => ({
            RoomNumber: booking.RoomID.RoomNumber,
            RoomType: booking.RoomType,
            Status: booking.RoomStatus,
            CheckOutTime: booking.CheckOutTime,
          }));
  
        this.maintanenceRooms = this.attentionRooms
          .filter((booking: any) => booking.RoomStatus === "Maintenance")
          .map((booking: any) => ({
            RoomNumber: booking.RoomID.RoomNumber,
            RoomType: booking.RoomID.RoomType,
            Status: booking.RoomStatus,
            CheckOutTime: booking.CheckOutTime,
          }));
      },
      (error) => {
        console.error("Error fetching all bookings: ", error);
      }
    );
  }
}
