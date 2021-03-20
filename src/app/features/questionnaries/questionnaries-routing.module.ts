import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/helpers';
import { QuestionnariesComponent } from './questionnaries.component';

const routes: Routes = [
  { path: '', 
    component: QuestionnariesComponent,
    children: [
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnariesRoutingModule { }
