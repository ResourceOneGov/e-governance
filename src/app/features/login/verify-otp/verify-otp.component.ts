import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  verifyOtpForm: FormGroup;
  mobileNumber;
  message: string;
  error: string;

  constructor(private fb : FormBuilder, private loginService: LoginService, private route: ActivatedRoute,
     public router: Router) {
      this.mobileNumber = this.router.getCurrentNavigation().extras.state.mobileNumber;
   }

  ngOnInit(): void {
    this.verifyOtpForm = this.fb.group({ 
      mobileNumber: this.mobileNumber,
      code: ['', [Validators.required, Validators.pattern("^[0-9]{6}$")]]
    })
  }

  onSubmit() {
    this.loginService.onVerifyOTP(this.verifyOtpForm.value).subscribe(res => {
      this.router.navigate(['/layouts/dashboard']);
      // this.router.navigate(['/layouts/reports']);
    },error => {
      console.log('error in login', error);
      this.error = error.error.message;
    });
  }

}
