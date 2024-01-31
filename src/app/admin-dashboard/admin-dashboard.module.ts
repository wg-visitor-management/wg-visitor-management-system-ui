import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, AdminDashboardRoutingModule, SharedModule]
})
export class AdminDashboardModule {}
