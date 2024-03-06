import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { Subscription } from "rxjs";
import { Table } from "primeng/table";
import { ConfirmationService } from "primeng/api";

import { CardService } from "src/app/shared/services/card.service";
import { CARD_CONSTANTS } from "src/app/shared/constants/card-constants";
import { ToastService } from "src/app/shared/services/toast.service";
import { Card, CardResponse } from "src/app/shared/models/card-model";
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
  selector: "app-cards-detail",
  templateUrl: "./cards-detail.component.html",
  styleUrls: ["./cards-detail.component.scss"],
  providers: [ConfirmationService]
})
export class CardsDetailComponent implements OnInit, OnDestroy {
  addCardConstants = CARD_CONSTANTS;
  @ViewChild("cardDetailTable") cardDetailTable: Table | undefined;
  visible = false;
  whileSubmitting = false;
  subscription$ = new Subscription();
  cards!: Card[];
  fieldsToFilter = ["card_id", "cardStatus", "action"];

  constructor(
    private cardService: CardService,
    private toast: ToastService,
    private confirmationService: ConfirmationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.getCardsData();
  }

  getCardsData(): void {
    this.loaderService.showLoader();
    this.subscription$.add(
      this.cardService.getData().subscribe({
        next: (cards: CardResponse) => {
          this.cardService.cards = cards.data;
          this.cards = this.cardService.cards;
          this.cardService.sortCardsById(this.cards);
          this.loaderService.hideLoader();
        }
      })
    );
  }

  applyFilterGlobal(event: Event, stringVal: string): void {
    this.cardDetailTable?.filterGlobal(
      (event.target as HTMLInputElement).value,
      stringVal
    );
  }

  discardCard(cardId: string): void {
    this.whileSubmitting = true;
    this.loaderService.showLoader();
    this.subscription$.add(
      this.cardService.discardCard(cardId).subscribe({
        next: () => {
          this.getCardsData();
          this.toast.showSuccess(
            this.addCardConstants.CARD_DISCARDED_SUCCESSFULLY
          );
          this.whileSubmitting = false;
        },
        error: () => {
          this.toast.showError(this.addCardConstants.ERROR_DISCARDING_CARD);
        }
      })
    );
  }

  getSeverity(status: string): string {
    switch (status) {
      case "occupied":
        return "danger";
      case "available":
        return "success";
      case "discarded":
        return "warning";
      default:
        return "info";
    }
  }

  openDialog(): void {
    this.visible = true;
  }

  closePopUp(action: string): void {
    if (action === "save") {
      this.getCardsData();
    }
    this.visible = false;
  }

  confirm(cardId: string): void {
    this.confirmationService.confirm({
      message: this.addCardConstants.CONFIRM_MESSAGE,
      header: this.addCardConstants.CONFIRMATION,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.discardCard(cardId);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
