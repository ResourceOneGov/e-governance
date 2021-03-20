import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/helpers';
import { UpdateStatusComponent } from './update-status.component';

const routes: Routes = [
  { path: '', 
    component: UpdateStatusComponent,
    children: [
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateStatusRoutingModule { }
