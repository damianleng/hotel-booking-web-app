import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  rePassword: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  register() {
    console.log('Register button clicked');
    if (this.password !== this.rePassword) {
      alert('Passwords do not match');
      return;
    }

    const user = {
      email: this.email,
      password: this.password,
      name: `${this.firstName} ${this.lastName}`,
      phoneNumber: '1234567890', // Add phone number if needed
      role: 'user' // Default role
    };

    console.log('User data:', user);

    this.authService.register(user).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['/room-select']);
        this.closeRegister();
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }

  closeRegister(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.closeModalEvent.emit();
  }
}