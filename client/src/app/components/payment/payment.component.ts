import { Component, Input, OnInit, Output } from "@angular/core";
import { PaymentService } from "src/app/services/payment.service";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { environment } from "src/environments/environment";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
})
export class PaymentComponent implements OnInit {
  @Input() totalPrice: number = 0;
  @Output() paymentSuccess: EventEmitter<void> = new EventEmitter(); 

  stripe: Stripe | null = null;
  cardElement: any;
  paymentIntentClientSecret: string | null = null;
  isPaymentLoading = false;
  errorMessage: string = "";

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    // Load Stripe and mount the card element
    this.stripe = await loadStripe(environment.stripePublicKey); // Add your Stripe publishable key
    const elements = this.stripe!.elements();

    this.cardElement = elements.create("card");
    this.cardElement.mount("#card-element");
  }

  async handlePayment() {
    this.isPaymentLoading = true;

    // Call the service to create a payment intent
    this.paymentService.createPaymentIntent(this.totalPrice).subscribe(
      async (response) => {
        this.paymentIntentClientSecret = response.clientSecret;

        const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
          this.paymentIntentClientSecret!,
          {
            payment_method: {
              card: this.cardElement,
            },
          }
        );

        if (error) {
          this.errorMessage = error.message!;
        } else if (paymentIntent?.status === "succeeded") {
          console.log("Payment successful!");
          alert("Payment successful!");
        }

        this.paymentSuccess.emit();
        this.isPaymentLoading = false;
      },
      (error) => {
        console.error("Payment intent creation failed:", error);
        this.isPaymentLoading = false;
      }
    );
  }
}
