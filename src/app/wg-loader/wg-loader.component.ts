import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import { LoaderService } from "../shared/services/loader.service";
import { LOADER_CONSTANTS } from "../shared/constants/loader-constants";

@Component({
  selector: "app-wg-loader",
  templateUrl: "./wg-loader.component.html",
  styleUrls: ["./wg-loader.component.scss"]
})
export class WgLoaderComponent implements OnInit, OnDestroy {
  constants = LOADER_CONSTANTS;
  isSpinnerVisible = false;
  imageUrl = this.constants.LOGO_URL;
  subscription$ = new Subscription();

  constructor(private loader: LoaderService) {
    const preloadLoader = new Image();
    preloadLoader.src = this.constants.LOGO_URL;
  }

  ngOnInit() {
    this.subscription$.add(
      this.loader.isVisibleLoader$.subscribe((isLoading: boolean) => {
        this.isSpinnerVisible = isLoading;
      })
    );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
