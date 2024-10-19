// client/src/app/pages/login/login.component.ts
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() loginSuccessEvent = new EventEmitter<void>();
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      response => {
        console.log('Login successful', response);
        console.log('Token:', response.token);	
        console.log('User Information:', response.user);
        localStorage.setItem('token', response.token); // Store the token
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user information
        localStorage.setItem('userId', response.user.id);
        this.loginSuccessEvent.emit(); // Emit login success event
        this.closeLogin(); // Close the login form
        this.router.navigate(['/room-select']); // Navigate to the dashboard or desired route
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }

  closeLogin(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.closeModalEvent.emit();
  }
}