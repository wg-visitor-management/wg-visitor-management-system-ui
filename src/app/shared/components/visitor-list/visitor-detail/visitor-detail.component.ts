import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";

import { Table } from "primeng/table";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import jsPDF from "jspdf";

import { VISITOR_CONSTANTS } from "src/app/shared/constants/visitor-constants";
import {
  Column,
  ExportColumn
} from "src/app/shared/models/pdf_generation_model";
import { Visit, VisitGetResponse } from "src/app/shared/models/visit-model";
import { Visitor, VisitorGetIdResponse } from "src/app/shared/models/visitor";
import { VisitService } from "src/app/shared/services/visit.service";
import { VisitorService } from "src/app/shared/services/visitor.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
  selector: "app-visitor-detail",
  templateUrl: "./visitor-detail.component.html",
  styleUrls: ["./visitor-detail.component.scss"]
})
export class VisitorDetailComponent implements OnInit, OnDestroy {
  visitorConstants = VISITOR_CONSTANTS;
  subscription$ = new Subscription();
  @ViewChild("visitorDetailTable") visitorDetailTable: Table | undefined;
  encryptedVisitorId!: string;
  rangeDates: Date[] | undefined;
  exportItems!: MenuItem[];
  visits!: Visit[];
  selectedVisit!: Visit[];
  loading = true;
  ProfileImageSource!: string;
  profileImageLoaded = false;
  cardImageSource!: string;
  cardImageLoaded = false;
  cols!: Column[];
  exportColumns!: ExportColumn[];
  visible = false;
  visitor: Visitor = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    profilePictureUrl: "",
    idProofPictureUrl: "",
    organization: "",
    address: "",
    visitorId: "",
    idProofNumber: ""
  };
  isTableLoading = false;
  fieldsToFilter = [
    "purpose",
    "toMeet",
    "status",
    "date",
    "checkInTime",
    "checkOutTime"
  ];

  constructor(
    private visitService: VisitService,
    private visitorService: VisitorService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private location: Location,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader.showLoader();
    this.subscription$.add(
      this.route.params.subscribe((params: Params) => {
        this.encryptedVisitorId = params["id"];
        this.loadInitialData();
      })
    );
    this.subscription$.add(
      this.visitorService.visitorDetailUpdate.subscribe(() => {
        this.loadInitialData();
      })
    );

    this.configureExportItems();
    this.createColumns();
    this.configureExportColumns();
  }

  loadInitialData(): void {
    this.subscription$.add(
      this.visitorService
        .getVisitor(this.encryptedVisitorId)
        .subscribe((visitor: VisitorGetIdResponse) => {
          this.visitor = visitor.data;
          this.ProfileImageSource = this.visitor.profilePictureUrl || "";
          this.cardImageSource = this.visitor.idProofPictureUrl || "";

          const profileImage = new Image();
          profileImage.onload = () => {
            this.profileImageLoaded = true;
          };
          profileImage.src = this.ProfileImageSource;

          const cardImage = new Image();
          cardImage.onload = () => {
            this.cardImageLoaded = true;
          };
          cardImage.src = this.ProfileImageSource;

          this.loading = false;
          this.loader.hideLoader();
        })
    );
    this.subscription$.add(
      this.visitService
        .getDataByVisitorId(this.encryptedVisitorId)
        .subscribe((visit: VisitGetResponse) => {
          this.visits = visit.data;
          this.loading = false;
        })
    );
  }
  applyFilterGlobal(event: Event, stringVal: string): void {
    this.visitorDetailTable?.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
  }

  backToDashboard(): void {
    this.location.back();
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
  refreshVisits(): void {
    this.visits = [];
    this.isTableLoading = true;
    this.subscription$.add(
      this.visitService
        .getDataByVisitorId(this.encryptedVisitorId)
        .subscribe((visit: VisitGetResponse) => {
          this.visits = visit.data;
          this.isTableLoading = false;
        })
    );
  }

  configureExportColumns(): void {
    this.exportColumns = this.cols.map((col: Column) => ({
      title: col.header,
      dataKey: col.field
    }));
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
          if (this.visitorDetailTable) {
            this.visitorDetailTable.exportCSV();
          } else {
            this.toast.showWarn(this.visitorConstants.NO_DATA_TO_EXPORT);
          }
        }
      }
    ];
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
      { field: "checkInTime", header: "In Time" },
      { field: "checkOutTime", header: "Out Time" },
      { field: "purpose", header: "Purpose" },
      { field: "toMeet", header: "To Meet" },
      { field: "comments", header: "Comments" },
      { field: "cardId", header: "ID Card" },
      { field: "checkedInBy", header: "Checked In By" },
      { field: "status", header: "Status" }
    ];
  }

  editVisitorDetails(): void {
    this.visible = true;
  }
  closePopUp(isPopupOpen: boolean): void {
    this.visible = isPopupOpen;
  }
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
