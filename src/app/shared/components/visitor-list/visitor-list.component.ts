import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Table } from "primeng/table";
import { Subscription } from "rxjs";

import { VISITOR_CONSTANTS } from "../../constants/visitor-constants";
import { VisitorService } from "../../services/visitor.service";
import { Visitor, VisitorGetResponse } from "../../models/visitor";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: "app-visitor-list",
  templateUrl: "visitor-list.component.html",
  styleUrls: ["visitor-list.component.scss"]
})
export class VisitorListComponent implements OnInit, OnDestroy {
  @ViewChild("visitorListTable") visitorListTable: Table | undefined;
  visitorConstants = VISITOR_CONSTANTS;
  subscription$: Subscription = new Subscription();
  loadingMoreVisitors = false;
  visitors: Visitor[] = [];
  selectedVisitor!: string;
  encryptedVisitorId!: string;
  searchValue = "";
  nextPageToken = "";
  organization = "";
  loading = false;

  constructor(
    private visitorService: VisitorService,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader.showLoader();
    this.getVisitorList();
  }

  getVisitorList(
    nextPageToken = "",
    maxItems = this.visitorConstants.SEARCH_MAX_ITEMS,
    queryString = "",
    organization = ""
  ): void {
    this.loading = true;

    this.subscription$.add(
      this.visitorService
        .getData(queryString, nextPageToken, maxItems, organization)
        .subscribe({
          next: (visitor: VisitorGetResponse) => {
            this.visitors = this.visitors.concat(visitor.data.visitors);
            this.nextPageToken =
              visitor.data.nextPageToken != "null"
                ? visitor.data.nextPageToken
                : "";
            this.loadingMoreVisitors = false;
            this.loading = false;
            this.loader.hideLoader();
          }
        })
    );
  }
  viewVisitor(visitor: Visitor): void {
    this.selectedVisitor = visitor.visitorId;
    this.router.navigate([this.selectedVisitor], {
      relativeTo: this.route
    });
  }

  loadMoreVisitors(): void {
    this.loadingMoreVisitors = true;

    if (!this.nextPageToken) {
      this.loader.hideLoader();
      return;
    }
    this.getVisitorList(
      this.nextPageToken,
      this.visitorConstants.SEARCH_MAX_ITEMS,
      this.searchValue,
      this.organization
    );
  }

  onSearch(): void {
    this.loader.showLoader();
    this.nextPageToken = "";
    this.visitors = [];
    this.getVisitorList(
      this.nextPageToken,
      this.visitorConstants.SEARCH_MAX_ITEMS,
      this.searchValue,
      this.organization
    );
  }
  applyFilterGlobal(event: Event, stringVal: string): void {
    this.visitorListTable?.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
