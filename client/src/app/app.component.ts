import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
  <app-header></app-header>
  <router-outlet></router-outlet>
  <app-footer></app-footer>
  `,
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title, private authService: AuthService) {}
  ngOnInit(): void {
    this.titleService.setTitle('Aurora');
    this.authService.checkTokenExpiry();
  }
}
