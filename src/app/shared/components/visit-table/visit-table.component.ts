import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ConfirmationService, MenuItem } from "primeng/api";
import { Calendar } from "primeng/calendar";
import { Table } from "primeng/table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Subscription } from "rxjs";

import { VISITS_CONSTANTS } from "../../constants/visit-constants";
import { Visit, VisitGetResponse } from "../../models/visit-model";
import { Column, ExportColumn } from "../../models/pdf_generation_model";
import { VisitService } from "../../services/visit.service";
import { ToastService } from "../../services/toast.service";
import { CardService } from "../../services/card.service";
import { LoaderService } from "../../services/loader.service";
import { DateService } from "../../services/date.service";

@Component({
  selector: "app-visit-table",
  templateUrl: "./visit-table.component.html",
  styleUrls: ["./visit-table.component.scss"],
  providers: [ConfirmationService]
})
export class VisitTableComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  constants = VISITS_CONSTANTS;
  @ViewChild("visitTable") visitTable: Table | undefined;
  @ViewChild("calendar") calendar!: Calendar;
  rangeDates: Date[] | undefined;
  visits!: Visit[];
  loading = true;
  maxDate: Date = new Date();
  cols!: Column[];
  exportColumns!: ExportColumn[];
  encryptedVisitorId!: string;
  exportItems!: MenuItem[];
  fieldsToFilter = [
    "name",
    "organization",
    "approvalStatus",
    "date",
    "checkInTime",
    "checkOutTime",
    "cardId"
  ];

  constructor(
    private visitService: VisitService,
    private cardService: CardService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private loader: LoaderService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.loader.showLoader();
    this.getTodayVisits();
    this.configureExportItems();
    this.createColumns();
    this.configureExportColumns();
  }

  getTodayVisits(): void {
    this.visits = [];
    this.loading = true;
    this.subscription$.add(
      this.visitService.getData().subscribe((visit: VisitGetResponse) => {
        this.visits = visit.data;
        this.loading = false;
        this.loader.hideLoader();
      })
    );
  }

  applyFilterGlobal(event: Event, stringVal: string): void {
    this.visitTable?.filterGlobal(
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

      this.visits = [];
      this.loading = true;
      this.closeCalendar();

      this.subscription$.add(
        this.visitService
          .getData(startISODate, endISODate)
          .subscribe((visit: VisitGetResponse) => {
            this.visits = visit.data;
            this.loading = false;
          })
      );
    }
  }

  clearCalendar(): void {
    this.rangeDates = undefined;
    this.visitTable?.reset();
    this.getTodayVisits();
    this.closeCalendar();
  }

  closeCalendar(): void {
    this.calendar.overlayVisible = false;
  }

  viewVisitor(visit: Visit): void {
    this.encryptedVisitorId = this.getEncryptedId(visit.visitId);
    this.router.navigate(["visitors", this.encryptedVisitorId], {
      relativeTo: this.route
    });
  }

  checkout(visitId: string, cardId: string): void {
    this.visits = [];
    this.loading = true;
    this.loader.showLoader();
    this.subscription$.add(
      this.visitService.checkOutVisitor(visitId).subscribe(() => {
        this.visitService.getData().subscribe((visit: VisitGetResponse) => {
          this.cardService.updateCardStatus(cardId, "available", "").subscribe({
            next: () => {
              this.toast.showSuccess(this.constants.VISITOR_CHECKED_OUT);
              this.visits = visit.data;
              this.loading = false;
              this.loader.hideLoader();
              this.onDateSelect();
            },
            error: () => {
              this.toast.showError(this.constants.ERROR_CHECKING_OUT_VISITOR);
              this.onDateSelect();
            }
          });
        });
      })
    );
  }

  exportPdf(): void {
    const doc = new jsPDF("l", "pt", "a3");
    (doc as any).autoTable(this.exportColumns, this.visits);
    doc.save("VisitDetails.pdf");
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

  getEncryptedId(id: string): string {
    id = id.slice(0, -2);
    const rawVisitorId = atob(id).split("#")[0];
    const encodedVisitorId = btoa(rawVisitorId);
    return encodedVisitorId;
  }

  confirm(visitId: string, cardId: string): void {
    this.confirmationService.confirm({
      message: this.constants.CONFIRM_MESSAGE,
      header: this.constants.CONFIRMATION,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.checkout(visitId, cardId);
      }
    });
  }

  configureExportItems(): void {
    this.exportItems = [
      {
        label: "PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          this.exportPdf();
        }
      },
      {
        label: "CSV",
        icon: "pi pi-file-excel",
        command: () => {
          if (this.visitTable) {
            this.visitTable.exportCSV();
          }
        }
      }
    ];

    this.visitService.visitChanged$.subscribe({
      next: () => {
        this.getTodayVisits();
      }
    });
  }

  createColumns(): void {
    this.cols = [
      {
        field: "name",
        header: "Name",
        customExportHeader: "Product Code"
      },
      { field: "organization", header: "Organization" },
      { field: "phNumber", header: "Phone No" },
      { field: "date", header: "Date" },
      { field: "checkInTime", header: "In Time" },
      { field: "checkOutTime", header: "Out Time" },
      { field: "purpose", header: "Purpose" },
      { field: "toMeet", header: "To Meet" },
      { field: "comments", header: "Comments" },
      { field: "cardId", header: "ID Card" },
      { field: "checkedInBy", header: "Checked In By" },
      { field: "approvalStatus", header: "Status" },
      { field: "approvedBy", header: "Approved By" }
    ];
  }

  configureExportColumns(): void {
    this.exportColumns = this.cols.map((col: Column) => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
