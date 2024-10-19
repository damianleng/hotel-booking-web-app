import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rePassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, password, rePassword, firstName, lastName, phoneNumber } = this.registerForm.value;

    if (password !== rePassword) {
      alert('Passwords do not match');
      return;
    }

    const user = {
      email,
      password,
      name: `${firstName} ${lastName}`,
      phoneNumber,
      role: 'user' // Default role
    };

    this.authService.register(user).subscribe(
      response => {
        console.log('Registration successful', response);
        this.closeRegister(); // Close the registration form
        this.router.navigate(['/home']);
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