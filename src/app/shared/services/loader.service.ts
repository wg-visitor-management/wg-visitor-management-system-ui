import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class LoaderService {
  isVisibleLoader$ = new BehaviorSubject<boolean>(false);

  showLoader(): void {
    this.isVisibleLoader$.next(true);
  }

  hideLoader(): void {
    this.isVisibleLoader$.next(false);
  }
}
