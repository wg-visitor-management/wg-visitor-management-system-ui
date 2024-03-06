import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ApprovalsDetailComponent } from "./approvals-detail/approvals-detail.component";
import { CardsDetailComponent } from "./cards-detail/cards-detail.component";
import { SharedModule } from "../shared/shared.module";
import { VisitorListComponent } from "../shared/components/visitor-list/visitor-list.component";
import { VisitorDetailComponent } from "../shared/components/visitor-list/visitor-detail/visitor-detail.component";

const routes: Routes = [
  {
    path: "",
    component: AdminDashboardComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  {
    path: "cards",
    component: CardsDetailComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "approvals",
    component: ApprovalsDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "visitors",
    component: VisitorListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "visitors/:id",
    component: VisitorDetailComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule {}
