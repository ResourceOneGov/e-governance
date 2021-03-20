import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-via-otp',
  templateUrl: './login-via-otp.component.html',
  styleUrls: ['./login-via-otp.component.scss']
})
export class LoginViaOtpComponent implements OnInit {

  otpForm: FormGroup;
  message: string;
  error: string;

  constructor(private fb : FormBuilder, private loginService: LoginService, private router: Router) {
    
   }

  ngOnInit(): void {
    this.otpForm = this.fb.group({ 
      mobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    })
  }

  onSubmit() {
    // this.router.navigate(['/login/verify-otp'], {state: {mobileNumber : this.otpForm.value.mobileNumber}})

    this.loginService.onLoginViaOTP(this.otpForm.value).subscribe(res => {
      console.log('res in loginviaotp', res);
      this.router.navigate(['/login/verify-otp'], {state: this.otpForm.value})
    },error => {
      console.log('error in login', error);
      this.error = error.error.message;
    });
  }

}
