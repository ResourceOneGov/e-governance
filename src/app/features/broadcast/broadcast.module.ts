import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastComponent } from './broadcast.component';
import { BroadcastRoutingModule } from './broadcast-routing.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BroadcastRoutingModule,
    MatButtonModule
  ]
})
export class BroadcastModule { }
