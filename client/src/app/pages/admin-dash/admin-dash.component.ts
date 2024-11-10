import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.css']
})
export class AdminDashComponent implements OnInit {
  roomAvailable: number = 3;
  roomBooked: number = 6;
  roomNeedCleaning: number = 6;

  // roomAvailablePercentage: number = 30;
  // roomBookedPercentage: number = 60;
  // roomNeedCleaningPercentage: number = 60;

  users = [
    { id: 1, name: 'Puthika Hok', email: 'puthika@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/user1.png', room: 'Room 101', date: '11-09-24' },
    { id: 2, name: 'Son Sophak Otra', email: 'sonsopheakotra@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/son.png', room: 'Room 102', date: '11-08-24' },
    { id: 3, name: 'Srey Vath', email: 'CheySreyVath@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/srey.png', room: 'Room 103', date: '11-08-24' },
    { id: 4, name: 'Daminly', email: 'Damainly@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/daminly.png', room: 'Room 104', date: '11-14-24' },
    { id: 5, name: 'Daminly', email: 'Damainly@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/daminly.png', room: 'Room 104', date: '11-14-24' },
    { id: 6, name: 'Daminly', email: 'Damainly@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/daminly.png', room: 'Room 104', date: '11-14-24' },
    { id: 7, name: 'Daminly', email: 'Damainly@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/daminly.png', room: 'Room 104', date: '11-14-24' },
    { id: 8, name: 'Daminly', email: 'Damainly@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/daminly.png', room: 'Room 104', date: '11-14-24' },
  ];

  searchQuery: string = '';
  
  filteredUsers = [...this.users];
  selectedDate: string = ''; 
  showDateInput: boolean = false; 

  selectedUser: any = null;
  showEditForm: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleDateInput() {
    this.showDateInput = !this.showDateInput;
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${month}-${day}-${year.slice(2)}`;
  }

  applyDateFilter() {
    let filtered = this.users;
    
    if (this.selectedDate) {
      const formattedSelectedDate = this.formatDate(this.selectedDate); 
      filtered = filtered.filter(user => user.date === formattedSelectedDate);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredUsers = filtered;
    this.showDateInput = false;
  }

  toggleEmailVisibility(i: number): void {
    this.filteredUsers[i].showEmail = !this.filteredUsers[i].showEmail;
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
    const userIndex = this.users.findIndex(user => user.id === this.selectedUser.id);

    if (userIndex > -1) {
      this.users[userIndex] = { ...this.selectedUser };
      this.applyDateFilter(); // Reapply filter to refresh `filteredUsers`
    }

    this.showEditForm = false;
  }
}
