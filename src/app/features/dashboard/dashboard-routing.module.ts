import { VolunteerDetailsComponent } from './special-dashboard/volunteer-filter-dialog/volunteer-details/volunteer-details.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from 'src/app/core/helpers';

import { IssueTrackerDetailsDialogComponent } from './special-dashboard/issue-tracker-details-dialog/issue-tracker-details-dialog.component';
import { SpecialDashboardComponent } from './special-dashboard/special-dashboard.component';
import { IssueDistrictInfoComponent } from './special-dashboard/issue-tracker-details-dialog/issue-district-info/issue-district-info.component';

const routes: Routes = [
  { path: '',
    component: DashboardComponent,
    children: [
    ]
  },
{path: 'issue-district-info', component: IssueDistrictInfoComponent},
{path: 'isssue-tracker-details', component: SpecialDashboardComponent},
{path: 'volunteer-details', component: VolunteerDetailsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
