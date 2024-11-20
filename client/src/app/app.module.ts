import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { FooterComponent } from "./components/footer/footer.component";
import { RoomSelectComponent } from "./pages/room-select/room-select.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { PaymentComponent } from "./components/payment/payment.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { MyStayComponent } from "./pages/my-stay/my-stay.component";
import { CheckInComponent } from "./pages/check-in/check-in.component";
import { CheckOutComponent } from "./pages/check-out/check-out.component";
import { BookingsListComponent } from "./pages/bookings-list/bookings-list.component";
import { TimeFormatPipe } from "./pipe/time-format.pipe";
import { AuthInterceptor } from "./services/interceptors/auth.interceptor";
import { AdminDashComponent } from "./pages/admin-dash/admin-dash.component";
import { HousekeepingDashComponent } from './pages/housekeeping-dash/housekeeping-dash.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    RoomSelectComponent,
    CheckoutComponent,
    PaymentComponent,
    ConfirmationComponent,
    MyStayComponent,
    CheckInComponent,
    CheckOutComponent,
    BookingsListComponent,
    TimeFormatPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
