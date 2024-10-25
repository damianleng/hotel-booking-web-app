import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { RoomSelectComponent } from './pages/room-select/room-select.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MyStayComponent } from './pages/my-stay/my-stay.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { BookingsListComponent } from './pages/bookings-list/bookings-list.component';


const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "room-select", component: RoomSelectComponent},
  {path: "checkout", component: CheckoutComponent},
  { path: "my-stay/:bookingId", component: MyStayComponent },  
  { path: "bookings-list", component: BookingsListComponent },
  {path: "confirmation", component: ConfirmationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
