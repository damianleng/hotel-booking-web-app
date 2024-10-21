import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-confirmation",
  templateUrl: "confirmation.component.html",
  styleUrls: ["confirmation.component.css"],
})
export class ConfirmationComponent implements OnInit {
  constructor() {}
  @Input() checkIn: string = "";
  @Input() checkOut: string = "";
  ngOnInit(): void {}
}
