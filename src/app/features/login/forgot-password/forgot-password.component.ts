import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  message: string;
  error: string;

  constructor(public fb : FormBuilder, private loginService: LoginService, private router: Router) {
    this.forgotForm = this.fb.group({ 
      userId: ''
    })
   }

  ngOnInit(): void {
    
  }

  onSubmit() {
    this.message = '';
    this.error = '';
    this.loginService.onForgotPassword(this.forgotForm.value).subscribe(res => {
      console.log('res', res);
      this.message = res.message;
    },error => {
      console.log('error in login', error);
      this.error = error.error.message;
    });
  }

}
