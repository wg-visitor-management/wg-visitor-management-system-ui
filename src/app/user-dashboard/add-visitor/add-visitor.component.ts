import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { NgForm } from "@angular/forms";

import { WebcamImage } from "ngx-webcam";
import { Subject, Observable, Subscription, of } from "rxjs";
import {  switchMap } from "rxjs/operators";

import { AuthService } from "src/app/auth/service/auth.service";
import { ADD_VISITOR_CONSTANTS } from "src/app/shared/constants/add-visitor-constants";
import { ApprovalPost } from "src/app/shared/models/approval";
import { Card, CardResponse } from "src/app/shared/models/card-model";
import { User } from "src/app/shared/models/user-model";
import { VisitBody } from "src/app/shared/models/visit-model";
import { VisitorPostResponse } from "src/app/shared/models/visitor";
import { ApprovalService } from "src/app/shared/services/approval.service";
import { CardService, card_status } from "src/app/shared/services/card.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { VisitService, visitPost } from "src/app/shared/services/visit.service";
import {
  VisitorService,
  visitorPost
} from "src/app/shared/services/visitor.service";

@Component({
  selector: "app-add-visitor",
  templateUrl: "./add-visitor.component.html",
  styleUrls: ["./add-visitor.component.scss"]
})
export class AddVisitorComponent implements OnDestroy, OnInit {
  addVisitorConstants = ADD_VISITOR_CONSTANTS;
  @Output() visible = new EventEmitter<boolean>();
  private trigger: Subject<boolean> = new Subject();
  public webcamPhotoImage!: WebcamImage | undefined;
  public webcamIDImage!: WebcamImage | undefined;
  public showPhotoCamera = false;
  public showUserPhotoPlaceholder = true;
  public showIDplaceholder = true;
  public showIDCamera = false;
  public currentDate!: string;
  public isDisabled!: boolean;
  public currentTime!: string;
  user!: User;
  selectedCardId!: string;
  subscription$ = new Subscription();
  cards?: Observable<Card[]>;
  isPhotoImageInvalid = false;
  isIDImageInvalid = false;
  disableBtn = false;
  @ViewChild("registerNewForm") visitorDetailsForm!: NgForm;

  constructor(
    private cardService: CardService,
    private visitorService: VisitorService,
    private authService: AuthService,
    private visitService: VisitService,
    private approvalService: ApprovalService,
    private toastService: ToastService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.subscription$.add(
      this.authService.currentUser$.subscribe((user: User | null) => {
        if (user) {
          this.user = user;
        }
      })
    );
    this.currentDate = new Date().toISOString().split("T")[0];
    this.cards = this.cardService.getAvailableCards();
  }

  onSubmit(visitorDetails: NgForm): void {
    if (!this.webcamPhotoImage) {
      this.isPhotoImageInvalid = true;
    }
    if (!this.webcamIDImage) {
      this.isIDImageInvalid = true;
    }
    if (visitorDetails.invalid) {
      for (const controlName in visitorDetails.controls) {
        visitorDetails.controls[controlName].markAsTouched();
      }
      return;
    }
    if (!this.webcamPhotoImage || !this.webcamIDImage) {
      return;
    }

    this.loader.showLoader();
    this.disableBtn = true;
    this.addVisitor(visitorDetails);
  }

  // addVisitor(visitorDetails: NgForm): void {
  //   const visitorData = this.createVisitorData(visitorDetails);
  //   this.subscription$.add(
  //     this.visitorService
  //       .addVisitor(visitorData)
  //       .pipe(
  //         switchMap((response: VisitorPostResponse) => {
  //           const visitData = this.createVisitData(
  //             response.data.visitorId,
  //             visitorDetails
  //           );

  //           return this.visitService.addVisit(visitData).pipe(
  //             switchMap((visitResponse: VisitBody) => {
  //               const visitId = visitResponse.data.visitId;
  //               const cardId = visitData.cardId;
  //               return this.cardService
  //                 .updateCardStatus(cardId, card_status.occupied, visitId)
  //                 .pipe(
  //                   switchMap(() => {
  //                     if (visitData.visitType === "inside_office") {
  //                       const approvalRequestData: ApprovalPost =
  //                         this.createApprovalData(visitId, visitData);
  //                       this.handleInsideOfficeVisit(approvalRequestData);
  //                       return of(null);
  //                     } else {
  //                       this.handleOutsideOfficeVisit();
  //                       return of(null);
  //                     }
  //                   })
  //                 );
  //             })
  //           );
  //         })
  //       )
  //       .subscribe()
  //   );
  // }

  addVisitor(visitorDetails: NgForm): void {
    const visitorData = this.createVisitorData(visitorDetails);
    this.subscription$.add(
      this.visitorService
        .addVisitor(visitorData)
        .pipe(
          switchMap((visitorResponse: VisitorPostResponse) =>
            this.createAndAddVisit(
              visitorResponse.data.visitorId,
              visitorDetails
            )
          )
        )
        .subscribe()
    );
  }

