import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login-service';
import { ConfirmPasswordValidator } from 'src/app/core/utils/confirm-password.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  error: string;

  constructor(public fb : FormBuilder, private loginService: LoginService, private route: ActivatedRoute, private router: Router, 
    private snackBar: MatSnackBar) {
    
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.resetForm = this.fb.group({ 
        uid: this.route.snapshot.queryParams.uid,
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },{validator: ConfirmPasswordValidator.MatchPassword })
    })
  }

  onSubmit() {
    const {confirmPassword, ...resetParams} = this.resetForm.value;
    this.loginService.onResetPassword(resetParams).subscribe(res => {
      console.log('res', res);
      this.snackBar.open(res.message, "OK", {
        duration: 2000,
      });
      this.router.navigate(['/login']);
    },error => {
      console.log('error in login', error);
      this.error = error.error.message;
    });
  }
}
