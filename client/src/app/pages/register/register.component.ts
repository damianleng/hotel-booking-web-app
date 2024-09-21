import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() closeModalEvent = new EventEmitter<void>();

  closeRegister(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.closeModalEvent.emit();
  }

  constructor() { }

  ngOnInit(): void {
  }
}