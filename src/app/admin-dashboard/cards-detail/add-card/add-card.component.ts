import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from "@angular/core";
import { NgForm } from "@angular/forms";

import { Subscription, finalize } from "rxjs";

import { CARD_CONSTANTS } from "src/app/shared/constants/card-constants";
import { CardResponse } from "src/app/shared/models/card-model";
import { CardService } from "src/app/shared/services/card.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { ToastService } from "src/app/shared/services/toast.service";

@Component({
  selector: "app-add-card",
  templateUrl: "./add-card.component.html",
  styleUrls: ["./add-card.component.scss"]
})
export class AddCardComponent implements OnDestroy {
  addCardConstant = CARD_CONSTANTS;
  @Output() closeCardPopUp = new EventEmitter<string>();
  @ViewChild("cardForm") cardForm!: NgForm;
  isProposedMenuOpen!: boolean;
  whileSubmitting = true;
  subscription$ = new Subscription();
  proposeForm!: NgForm;

  constructor(
    private cardService: CardService,
    private toast: ToastService,
    private loaderService: LoaderService
  ) {}

  onSubmit(): void {
    this.loaderService.showLoader();
    this.whileSubmitting = false;
    const cardsToAdd: string[] = [this.cardForm.value["card"]];

    this.subscription$.add(
      this.cardService
        .addCard(cardsToAdd)
        .pipe(
          finalize(() => {
            this.whileSubmitting = true;
            this.cardForm.reset();
          })
        )
        .subscribe({
          next: () => {
            this.refreshCards();
          },
          error: () => {
            this.closePopUp("cancel");
          }
        })
    );
  }

  private refreshCards(): void {
    this.subscription$.add(
      this.cardService.getData().subscribe({
        next: (cardResponse: CardResponse) => {
          this.cardService.cards = cardResponse.data;
          this.closePopUp("save");
          this.toast.showSuccess(this.addCardConstant.CARD_ADDED_SUCCESSFULLY);
        }
      })
    );
  }

  closePopUp(action: string): void {
    this.closeCardPopUp.emit(action);
    this.cardForm.resetForm();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
