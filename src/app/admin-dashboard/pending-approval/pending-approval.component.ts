import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ConfirmationService } from "primeng/api";
import { Table } from "primeng/table";
import { Subscription } from "rxjs";

import { PENDING_APPROVAL_CONSTANTS } from "src/app/shared/constants/pending-approval-constants";
import { ApprovalPatch } from "src/app/shared/models/approval";
import { Visit, VisitGetResponse } from "src/app/shared/models/visit-model";
import { ApprovalService } from "src/app/shared/services/approval.service";
import { CardService } from "src/app/shared/services/card.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { VisitService } from "src/app/shared/services/visit.service";

@Component({
  selector: "app-pending-approval",
  templateUrl: "./pending-approval.component.html",
  styleUrls: ["./pending-approval.component.scss"],
  providers: [ConfirmationService]
})
export class PendingApprovalComponent implements OnInit, OnDestroy {
  constants = PENDING_APPROVAL_CONSTANTS;
  subscription$ = new Subscription();
  @ViewChild("pendingApprovalTable") pendingApprovalTable: Table | undefined;
  pendingVisitors!: Visit[];
  loading = true;
  encryptedVisitorId!: string;
  fieldsToFilter = ["firstName", "lastName", "organization"];

  constructor(
    private visitService: VisitService,
    private approvalService: ApprovalService,
    private cardService: CardService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.getPendingApprovalData();
  }

  getPendingApprovalData(): void {
    this.loading = true;
    this.pendingVisitors = [];
    this.subscription$.add(
      this.visitService
        .getData()
        .subscribe((visitResponse: VisitGetResponse) => {
          this.pendingVisitors = visitResponse.data.filter(
            (visit: Visit) =>
              visit?.approvalStatus === this.constants.PENDING &&
              !visit?.checkOutTime
          );

          this.loading = false;
          this.loaderService.hideLoader();
        })
    );
  }

  changeStatus(visitId: string, status: string, cardId: string): void {
    this.loaderService.showLoader();
    this.subscription$.add(
      this.approvalService.patchApproval(visitId, status).subscribe({
        next: (approvalResponse: ApprovalPatch) => {
          let cardStatus = this.constants.AVAILABLE;
          let pendingVisitId = "";
          if (status === this.constants.APPROVED) {
            cardStatus = this.constants.OCCUPIED;
            pendingVisitId = visitId;
          }
          this.updateCardStatus(cardId, cardStatus, pendingVisitId, approvalResponse);
        },
        error: () => {
          this.toast.showError(this.constants.ISSUE_IN_UPDAING_APPROVAL_STATUS);
        }
      })
    );
  }

  private updateCardStatus(
    cardId: string,
    cardStatus: string,
    pendingVisitId: string,
    approvalResponse: ApprovalPatch
  ) {
    this.cardService
      .updateCardStatus(cardId, cardStatus, pendingVisitId)
      .subscribe({
        next: () => {
          this.getPendingApprovalData();
          if (approvalResponse.data.status === this.constants.REJECTED) {
            this.toast.showSuccess(
              this.constants.REQUEST_REJECTED_SUCCESSFULLY
            );
          } else {
            this.toast.showSuccess(
              this.constants.REQUEST_APPROVED_SUCCESSFULLY
            );
          }
        },
        error: () => {
          this.toast.showError(this.constants.ISSUE_IN_UPDAING_CARD_STATUS);
        }
      });
  }

  applyFilterGlobal(event: Event, stringVal: string): void {
    this.pendingApprovalTable?.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
  }

  viewVisitor(visit: Visit): void {
    this.encryptedVisitorId = this.getEncryptedId(visit.visitId);
    this.router.navigate(["visitors", this.encryptedVisitorId], {
      relativeTo: this.route
    });
  }

  getEncryptedId(id: string): string {
    id = id.slice(0, -2);
    const rawVisitorId = atob(id).split("#")[0];
    const encodedVisitorId = btoa(rawVisitorId);
    return encodedVisitorId;
  }

  confirm(visitId: string, status: string, cardId: string): void {
    this.confirmationService.confirm({
      message: this.constants.PROCEED_FURTHER_CONFIRM,
      header: this.constants.CONFIRMATION,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.changeStatus(visitId, status, cardId);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
