import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timeFormat",
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return "";

    // Split the input time (HH:mm) into hours and minutes
    const [hours, minutes] = value.split(":").map(Number);

    // Determine AM or PM
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour format
    const convertedHours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Return the formatted time with AM/PM
    return `${convertedHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  }
}
