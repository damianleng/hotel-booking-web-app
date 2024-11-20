// client/src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token) {
      const allowedRoles = route.data['roles'];
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}