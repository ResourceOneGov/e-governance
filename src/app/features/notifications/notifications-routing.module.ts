import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/helpers';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  { path: '', 
    component: NotificationsComponent,
    children: [
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
