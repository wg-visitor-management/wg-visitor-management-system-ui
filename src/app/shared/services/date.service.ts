import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class DateService {
  getIsoDate(startDate?: Date, endDate?: Date) {
    let startISODate: string;
    let endISODate: string;

    if (startDate) {
      startISODate =
        new Date(startDate).toISOString().split("T")[0] + "T00:00:00";
    } else {
      startISODate = new Date().toISOString().split("T")[0] + "T00:00:00";
    }

    if (endDate) {
      endISODate = new Date(endDate).toISOString().split("T")[0] + "T23:59:59";
    } else {
      endISODate = new Date().toISOString().split("T")[0] + "T23:59:59";
    }

    return { startISODate, endISODate };
  }
}
