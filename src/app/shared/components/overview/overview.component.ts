import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import { VisitService } from "../../services/visit.service";
import { Visit, VisitGetResponse } from "../../models/visit-model";
import { OVERVIEW_CONSTANTS } from "../../constants/overview-constants";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"]
})
export class OverviewComponent implements OnInit, OnDestroy {
  contants = OVERVIEW_CONSTANTS;
  todayDate: Date = new Date();
  todayDay: string = this.todayDate.toLocaleString("en-us", {
    weekday: "long"
  });
  totalVisits = 0;
  pendingVisits = 0;
  rejectedVisits = 0;
  currentVisitors = 0;
  visits!: Visit[];
  isLoading = true;

  subscription$: Subscription = new Subscription();

  constructor(private visitService: VisitService) {}

  ngOnInit(): void {
    this.getVisitsData();
  }

  getVisitsData() {
    this.subscription$.add(
      this.visitService.getData().subscribe({
        next: (visitResponse: VisitGetResponse) => {
          this.visits = visitResponse.data;
          this.totalVisits = this.visits.length;
          this.pendingVisits = this.visits.filter(
            (visit: Visit) => visit.approvalStatus === this.contants.PENDING
          ).length;
          this.rejectedVisits = this.visits.filter(
            (visit: Visit) => visit.approvalStatus === this.contants.REJECTED
          ).length;
          this.currentVisitors = this.visits.filter(
            (visit: Visit) => !visit.checkOutTime
          ).length;
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
