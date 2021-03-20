import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { TaskRoutingModule } from './task-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormioModule } from 'angular-formio';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CountdownModule } from 'ngx-countdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [TaskDialogComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
    MatCardModule,
    MatButtonModule,
    FormioModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    MatSelectModule,
    MatSidenavModule,
    SharedModule,
    MatDialogModule,
    TranslateModule,
    MatSelectInfiniteScrollModule,
    NgxMatSelectSearchModule,
    MaterialFileInputModule,
    FlexLayoutModule, 
    NgxMatDatetimePickerModule, 
    NgxMatTimepickerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MatTooltipModule,
    MatProgressBarModule,
    CountdownModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    MatSelectInfiniteScrollModule,
    MatBadgeModule,
    NgxSpinnerModule
  ],
  entryComponents: [TaskDialogComponent]
})
export class TaskModule { }
