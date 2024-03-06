import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { Subscription } from "rxjs";
import { Table } from "primeng/table";
import { Calendar } from "primeng/calendar";

import { VISITS_CONSTANTS } from "src/app/shared/constants/visit-constants";
import { Visit, VisitGetResponse } from "src/app/shared/models/visit-model";
import { VisitService } from "src/app/shared/services/visit.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { DateService } from "src/app/shared/services/date.service";

@Component({
  selector: "app-approvals-detail",
  templateUrl: "./approvals-detail.component.html",
  styleUrls: ["./approvals-detail.component.scss"]
})
export class ApprovalsDetailComponent implements OnInit, OnDestroy {
  constants = VISITS_CONSTANTS;
  subscription$: Subscription = new Subscription();
  rangeDates: Date[] | undefined;
  loading = false;
  visits!: Visit[];
  maxDate: Date = new Date();
  fieldsToFilter = [
    "name",
    "phNumber",
    "organization",
    "approvalStatus",
    "date",
    "checkInTime",
    "checkOutTime",
    "approvalStatus",
    "toMeet"
  ];
  @ViewChild("approvalTable") approvalTable: Table | undefined;
  @ViewChild("calendar") calendar!: Calendar;

  constructor(
    private visitService: VisitService,
    private loader: LoaderService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.loader.showLoader();
    this.getInitialVisits();
  }

  getInitialVisits(): void {
    const startDate: Date = new Date();
    startDate.setDate(startDate.getDate() - 10);
    const date = this.dateService.getIsoDate(startDate);
    this.getApprovals(date.startISODate, date.endISODate);
  }

  getApprovals(startDate: string, endDate: string): void {
    this.visits = [];
    this.loading = true;
    this.subscription$.add(
      this.visitService
        .getData(startDate, endDate)
        .subscribe((visitResponse: VisitGetResponse) => {
          this.visits = visitResponse.data;
          this.visits = this.filterVisits(this.visits);
          this.loading = false;
          this.loader.hideLoader();
        })
    );
  }

  filterVisits(visits: Visit[]): Visit[] {
    const filteredVisits: Visit[] = visits.filter((visit: Visit) => {
      return visit.approvalStatus;
    });
    return filteredVisits;
  }

  clearCalendar(): void {
    this.rangeDates = undefined;
    this.closeCalendar();
    this.getInitialVisits();
  }

  applyFilterGlobal(event: Event, stringVal: string): void {
    this.approvalTable?.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
  }

  onDateSelect(): void {
    if (this.rangeDates && this.rangeDates[1]) {
      const startDate = new Date(this.rangeDates[0]);
      startDate.setHours(startDate.getHours() + 5);
      startDate.setMinutes(startDate.getMinutes() + 30);
      const endDate = new Date(this.rangeDates[1]);
      endDate.setHours(endDate.getHours() + 5);
      endDate.setMinutes(endDate.getMinutes() + 30);

      const ISODate = this.dateService.getIsoDate(startDate, endDate);
      const startISODate = ISODate.startISODate;
      const endISODate = ISODate.endISODate;

      this.closeCalendar();
      this.getApprovals(startISODate, endISODate);
    }
  }

  closeCalendar(): void {
    this.calendar.overlayVisible = false;
  }

  getSeverity(approvalStatus: string): string {
    switch (approvalStatus) {
      case "rejected":
        return "danger";
      case "approved":
        return "success";
      case "pending":
        return "warning";
      default:
        return "info";
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
