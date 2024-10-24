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
  user: any = null;
  userName: string = '';
  
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
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
    if (this.isAuthenticated) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userName = this.user.name;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
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
