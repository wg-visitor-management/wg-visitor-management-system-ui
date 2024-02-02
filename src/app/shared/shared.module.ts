import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

import { VisitsComponent } from './components/visits/visits.component';

@NgModule({
  declarations: [VisitsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    RatingModule,
    ProgressBarModule,
    ToastModule
  ],
  exports: [VisitsComponent]
})
export class SharedModule {}
