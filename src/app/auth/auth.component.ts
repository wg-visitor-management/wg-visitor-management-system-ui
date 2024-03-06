import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { Subscription } from "rxjs";

import { AUTH_CONSTANTS } from "../shared/constants/auth-constants";
import { AuthService } from "./service/auth.service";
import { LoginResponse } from "../shared/models/login-response-model";
import { User } from "../shared/models/user-model";
import { ToastService } from "../shared/services/toast.service";
import { LoaderService } from "../shared/services/loader.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit, OnDestroy {
  authConstants = AUTH_CONSTANTS;
  hide = true;
  visible = false;
  subscription$: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  onSubmit(form: NgForm): void {
    this.loader.showLoader();
    const username: string = form.value.username;
    const password: string = form.value.password;

    this.subscription$.add(
      this.authService.login(username, password).subscribe({
        next: (response: LoginResponse) => {
          const user: User = this.authService.setUserModel(
            response.data.IdToken
          );
          this.authService.currentUser$.next(user);
          sessionStorage.setItem("user", JSON.stringify(user));
          this.router.navigate([`dashboard/${user.role}`]);
          this.toast.showSuccess(this.authConstants.LOGGED_IN_SUCCESSFULLY);
          this.loader.hideLoader();
        }
      })
    );
  }
  openForgotPasswordDialog(): void {
    this.visible = true;
  }

  showHidePassword(): void {
    this.hide = !this.hide;
  }
  closePopUp(isOpen: boolean): void {
    this.visible = isOpen;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
