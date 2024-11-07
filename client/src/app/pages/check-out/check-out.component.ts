import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-check-out",
  templateUrl: "./check-out.component.html",
  styleUrls: ["./check-out.component.css"],
})
export class CheckOutComponent {
  @Input() checkOutTime: string = "";
  @Output() updateCheckOutTimeEvent = new EventEmitter<string>();
  @Output() closeModalEvent = new EventEmitter<void>();

  updateCheckOutTime() {
    this.updateCheckOutTimeEvent.emit(this.checkOutTime);
    this.closeCheckOut(); // call the method to close the modal
  }

  closeCheckOut(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Prevents the modal from closing when clicking inside the container
    }
    this.closeModalEvent.emit(); // Emits the event to notify parent to close the modal
  }
}
