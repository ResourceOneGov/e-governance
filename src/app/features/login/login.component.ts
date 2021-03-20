import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LoginService } from '../../core/services/login-service'
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user-service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;
  returnUrl: string;
  error: string;

  constructor(private fb : FormBuilder, private loginService: LoginService, private router: Router,
        private route: ActivatedRoute, private userService: UserService, private sharedService: SharedService) {
      // redirect to home if already logged in
      if (this.loginService.currentUserValue) { 
        this.router.navigate(['/']);
      }
   }

  ngOnInit() {
    this.loginForm = this.fb.group({ 
      userId: '',
      password: ''
    })
    // get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/layouts/dashboard';
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/layouts/reports';

    console.log('this.returnUrl', this.returnUrl);
  }

  onLogin() {
    this.loginService.onLogin(this.loginForm.value).subscribe(res => {
      this.userService.getCurrentUserDetails().subscribe(resp => {
        if(resp && resp.role && resp.role.roleLevel && resp.role.roleLevel === 1){
          this.error = 'Access Denied';
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userProfile');
        } else {
          console.log('res', res, this.returnUrl);
          this.sharedService.changeUserProfile(res);
          this.router.navigate([this.returnUrl]);
        }
      })    
    },error => {
      console.log('error in login', error);
      this.error = error.error.message;
      this.loading = false;
    });
  }
}
