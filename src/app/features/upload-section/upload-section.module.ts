import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadSectionComponent } from './upload-section.component';
import { UploadSectionRoutingModule } from './upload-section-routing.module';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { FormioModule } from 'angular-formio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerModule } from "ngx-spinner";
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { UploadNewsComponent } from './upload-news/upload-news.component';
import { UploadCarouselComponent } from './upload-carousel/upload-carousel.component';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { UploadNewsDialogComponent } from './upload-news/upload-news-dialog/upload-news-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadUserComponent } from './upload-user/upload-user.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { UploadIssueComponent } from './upload-issue/upload-issue.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { UploadBulkUsersComponent } from './upload-user/upload-bulk-users/upload-bulk-users.component';
import { UploadUsersByLocationComponent } from './upload-user/upload-users-by-location/upload-users-by-location.component';


@NgModule({
  declarations: [ UploadAttendanceComponent, UploadNewsComponent, UploadCarouselComponent, UploadNewsDialogComponent, 
    UploadUserComponent, UploadIssueComponent, UploadBulkUsersComponent, UploadUsersByLocationComponent ],
  imports: [
    CommonModule,
    UploadSectionRoutingModule,
    FormioModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    MaterialFileInputModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    TranslateModule,
    MatTabsModule
  ],
  exports: [
    UploadAttendanceComponent,
    UploadNewsComponent,
    UploadCarouselComponent,
    UploadUserComponent,
    UploadIssueComponent
  ],
  entryComponents: [
    UploadNewsDialogComponent
  ]
})
export class UploadSectionModule { }
