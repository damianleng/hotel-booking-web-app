import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css']
})
export class BookingsListComponent {

  // Mock data for bookings
  bookings = [
    {
      roomName: 'Aurora | Studio',
      roomType: 'Studio',
      guests: 2,
      address: '401 Custer Drive, Hays, KS, USA',
      checkInDate: 'Dec 11, 2024',
      checkInTime: '4:00 PM',
      checkOutDate: 'Dec 12, 2024',
      checkOutTime: '11:00 AM',
      imageUrl: 'assets/images/premium-room.jpg',
      bookingId: 1
    },
    {
      roomName: 'Aurora | 1BR',
      roomType: '1 Bedroom',
      guests: 4,
      address: '401 Custer Drive, Hays, KS, USA',
      checkInDate: 'Aug 17, 2024',
      checkInTime: '4:00 PM',
      checkOutDate: 'Aug 22, 2024',
      checkOutTime: '11:00 AM',
      imageUrl: 'assets/images/twin-bed.jpg',
      bookingId: 2
    }
  ];

  constructor(private router: Router) {}

  // Navigate to My Stay page with the booking ID
  viewBookingDetails(bookingId: number): void {
    this.router.navigate(['/my-stay', bookingId]);
  }
}
