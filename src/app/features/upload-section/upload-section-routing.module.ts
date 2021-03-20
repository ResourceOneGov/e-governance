import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/core/helpers';
import { UploadSectionComponent } from './upload-section.component';

const routes: Routes = [
  { path: '', 
    component: UploadSectionComponent,
    children: [
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadSectionRoutingModule { }
