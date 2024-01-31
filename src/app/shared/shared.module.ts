import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitsComponent } from './components/visits/visits.component';

@NgModule({
  declarations: [VisitsComponent],
  imports: [CommonModule],
  exports: [VisitsComponent]
})
export class SharedModule {}
