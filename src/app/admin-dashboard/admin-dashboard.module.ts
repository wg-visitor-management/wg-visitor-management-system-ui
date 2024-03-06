import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminDashboardRoutingModule } from "./admin-dashboard-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ApprovalsDetailComponent } from "./approvals-detail/approvals-detail.component";
import { PendingApprovalComponent } from "./pending-approval/pending-approval.component";
import { CardsDetailComponent } from "./cards-detail/cards-detail.component";
import { AddCardComponent } from "./cards-detail/add-card/add-card.component";

@NgModule({
  declarations: [
    AdminDashboardComponent,
    CardsDetailComponent,
    ApprovalsDetailComponent,
    AddCardComponent,
    PendingApprovalComponent
  ],
  imports: [CommonModule, AdminDashboardRoutingModule, SharedModule]
})
export class AdminDashboardModule {}
