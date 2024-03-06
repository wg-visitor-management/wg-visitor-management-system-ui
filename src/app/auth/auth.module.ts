import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DialogModule } from "primeng/dialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";

import { AuthComponent } from "./auth.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [AuthComponent, ForgotPasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    AuthRoutingModule,
    DialogModule,
    ProgressSpinnerModule,
    SharedModule
  ]
})
export class AuthModule {}