  private createAndAddVisit(
    visitorId: string,
    visitorDetails: NgForm
  ): Observable<CardResponse>{
    const visitData = this.createVisitData(visitorId, visitorDetails);
    return this.visitService
      .addVisit(visitData)
      .pipe(
        switchMap((visitResponse: VisitBody) =>
          this.updateCardAndHandleFlow(
            visitResponse.data.visitId,
            visitData
          )
        )
      );
  }

  private updateCardAndHandleFlow(
    visitId: string,
    visitData: visitPost
  ): Observable<CardResponse | null>{
    return this.cardService
      .updateCardStatus(visitData.cardId, card_status.occupied, visitId)
      .pipe(
        switchMap(() => {
          if (visitData.visitType === "inside_office") {
            const approvalReqData: ApprovalPost =
                          this.createApprovalData(visitId, visitData);
            this.handleInsideOfficeVisit(approvalReqData);
          } else {
            this.handleOutsideOfficeVisit();
          }
          return of(null);
        })
      );
  }

  createVisitorData(visitorDetails: NgForm): visitorPost {
    const name = this.extractNames(visitorDetails.value.name);
    return {
      firstName: name.firstName,
      lastName: name.lastName,
      phoneNumber: visitorDetails?.value?.phoneNumber,
      email: visitorDetails?.value?.email ?? "",
      organization: visitorDetails?.value?.organization,
      address: visitorDetails?.value?.address,
      idProofNumber: visitorDetails?.value?.idProofNumber ?? "",
      idPhotoBlob: this.webcamIDImage?.imageAsBase64 ?? "",
      vistorPhotoBlob: this.webcamPhotoImage?.imageAsBase64 ?? ""
    };
  }

  createVisitData(visitorId: string, visitorDetails: NgForm): visitPost {
    return {
      visitorId: visitorId,
      name: visitorDetails?.value?.name,
      organization: visitorDetails?.value?.organization,
      phNumber: visitorDetails?.value?.phoneNumber,
      purpose: visitorDetails?.value?.purpose,
      visitType: visitorDetails?.value?.visitType,
      toMeet: visitorDetails?.value?.toMeet,
      cardId: visitorDetails?.value?.cardId,
      comments: visitorDetails?.value?.comments ?? "",
      checkedInBy: this.user?.name
    };
  }

  createApprovalData(visitId: string, visitData: visitPost): ApprovalPost {
    return {
      name: visitData.name,
      organization: visitData.organization,
      phNumber: visitData.phNumber,
      purpose: visitData.purpose,
      visitId: visitId
    };
  }

  handleOutsideOfficeVisit(): void {
    this.loader.hideLoader();
    this.toastService.showInfo(this.addVisitorConstants.OUTSIDE_OFFICE_MESSAGE);
    this.visitService.visitChanged$.next(true);
    this.closeDialog();
  }

  handleInsideOfficeVisit(approvalRequestData: ApprovalPost): void {
    this.approvalService.postApproval(approvalRequestData).subscribe({
      next: () => {
        this.loader.hideLoader();
        this.toastService.showInfo(
          this.addVisitorConstants.INSIDE_OFFICE_MESSAGE
        );
        this.closeDialog();
        this.visitService.visitChanged$.next(true);
      }
    });
  }

  closeDialog(): void {
    this.webcamPhotoImage = undefined;
    this.webcamIDImage = undefined;
    this.visitorDetailsForm.resetForm();
    this.visible.emit(false);
  }

  public openPhotoCamera(): void {
    this.showPhotoCamera = true;
    this.showUserPhotoPlaceholder = false;
    this.isPhotoImageInvalid = false;
  }

  public getPhotoSnapshot(): void {
    this.trigger.next(false);
    this.showPhotoCamera = false;
  }

  public resetPhotoCamera(): void {
    this.showPhotoCamera = true;
    this.webcamPhotoImage = undefined;
  }

  public capturePhotoImg(webcamImage: WebcamImage): void {
    this.webcamPhotoImage = webcamImage;
    this.isPhotoImageInvalid = false;
  }

  public resetIDCamera(): void {
    this.showIDCamera = true;
    this.webcamIDImage = undefined;
  }

  public openIDCamera(): void {
    this.showIDCamera = true;
    this.showIDplaceholder = false;
    this.isPhotoImageInvalid = false;
  }

  public getIDSnapshot(): void {
    this.trigger.next(false);
    this.showIDCamera = false;
  }

  public captureIDImg(webcamImage: WebcamImage): void {
    this.webcamIDImage = webcamImage;
    this.showIDplaceholder = false;
    this.isIDImageInvalid = false;
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  clickPictureError(): void {
    this.toastService.showWarn(this.addVisitorConstants.CLICK_PICTURE_WARNING);
  }

  extractNames(name: string): { firstName: string; lastName: string } {
    const names = name.split(" ");
    const firstName = names[0];
    let lastName = "";
    if (names.length > 1) {
      lastName = names.slice(1).join(" ");
    }
    return { firstName, lastName };
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
