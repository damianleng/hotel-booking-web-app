import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();

  closeCheckIn(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.closeModalEvent.emit();
  }

  constructor() { }

  ngOnInit(): void {
  }
}
