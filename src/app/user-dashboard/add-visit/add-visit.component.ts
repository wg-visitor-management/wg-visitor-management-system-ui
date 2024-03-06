/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { NgForm } from "@angular/forms";

import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  filter,
  finalize,
  map,
  switchMap,
  tap
} from "rxjs";

import { ADD_VISIT_CONSTANTS } from "src/app/shared/constants/add-visit-constants";
import { Card } from "src/app/shared/models/card-model";
import { VisitBody, VisitRequestBody } from "src/app/shared/models/visit-model";
import {
  Visitor,
  VisitorGetIdResponse,
  VisitorGetResponse
} from "src/app/shared/models/visitor";
import { ApprovalService } from "src/app/shared/services/approval.service";
import { CardService } from "src/app/shared/services/card.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { VisitService } from "src/app/shared/services/visit.service";
import { VisitorService } from "src/app/shared/services/visitor.service";
import {
  ApprovalPost,
  ApprovalPostResponse
} from "src/app/shared/models/approval";
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
  selector: "app-add-visit",
  templateUrl: "./add-visit.component.html",
  styleUrls: ["./add-visit.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AddVisitComponent implements OnDestroy {
  addVisitConstants = ADD_VISIT_CONSTANTS;
  visitor: Visitor | undefined;
  cards!: Observable<Card[]>;
  disableForm = true;
  subscription$ = new Subscription();
  liveSearchLoader = true;
  suggestions!: Visitor[];
  visible = false;
  searchTrigger = new Subject<string>();
  selectedVisitor!: Visitor | undefined;
  searchPlaceHolderValue: Visitor | undefined = undefined;
  @ViewChild("visitForm") visitForm?: NgForm;

  constructor(
    private visitService: VisitService,
    private visitorService: VisitorService,
    private cardService: CardService,
    private toastService: ToastService,
    private approvalService: ApprovalService,
    private loaderService: LoaderService
  ) {}

  addVisitor(): void {
    this.visible = true;
  }

  closePopUp(isPopupOpen: boolean): void {
    this.visible = isPopupOpen;
  }

  onItemSelect(): void {
    this.reset(this.visitForm);
    this.selectedVisitor = this.searchPlaceHolderValue;
    if (this.selectedVisitor?.visitorId) {
      this.cards = this.cardService.getAvailableCards();
      this.loaderService.showLoader();
      this.getVisitorDetails();
    }
    this.searchPlaceHolderValue = undefined;
  }

  getVisitorDetails(): void {
    this.subscription$.add(
      this.visitorService
        .getVisitor(this.selectedVisitor!.visitorId)
        .subscribe((visitor: VisitorGetIdResponse) => {
          this.visitor = visitor.data;
          if (visitor) {
            this.loaderService.hideLoader();
            this.disableForm = false;
          }
        })
    );
  }

  search(event: any): void {
    this.suggestions = [];
    this.liveSearchLoader = true;
    const searchString = event.query.replaceAll(" ", "");
    this.subscription$.add(
      this.visitorService
        .getData(searchString)
        .pipe(
          tap(() => {
            this.liveSearchLoader = true;
          }),
          debounceTime(200)
        )
        .subscribe((data: VisitorGetResponse) => {
          this.liveSearchLoader = false;
          this.suggestions = [...data.data.visitors];
        })
    );
  }
  parseVisitBody(): VisitRequestBody {
    const visitFormValue = this.visitForm?.value;
    return {
      visitorId: this.selectedVisitor!.visitorId,
      name: `${this.selectedVisitor!.firstName} ${
        this.selectedVisitor!.lastName
      }`,
      organization: this.selectedVisitor!.organization,
      phNumber: this.selectedVisitor!.phoneNumber,
      purpose: visitFormValue.purpose,
      visitType: visitFormValue.visitType,
      toMeet: visitFormValue.toMeet,
      cardId: visitFormValue.idCard,
      comments: visitFormValue.comments ?? ""
    };
  }

  addVisit(): void {
    if (this.visitForm!.invalid) {
      for (const controlName in this.visitForm!.controls) {
        this.visitForm!.controls[controlName].markAsTouched();
      }
      return;
    }
    this.loaderService.showLoader();
    const visitData: VisitRequestBody = this.parseVisitBody();
    this.subscription$.add(
      this.visitService
        .addVisit(visitData)
        .pipe(
          finalize(() => {
            this.reset(this.visitForm);
          }),
          switchMap((data: VisitBody) => {
            const visitId = data.data.visitId;
            const cardId = visitData.cardId;
            return this.cardService
              .updateCardStatus(cardId, "occupied", visitId)
              .pipe(map(() => visitId));
          }),
          tap((visitId: string) => {
            return this.checkForApproval(visitId, visitData.visitType);
          }),
          filter(() => visitData.visitType === "inside_office"),
          switchMap((visitId: string) => {
            return this.sendApprovalRequest(visitId, visitData);
          })
        )
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              this.addVisitConstants.VISIT_SUCCESS_APPROVAL
            );
            this.visitService.visitChanged$.next(true);
            this.loaderService.hideLoader();
          },
          error: () => {
            this.toastService.showError(this.addVisitConstants.VISIT_ERROR);
          }
        })
    );
  }

  checkForApproval(visitId: string, visitType: string): string {
    this.reset(this.visitForm);
    if (visitType !== "inside_office") {
      this.toastService.showSuccess(
        this.addVisitConstants.VISIT_SUCCESS_MESSAGE
      );
      this.visitService.visitChanged$.next(true);
      this.loaderService.hideLoader();
    }
    return visitId;
  }
  sendApprovalRequest(
    visitId: string,
    visitData: VisitRequestBody
  ): Observable<ApprovalPostResponse> {
    const approvalRequestData: ApprovalPost = {
      name: visitData.name,
      organization: visitData.organization,
      phNumber: visitData.phNumber,
      purpose: visitData.purpose,
      visitId: visitId
    };
    return this.approvalService.postApproval(approvalRequestData);
  }

  reset(visitForm?: NgForm): void {
    visitForm?.resetForm({
      visitType: "",
      idCard: ""
    });
    this.disableForm = true;
    this.visitor = undefined;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
