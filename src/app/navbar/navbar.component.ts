import { LoaderService } from "./../shared/services/loader.service";
import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import { AuthService } from "../auth/service/auth.service";
import { ToastService } from "../shared/services/toast.service";
import { User } from "../shared/models/user-model";
import { NAVBAR_CONSTANTS } from "../shared/constants/navbar-constants";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  navbarConstants = NAVBAR_CONSTANTS;
  subscription$ = new Subscription();
  isLoggedIn = false;
  user!: User;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.subscription$.add(
      this.authService.currentUser$.subscribe((user: User | null) => {
        if (user) {
          this.user = user;
        }
        this.isLoggedIn = !!user;
      })
    );
  }

  logout(): void {
    this.loader.showLoader();
    this.authService.logout();
    this.isLoggedIn = false;
    this.loader.hideLoader();
    this.toast.showSuccess(this.navbarConstants.LOGGED_OUT_SUCCESSFULLY);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
