import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/helpers';
import { UserComponent } from './user.component';

const routes: Routes = [
  { path: '', 
    component: UserComponent,
    children: [
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
