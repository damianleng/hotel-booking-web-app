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
import { AdminDashComponent } from './pages/admin-dash/admin-dash.component';
import { HousekeepingDashComponent } from './pages/housekeeping-dash/housekeeping-dash.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'room-select', component: RoomSelectComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: "my-stay/:bookingId", component: MyStayComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: "bookings-list", component: BookingsListComponent, canActivate: [AuthGuard], data: { role: 'user' } },
  {path: "confirmation", component: ConfirmationComponent, canActivate: [AuthGuard], data: { role: 'user' }},
  { path: "admin", component: AdminDashComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  {path: "housekeeping-dash", component: HousekeepingDashComponent, canActivate: [AuthGuard], data: { role: 'cleaner' }},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
