import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();

  closeLogin(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.closeModalEvent.emit();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
