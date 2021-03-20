import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateStatusComponent } from './update-status.component';
import { UpdateStatusRoutingModule } from './update-status-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UpdateStatusRoutingModule,
    MatTooltipModule
  ]
})
export class UpdateStatusModule { }
