import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './manage-users.component';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ManageUsersTableComponent } from './manage-users-table/manage-users-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [ManageUsersTableComponent],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
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
    NgxMatSelectSearchModule,
    NgxSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    TranslateModule
  ],
  exports: [
    ManageUsersTableComponent
  ], 
})
export class ManageUsersModule { }
