import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnariesComponent } from './questionnaries.component';
import { QuestionnariesRoutingModule } from './questionnaries-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { OptionsListComponent } from './options-list/options-list.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QuestionnariesRoutingModule,
    MatSelectModule
  ]
})
export class QuestionnariesModule { }
