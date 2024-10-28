import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-stay',
  templateUrl: './my-stay.component.html',
  styleUrls: ['./my-stay.component.css']
})
export class MyStayComponent implements OnInit {

  // Room details (dynamic based on booking)
  roomImage: string = '';
  roomName: string = '';
  roomType: string = '';
  guests: number = 0;
  address: string = '';
  confirmationCode: string = '';
  checkInDate: string = '';
  checkInTime: string = '';
  checkOutDate: string = '';
  checkOutTime: string = '';

  // Modal visibility states
  isCheckInModalVisible: boolean = false;
  isCheckOutModalVisible: boolean = false;

  // List of all possible bookings (mock data)
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
      roomType: 'Twin Bedroom',
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the booking ID from the route
    const bookingId = +this.route.snapshot.paramMap.get('bookingId')!;

    // Find the booking with the matching ID
    const selectedBooking = this.bookings.find(booking => booking.bookingId === bookingId);

    // If a booking is found, populate the room details
    if (selectedBooking) {
      this.roomImage = selectedBooking.imageUrl;
      this.roomName = selectedBooking.roomName;
      this.roomType = selectedBooking.roomType;
      this.guests = selectedBooking.guests;
      this.address = selectedBooking.address;
      this.confirmationCode = 'SR-WCP67UTD';  // Assuming static confirmation code for now
      this.checkInDate = selectedBooking.checkInDate;
      this.checkInTime = selectedBooking.checkInTime;
      this.checkOutDate = selectedBooking.checkOutDate;
      this.checkOutTime = selectedBooking.checkOutTime;
    }
  }

  // Open Check-In Time Modal
  openCheckInTime(): void {
    this.isCheckInModalVisible = true;
  }

  // Open Check-Out Time Modal
  openCheckOutTime(): void {
    this.isCheckOutModalVisible = true;
  }

  // Close Modals
  closeModal(): void {
    this.isCheckInModalVisible = false;
    this.isCheckOutModalVisible = false;
  }
}
