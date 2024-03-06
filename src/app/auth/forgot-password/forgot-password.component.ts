import { Component, EventEmitter, OnDestroy, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Subscription, finalize } from "rxjs";

import { AuthService } from "../service/auth.service";
import { ForgotPasswordResponse } from "src/app/shared/models/login-response-model";
import { ToastService } from "src/app/shared/services/toast.service";
import { FORGOT_PASSWORD_CONSTANTS } from "src/app/shared/constants/forgot-password.constants";
import { LoaderService } from "src/app/shared/services/loader.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnDestroy {
  constants = FORGOT_PASSWORD_CONSTANTS;
  @Output() closeForgotPasswordPopUp = new EventEmitter<boolean>();
  otpSent = false;
  changingPassword = false;
  hide = true;
  email = "";
  otp = "";
  subscription$: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private loader: LoaderService
  ) {}

  showHidePassword(): void {
    this.hide = !this.hide;
  }

  onSendOtp(userEmail: string): void {
    this.loader.showLoader();
    this.subscription$.add(
      this.authService.sendOtp("get_token", userEmail).subscribe({
        next: (response: ForgotPasswordResponse) => {
          if (response.status === "success") {
            this.toast.showSuccess(this.constants.OTP_SENT_SUCCESSFULLY);
            this.otpSent = true;
            this.loader.hideLoader();
          }
        },
        error: () => {
          this.toast.showError(this.constants.NO_USER_FOUND);
          this.loader.hideLoader();
        }
      })
    );
  }

  onVerifyOtp(form: NgForm): void {
    if (form.value.code === "") {
      this.toast.showError(this.constants.ENTER_OTP);
      return;
    }
    this.email = form.value.email;
    this.otp = form.value.code;
    this.changingPassword = true;
  }

  onBack(): void {
    this.changingPassword = false;
  }

  resetPassword(form: NgForm): void {
    if (form.value.password !== form.value.confirmPassword) {
      this.toast.showError(this.constants.PASSWORDS_DO_NOT_MATCH);
      return;
    }
    this.loader.showLoader();
    this.subscription$.add(
      this.authService
        .resetPassword(
          "change_password",
          form.value.userEmail,
          form.value.code.toString(),
          form.value.password
        )
        .pipe(
          finalize(() => {
            this.otpSent = false;
          })
        )
        .subscribe({
          next: (response: ForgotPasswordResponse) => {
            if (response.status === "success") {
              this.toast.showSuccess(
                this.constants.PASSWORD_RESET_SUCCESSFULLY
              );
              this.closeForgotPasswordPopUp.emit(false);
              this.changingPassword = false;
              this.loader.hideLoader();
              form.reset();
            }
          },
          error: () => {
            form.reset();
            this.loader.hideLoader();
            this.onBack();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
