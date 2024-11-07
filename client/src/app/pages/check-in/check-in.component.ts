import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-check-in",
  templateUrl: "./check-in.component.html",
  styleUrls: ["./check-in.component.css"],
})
export class CheckInComponent implements OnInit {
  @Input() checkInTime: string = "";
  @Output() updateCheckInTimeEvent = new EventEmitter<string>();
  @Output() closeModalEvent = new EventEmitter<void>();

  updateCheckInTime() {
    this.updateCheckInTimeEvent.emit(this.checkInTime);
    this.closeCheckIn(); // call the method to close the modal
  }

  closeCheckIn(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.closeModalEvent.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}
