import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-housekeeping-dash',
  templateUrl: './housekeeping-dash.component.html',
  styleUrls: ['./housekeeping-dash.component.css']
})
export class HousekeepingDashComponent implements OnInit {

  rooms: any[] = [];
  filteredRooms: any[] = [];
  selectedStatus = 'all';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.getCleaningRooms(); // Initial filter
  }

  getCleaningRooms(): void {
    this.bookingService.getAllBookings().subscribe(
      (response) => {
        // Filter bookings for "Cleaning" status
        this.rooms = response.data.filter(
          (booking: any) => booking.RoomStatus === 'Cleaning' || booking.RoomStatus === 'Cleaned'
        ).map((booking: any) => ({
          roomName: `Aurora | ${booking.RoomType}`,
          guestName: booking.UserID.Name,
          guestRoom: booking.RoomID.RoomNumber,
          checkInTime: booking.CheckInTime,
          checkOutTime: booking.CheckOutTime,
          needsCleaning: booking.RoomStatus,
          bookingId: booking._id
        }));
        this.filterRooms(); // Apply initial filter
      },
      (error) => {
        console.error('Error fetching bookings: ', error);
      }
    );
  }

  filterRooms(): void {
    if (this.selectedStatus === 'needs-cleaning') {
      this.filteredRooms = this.rooms.filter(room => room.needsCleaning === 'Cleaning');
    } else if (this.selectedStatus === 'clean') {
      this.filteredRooms = this.rooms.filter(room => room.needsCleaning === 'Cleaned');
    } else {
      this.filteredRooms = this.rooms;
    }
  }

  markAsClean(room: any): void {
    room.needsCleaning = false;
    const updatedBooking = {
      bookingId: room.bookingId,
      RoomStatus: "Cleaned",
    };
  
    this.bookingService.updateBooking(updatedBooking).subscribe(
      (response) => {
        console.log("Room status updated to Cleaned", response);
        this.filterRooms(); // Refresh table if needed
      },
      (error) => {
        console.error("Error updating room status:", error);
      }
    );
  }
  
}
