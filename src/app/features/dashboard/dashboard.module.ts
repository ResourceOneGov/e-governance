import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormioModule } from 'angular-formio';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VolunteerTrainingComponent } from './volunteer-training/volunteer-training.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserReportsComponent } from './user-reports/user-reports.component';
import { SpecialDashboardComponent } from './special-dashboard/special-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IssueTrackerDetailsDialogComponent } from './special-dashboard/issue-tracker-details-dialog/issue-tracker-details-dialog.component';
import { IssueDistrictInfoComponent } from './special-dashboard/issue-tracker-details-dialog/issue-district-info/issue-district-info.component';
import { VolunteerFilterDialogComponent } from './special-dashboard/volunteer-filter-dialog/volunteer-filter-dialog.component';
import { VolunteerDetailsComponent } from './special-dashboard/volunteer-filter-dialog/volunteer-details/volunteer-details.component';
@NgModule({
  declarations: [VolunteerTrainingComponent, UserReportsComponent, SpecialDashboardComponent, IssueDistrictInfoComponent, IssueTrackerDetailsDialogComponent, VolunteerFilterDialogComponent, VolunteerDetailsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatCardModule,
    MatButtonModule,
    FormioModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    MatSelectModule,
    MatSidenavModule,
    SharedModule,
    MatTableModule,
    TranslateModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    MatSelectModule,
    MatExpansionModule,
    HighchartsChartModule,
    MatPaginatorModule,
    MatTabsModule
  ],
  exports: [
    VolunteerTrainingComponent,
    UserReportsComponent,
    SpecialDashboardComponent,
    IssueDistrictInfoComponent,
    IssueTrackerDetailsDialogComponent
  ]
})
export class DashboardModule { }
