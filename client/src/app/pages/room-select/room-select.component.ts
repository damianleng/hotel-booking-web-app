import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';

@Component({
  selector: 'app-room-select',
  templateUrl: './room-select.component.html',
  styleUrls: ['./room-select.component.css']
})
export class RoomSelectComponent implements OnInit {
  // Room data
  rooms = [
    { 
      name: 'Deluxe Room', 
      price: 200, 
      amenities: ['Wi-Fi', 'TV', 'Mini Bar'], 
      image: '/assets/images/deluxe-room.jpg',
      capacity: 2 
    },
    { 
      name: 'Superior Room', 
      price: 250, 
      amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Balcony'], 
      image: '/assets/images/superior.jpg',
      capacity: 3
    },
    { 
      name: 'Twin Bedroom', 
      price: 275, 
      amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Kitchen'], 
      image: '/assets/images/twin-bed.jpg',
      capacity: 2
    },
    { 
      name: 'Executive Suite', 
      price: 300, 
      amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Jacuzzi'], 
      image: '/assets/images/premium-room.jpg',
      capacity: 4
    },
    { 
      name: 'Luxury Room', 
      price: 350, 
      amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Kitchen'], 
      image: '/assets/images/luxury.jpg',
      capacity: 5
    },
    { 
      name: 'Presidential Suite', 
      price: 500, 
      amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Private Pool'], 
      image: '/assets/images/president.jpg',
      capacity: 6
    }
  ];
  
  // Initialize variables
  selectedRoom: any = null;
  totalPrice: number = 0;
  stayDuration: number = 3;  // Example stay duration
  guests: number = 1;  // Example number of guests

  constructor() {}

  ngOnInit(): void {
    // Initialize Materialize modal for mobile booking summary
    const modalElems = document.querySelectorAll('.modal');
    M.Modal.init(modalElems);
  }
  // Select a room and calculate total price
  selectRoom(room: any): void {
    if (room && room.price) {
      this.selectedRoom = room;
      this.totalPrice = room.price * this.stayDuration;
    } else {
      console.error('Invalid room data:', room);
    }
  }
  // Open mobile booking summary modal
  openBookingSummary(): void {
    const modalElem = document.getElementById('mobileBookingSummary');
    if (modalElem) {
      const modalInstance = M.Modal.getInstance(modalElem);
      modalInstance.open();
    }
  }
  // Book selected room
  bookNow() {
    if (this.selectedRoom) {
      alert(`Room booked: ${this.selectedRoom.name} for ${this.totalPrice} USD.`);
    } else {
      console.error('No room selected');
    }
  }
  // Reset selected room and total price
  resetSelection(): void {
    this.selectedRoom = null;
    this.totalPrice = 0;
  }
  
}
