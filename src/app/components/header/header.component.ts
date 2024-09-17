import { Component, OnInit } from '@angular/core';

declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  isLoginVisible = false;
  isRegisterVisible = false;
  
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

  constructor() { }

  ngOnInit(): void {
    $(document).ready(function () {
      ($('.sidenav') as any).sidenav();
    });
  }
}
