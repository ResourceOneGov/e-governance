import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/helpers';
import { ReportsComponent } from './reports.component';
import { DetailReportViewComponent } from './detail-report-view/detail-report-view.component';

const routes: Routes = [
  { path: '', 
    children: [
      { path: 'detailView/:title', component: DetailReportViewComponent, data: {} },
      { path: '', component: ReportsComponent, pathMatch: 'full'}
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
