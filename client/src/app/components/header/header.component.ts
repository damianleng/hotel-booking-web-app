import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  isLoginVisible = false;
  isRegisterVisible = false;
  isAuthenticated = false;
  
  openLogin() {
    this.isLoginVisible = true;
  }

  openRegister() {
    this.isRegisterVisible = true;
  }

  closeModal() {
    this.isLoginVisible = false;
    this.isRegisterVisible = false;
  }

  checkAuthentication() {
    this.isAuthenticated = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.checkAuthentication();
    this.router.navigate(['/home']); // Redirect to home after logout
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkAuthentication();
    $(document).ready(function () {
      ($('.sidenav') as any).sidenav();
    });
  }
}
