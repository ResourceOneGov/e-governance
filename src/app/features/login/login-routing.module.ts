import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginViaOtpComponent } from './login-via-otp/login-via-otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { LaunchComponent } from './launch/launch.component';

const routes: Routes = [
  { path: '', 
    children: [
      { path: '', component: LoginComponent, pathMatch: 'full'},
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'login-via-otp', component: LoginViaOtpComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'verify-otp', component: VerifyOtpComponent, data:{ mobileNumber : '' } }, 
      { path: 'launch', component: LaunchComponent }       
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
