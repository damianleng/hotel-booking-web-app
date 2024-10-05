import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  selectedRoom: any = {
    name: 'Superior Double Room',
    image: '/assets/images/twin-bed.jpg',
    price: 200,
    amenities: ['Wi-Fi', 'TV', 'Mini Bar'],
  };
  
  totalPrice = 200;
  stayDuration = 3;
  guests = 2;

  // Payment method properties
  paymentMethod: string = '';
  cardName: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  accommodationTax = 0.74;
  vat = 3.69;
  serviceCharge = 3.69;

  detailsVisible = false;  // For toggling the stay details
  feesVisible = false;     // For toggling the taxes and fees

  // Add these properties to bind to the form inputs
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  confirmEmail: string = '';
  phone: string = '';
  address: string = '';
  specialRequest: string = '';

  constructor() { }

  ngOnInit(): void { }

  // This method will handle form submission
  onSubmit(formData: any) {
    console.log('Form submitted:', formData);
  }

  // Toggles for showing stay details and fees
  toggleDetails() {
    this.detailsVisible = !this.detailsVisible; // Toggle stay details visibility
  }

  toggleFees() {
    this.feesVisible = !this.feesVisible; // Toggle fees and taxes visibility
  }
}
