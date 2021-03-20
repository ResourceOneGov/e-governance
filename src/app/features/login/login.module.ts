import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormioModule } from 'angular-formio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from 'src/app/material-module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginViaOtpComponent } from './login-via-otp/login-via-otp.component';
import { LoginService } from '../../core/services/login-service';
import { RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { LaunchComponent } from './launch/launch.component';

@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, LoginViaOtpComponent, ResetPasswordComponent, VerifyOtpComponent, LaunchComponent],
  imports: [
    CommonModule,
    MaterialModule,
    LoginRoutingModule,
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
    RouterModule
  ],
  providers: [LoginService]
})
export class LoginModule { }
