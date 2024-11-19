// client/src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const expectedRole = route.data['expectedRole'];

    if (token && (!expectedRole || user.role === expectedRole)) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}