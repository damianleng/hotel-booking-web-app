import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PaymentComponent } from "src/app/components/payment/payment.component";
import { BookingService } from "src/app/services/booking.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;

  checkoutForm!: FormGroup;

  RoomID: string = "";
  roomType: string = "";
  guests: number = 0;
  amenities: string[] = [];
  image: string = "";
  CheckInDate: string = "";
  CheckOutDate: string = "";
  stayDuration: number = 0;
  price: number = 0;
  totalPrice: number = 0;

  // Payment method properties
  paymentMethod: string = "creditCard"; // Default to creditCard
  cardName: string = "";
  cardNumber: string = "";
  expiryDate: string = "";
  cvv: string = "";

  accomodationTax: number = 0;
  vat: number = 0;
  serviceCharge: number = 0;

  detailsVisible = false; // For toggling the stay details
  feesVisible = false; // For toggling the taxes and fees

  stripe: any;
  elements: any;
  cardElement: any;

  isLoading = false; // Default to not loading

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    // Initialize the reactive form without paymentMethod
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required], // No validation pattern for phone
      address: ['', Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      this.RoomID = params["RoomID"];
      this.roomType = params["roomType"] || "";
      this.guests = +params["guests"] || 0;
      this.amenities = params["amenities"] instanceof Array ? params["amenities"] : [params["amenities"]];
      this.image = decodeURIComponent(params["image"]) || "";
      this.CheckInDate = params["CheckInDate"] || "";
      this.CheckOutDate = params["CheckOutDate"] || "";
      this.stayDuration = +params["duration"] || 0;
      this.price = +params["totalPrice"] || 0;
    });

    this.calculate();

    // Log form status for debugging
    this.checkoutForm.statusChanges.subscribe(status => {
      console.log('Form Status:', status);
    });

    this.checkoutForm.valueChanges.subscribe(value => {
      console.log('Form Values:', value);
    });
  }

  // Calculate tax, VAT, service fee, and total
  calculate(): void {
    this.accomodationTax = (this.price * 1.6) / 100;
    this.vat = (this.price * 8.2) / 100;
    this.serviceCharge = (this.price * 8.2) / 100;
    this.totalPrice = this.price + this.accomodationTax + this.vat + this.serviceCharge;
  }

  get isFormValid(): boolean {
    return this.checkoutForm.valid && this.paymentMethod === 'creditCard';
  }

  handleCheckout(): void {
    if (this.checkoutForm.valid) {
      this.isLoading = true; // Simulate loading
      console.log("Form is valid, proceeding with payment...");
      this.paymentComponent.handlePayment();
    } else {
      console.log("Form is invalid, please check your inputs.");
    }
  }

  onPaymentSuccess(): void {
    this.createBooking();
    this.isLoading = false; // Stop loading after successful payment
  }

  createBooking() {
    const bookingData = {
      RoomID: this.RoomID,
      RoomType: this.roomType,
      Guests: this.guests,
      FirstName: this.checkoutForm.value.firstName, // Use form values
      LastName: this.checkoutForm.value.lastName,
      CheckInDate: this.CheckInDate,
      CheckOutDate: this.CheckOutDate,
      Email: this.checkoutForm.value.email,
      Phone: this.checkoutForm.value.phone,
      Address: this.checkoutForm.value.address,
    };

    // Send POST request to backend
    this.bookingService.createBooking(bookingData).subscribe(
      (response) => {
        console.log("Booking success:", response);
      },
      (error) => {
        console.error("Booking failed:", error);
      }
    );
  }

  // Toggles for showing stay details and fees
  toggleDetails() {
    this.detailsVisible = !this.detailsVisible; // Toggle stay details visibility
  }

  toggleFees() {
    this.feesVisible = !this.feesVisible; // Toggle fees and taxes visibility
  }
}
