import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/helpers';
import { TaskComponent } from './task.component';

const routes: Routes = [
  { path: '', 
    component: TaskComponent,
    children: [
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
