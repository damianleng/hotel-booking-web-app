import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-housekeeping-dash',
  templateUrl: './housekeeping-dash.component.html',
  styleUrls: ['./housekeeping-dash.component.css']
})
export class HousekeepingDashComponent implements OnInit {

  rooms = [
    {
      roomName: 'Aurora | Single',
      guestName: 'John Doe',
      guestRoom: '101',
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      needsCleaning: true
    },
    {
      roomName: 'Aurora | Double',
      guestName: 'Jane Smith',
      guestRoom: '102',
      checkInTime: '3:00 PM',
      checkOutTime: '12:00 PM',
      needsCleaning: false
    },
    {
      roomName: 'Aurora | Suite',
      guestName: 'Alice Brown',
      guestRoom: '103',
      checkInTime: '4:00 PM',
      checkOutTime: '10:00 AM',
      needsCleaning: true
    }
  ];

  filteredRooms = this.rooms;
  selectedStatus = 'all';

  constructor() {}

  ngOnInit(): void {
    this.filterRooms(); // Initial filter
  }

  filterRooms(): void {
    if (this.selectedStatus === 'needs-cleaning') {
      this.filteredRooms = this.rooms.filter(room => room.needsCleaning);
    } else if (this.selectedStatus === 'clean') {
      this.filteredRooms = this.rooms.filter(room => !room.needsCleaning);
    } else {
      this.filteredRooms = this.rooms;
    }
  }

  markAsClean(room: any): void {
    room.needsCleaning = false;
    this.filterRooms(); // Refresh table if needed
  }
  
}
