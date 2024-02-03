import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';

import { VisitTableComponent } from './components/visit-table/visit-table.component';

@NgModule({
  declarations: [VisitTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    RatingModule,
    ProgressBarModule,
    ToastModule,
    CalendarModule
  ],
  exports: [
    VisitTableComponent,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    RatingModule,
    ProgressBarModule,
    ToastModule,
    CalendarModule
  ]
})
export class SharedModule {}
