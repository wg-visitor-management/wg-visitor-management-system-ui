import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserDashboardComponent } from "./user-dashboard.component";
import { AuthGuard } from "../auth/guards/auth.guard";
import { VisitorListComponent } from "../shared/components/visitor-list/visitor-list.component";
import { VisitorDetailComponent } from "../shared/components/visitor-list/visitor-detail/visitor-detail.component";

const routes: Routes = [
  {
    path: "",
    component: UserDashboardComponent,
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule {}
