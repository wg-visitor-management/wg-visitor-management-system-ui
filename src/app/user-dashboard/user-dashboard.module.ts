import { NgModule } from "@angular/core";
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy
} from "@angular/common";
import { FormsModule } from "@angular/forms";

import { WebcamModule } from "ngx-webcam";

import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from "primeng/dialog";
import { AutoCompleteModule } from "primeng/autocomplete";

import { UserDashboardComponent } from "./user-dashboard.component";
import { UserDashboardRoutingModule } from "./user-dashboard-routing.module";
import { SharedModule } from "../shared/shared.module";
import { AddVisitComponent } from "./add-visit/add-visit.component";
import { AddVisitorComponent } from "./add-visitor/add-visitor.component";

@NgModule({
  declarations: [
    UserDashboardComponent,
    AddVisitComponent,
    AddVisitorComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    SharedModule,
    FormsModule,
    WebcamModule,
    DialogModule,
    AutoCompleteModule,
    InputTextModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class UserDashboardModule {}
