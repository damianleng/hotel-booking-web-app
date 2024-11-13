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
    { id: 1, name: 'Puthika Hok', email: 'puthika@gmail.com', phone: '7859384092812', showEmail: false, image: 'assets/images/user1.png', room: 'Room 101', date: '11-09-24', datecheckout: '11-10-24' },
    { id: 2, name: 'Son Sophak Otra', email: 'sonsopheakotra@gmail.com', phone: '7859384092813', showEmail: false, image: 'assets/images/son.png', room: 'Room 102', date: '11-08-24',datecheckout: '11-10-24' },
    { id: 3, name: 'Srey Vath', email: 'CheySreyVath@gmail.com', phone: '7859384092814', showEmail: false, image: 'assets/images/srey.png', room: 'Room 103', date: '11-08-24',datecheckout: '11-10-24' },
    { id: 4, name: 'Daminly', email: 'Daminly@gmail.com', phone: '7859384092815', showEmail: false, image: 'assets/images/daminly.png', room: 'Room 104', date: '11-14-24',datecheckout: '11-10-24' },
    { id: 5, name: 'Sokha Khem', email: 'sokhakhem@gmail.com', phone: '7859384092816', showEmail: false, image: 'assets/images/user5.png', room: 'Room 105', date: '11-10-24',datecheckout: '11-10-24' },
    { id: 6, name: 'Piseth Noun', email: 'pisethnoun@gmail.com', phone: '7859384092817', showEmail: false, image: 'assets/images/user6.png', room: 'Room 106', date: '11-11-24' },
    { id: 7, name: 'Nary Chan', email: 'narychan@gmail.com', phone: '7859384092818', showEmail: false, image: 'assets/images/user7.png', room: 'Room 107', date: '11-12-24' },
    { id: 8, name: 'Kosal Eang', email: 'kosaleang@gmail.com', phone: '7859384092819', showEmail: false, image: 'assets/images/user8.png', room: 'Room 108', date: '11-13-24' },
    { id: 9, name: 'Nita Chann', email: 'nitachann@gmail.com', phone: '7859384092820', showEmail: false, image: 'assets/images/user9.png', room: 'Room 109', date: '11-15-24' },
    { id: 10, name: 'Serey Chheang', email: 'sereychheang@gmail.com', phone: '7859384092821', showEmail: false, image: 'assets/images/user10.png', room: 'Room 110', date: '11-16-24' },
    { id: 11, name: 'Mony Oudom', email: 'monyoudom@gmail.com', phone: '7859384092822', showEmail: false, image: 'assets/images/user11.png', room: 'Room 111', date: '11-17-24' },
    { id: 12, name: 'Sina Meas', email: 'sinameas@gmail.com', phone: '7859384092823', showEmail: false, image: 'assets/images/user12.png', room: 'Room 112', date: '11-18-24' },
    { id: 13, name: 'Vicheka Rith', email: 'vichekarith@gmail.com', phone: '7859384092824', showEmail: false, image: 'assets/images/user13.png', room: 'Room 113', date: '11-19-24' },
    { id: 14, name: 'Sopheap Roeun', email: 'sopheaproeun@gmail.com', phone: '7859384092825', showEmail: false, image: 'assets/images/user14.png', room: 'Room 114', date: '11-20-24' },
    { id: 15, name: 'Rithy Nou', email: 'rithynou@gmail.com', phone: '7859384092826', showEmail: false, image: 'assets/images/user15.png', room: 'Room 115', date: '11-21-24' },
    { id: 16, name: 'Veasna Kem', email: 'veasnakem@gmail.com', phone: '7859384092827', showEmail: false, image: 'assets/images/user16.png', room: 'Room 116', date: '11-22-24' },
    { id: 17, name: 'Chamroeun Koeut', email: 'chamroeun@gmail.com', phone: '7859384092828', showEmail: false, image: 'assets/images/user17.png', room: 'Room 117', date: '11-23-24' },
    { id: 18, name: 'Lyhong Pan', email: 'lyhongpan@gmail.com', phone: '7859384092829', showEmail: false, image: 'assets/images/user18.png', room: 'Room 118', date: '11-24-24' },
    { id: 19, name: 'Kosal Hout', email: 'kosalhout@gmail.com', phone: '7859384092830', showEmail: false, image: 'assets/images/user19.png', room: 'Room 119', date: '11-25-24' },
    { id: 20, name: 'Theavy Meun', email: 'theavymeun@gmail.com', phone: '7859384092831', showEmail: false, image: 'assets/images/user20.png', room: 'Room 120', date: '11-26-24' }
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
