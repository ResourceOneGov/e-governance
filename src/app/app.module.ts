import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FormioModule } from 'angular-formio';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material-module';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient  } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './core/helpers';
import { LoginService } from './core/services/login-service';
import { LayoutsModule } from './layouts/layouts.module';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarMenuComponent } from './layouts/sidebar-menu/sidebar-menu.component';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { UserModule } from './features/user/user.module';
import { UserComponent } from './features/user/user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ELearningComponent } from './features/e-learning/e-learning.component';
import { ELearningModule } from './features/e-learning/e-learning.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SharedModule } from './shared/shared.module';
import { QuestionnariesComponent } from './features/questionnaries/questionnaries.component';
import { QuestionnariesModule } from './features/questionnaries/questionnaries.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ScheduleBroadcastDialogComponent } from './layouts/schedule-broadcast-dialog/schedule-broadcast-dialog.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc'; 
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CountdownModule } from 'ngx-countdown';


import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { BroadcastComponent } from './features/broadcast/broadcast.component';
import { TaskComponent } from './features/task/task.component';
import { MatSelectModule } from '@angular/material/select';
import { ReportsComponent } from './features/reports/reports.component';
import { MatStepperModule } from '@angular/material/stepper';
import { UpdateStatusComponent } from './features/update-status/update-status.component';
import { CategoryComponent } from './features/category/category.component';
import { UploadSectionComponent } from './features/upload-section/upload-section.component';
import { UploadSectionModule } from './features/upload-section/upload-section.module';
import { SettingsModule } from './features/settings/settings.module';
import { SettingsComponent } from './features/settings/settings.component';
import { ReportsModule } from './features/reports/reports.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { GlobalErrorHandler } from './core/helpers/global-error-handler';
import { ManageUsersComponent } from './features/manage-users/manage-users.component';
import { ManageUsersModule } from './features/manage-users/manage-users.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatTabsModule } from '@angular/material/tabs';

const agoraConfig: AgoraConfig = {
  AppID: '31c5688ef4a14676986b13acafacd33d',
};

@NgModule({
  declarations: [
    AppComponent,
    LayoutsComponent,
    HeaderComponent,
    SidebarMenuComponent,
    DashboardComponent,
    UserComponent,
    ELearningComponent,
    QuestionnariesComponent,
    ScheduleBroadcastDialogComponent,
    BroadcastComponent,
    TaskComponent,
    ReportsComponent,
    UpdateStatusComponent,
    CategoryComponent,
    UploadSectionComponent,
    SettingsComponent,
    ManageUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    MaterialFileInputModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormioModule,
    LayoutsModule,
    DashboardModule,
    UserModule,
    ReactiveFormsModule,
    ELearningModule,
    SharedModule,
    QuestionnariesModule,
    MatDialogModule,
    NgxMatDatetimePickerModule, 
    NgxMatTimepickerModule,
    FormioModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    NgxMatMomentModule,
    AngularAgoraRtcModule.forRoot(agoraConfig),
    NgxSpinnerModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatStepperModule,
    CountdownModule,
    UploadSectionModule,
    MatInputModule,
    SettingsModule,
    ReportsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectInfiniteScrollModule,
    ManageUsersModule,
    HttpClientModule,
    MatTabsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports: [TranslateModule],
  entryComponents: [
    ScheduleBroadcastDialogComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler}
    , LoginService, TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}