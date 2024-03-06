import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { RatingModule } from "primeng/rating";
import { ProgressBarModule } from "primeng/progressbar";
import { ToastModule } from "primeng/toast";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SplitButtonModule } from "primeng/splitbutton";
import { SkeletonModule } from "primeng/skeleton";
import { PaginatorModule } from "primeng/paginator";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ScrollTopModule } from "primeng/scrolltop";

import { VisitTableComponent } from "./components/visit-table/visit-table.component";
import { OverviewComponent } from "./components/overview/overview.component";
import { VisitorDetailComponent } from "./components/visitor-list/visitor-detail/visitor-detail.component";
import { VisitorListComponent } from "./components/visitor-list/visitor-list.component";
import { DateTimePipe } from "./pipes/dateTime.pipe";
import { EmptyValuePipe } from "./pipes/empty-value.pipe";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
  declarations: [
    VisitTableComponent,
    VisitorListComponent,
    OverviewComponent,
    VisitorDetailComponent,
    DateTimePipe,
    EmptyValuePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    TagModule,
    RatingModule,
    ProgressBarModule,
    ToastModule,
    CalendarModule,
    DialogModule,
    ProgressSpinnerModule,
    RouterModule,
    ConfirmDialogModule,
    InfiniteScrollModule,
    SplitButtonModule,
    SkeletonModule,
    InputTextModule,
    ScrollTopModule
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
    CalendarModule,
    OverviewComponent,
    DialogModule,
    ProgressSpinnerModule,
    DateTimePipe,
    ConfirmDialogModule,
    InfiniteScrollModule,
    SplitButtonModule,
    EmptyValuePipe,
    SkeletonModule
  ],
  providers: [DateTimePipe, EmptyValuePipe]
})
export class SharedModule {}
