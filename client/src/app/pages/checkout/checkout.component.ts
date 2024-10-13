import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PaymentComponent } from "src/app/components/payment/payment.component";
import { BookingService } from "src/app/services/booking.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;

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
  paymentMethod: string = "";
  cardName: string = "";
  cardNumber: string = "";
  expiryDate: string = "";
  cvv: string = "";

  accomodationTax: number = 0;
  vat: number = 0;
  serviceCharge: number = 0;

  detailsVisible = false; // For toggling the stay details
  feesVisible = false; // For toggling the taxes and fees

  // Add these properties to bind to the form inputs
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phone: string = "";
  address: string = "";

  stripe: any;
  elements: any;
  cardElement: any;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.RoomID = params["RoomID"];
      this.roomType = params["roomType"] || "";
      this.guests = +params["guests"] || 0; // Convert string to number
      this.amenities =
        params["amenities"] instanceof Array
          ? params["amenities"]
          : [params["amenities"]]; // Ensure amenities are an array
      this.image = decodeURIComponent(params["image"]) || ""; // Decode image URL
      this.CheckInDate = params["CheckInDate"] || "";
      this.CheckOutDate = params["CheckOutDate"] || "";
      this.stayDuration = +params["duration"] || 0;
      this.price = +params["totalPrice"] || 0;
    });
    this.calculate();
  }

  // Calculate tax, VAT, service fee, and total
  calculate(): void {
    this.accomodationTax = (this.price * 1.6) / 100;
    this.vat = (this.price * 8.2) / 100;
    this.serviceCharge = (this.price * 8.2) / 100;
    this.totalPrice =
      this.price + this.accomodationTax + this.vat + this.serviceCharge;
  }

  get isLoading(): boolean {
    return this.paymentComponent?.isPaymentLoading;
  }

  // combine payment and booking
  handleCheckout(): void {
    this.paymentComponent.handlePayment();
  }

  onPaymentSuccess(): void {
    console.log('Payment was successful, proceeding with booking...');
    this.createBooking()
  }

  createBooking() {
    const bookingData = {
      RoomID: this.RoomID,
      RoomType: this.roomType,
      Guests: this.guests,
      FirstName: this.firstName,
      LastName: this.lastName,
      CheckInDate: this.CheckInDate,
      CheckOutDate: this.CheckOutDate,
      Email: this.email,
      Phone: this.phone,
      Address: this.address,
    };

    // Send POST request to backend
    this.bookingService.createBooking(bookingData).subscribe(
      (response) => {
        console.log("booking success:", response);
      },
      (error) => {
        console.error("Booking failed: ", error);
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
