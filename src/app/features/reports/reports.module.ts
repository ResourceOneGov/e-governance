import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReportsOverviewComponent } from './reports-overview/reports-overview.component';
import { DetailReportViewComponent } from './detail-report-view/detail-report-view.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ReportsOverviewComponent, DetailReportViewComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatSelectInfiniteScrollModule,
    MatSelectModule,
    ScrollingModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ReportsOverviewComponent,
    DetailReportViewComponent
  ],
  providers: [
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
})
export class ReportsModule { }
