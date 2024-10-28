import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.complexPasswordValidator()]],
      rePassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  complexPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isValidLength;

      return !passwordValid ? { complexPassword: true } : null;
    };
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
        if (error.status === 400 && error.error.message === 'Email already in use') {
          this.errorMessage = 'Email already in use'; // Set the error message
        } else {
          this.errorMessage = 'Registration failed. Please try again.'; // Set a generic error message
        }
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