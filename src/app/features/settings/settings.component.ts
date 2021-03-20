import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/core/utils/confirm-password.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  
  changePasswordForm: FormGroup;
  error: string;
  language = new FormControl();
  languages = [{ value: 'en', viewValue: 'English'}, { value: 'te', viewValue: 'Telegu'}];

  constructor(public fb : FormBuilder, private loginService: LoginService, private snackBar: MatSnackBar, 
    public translate: TranslateService) {
      translate.addLangs(['en', 'te']);  
      if (localStorage.getItem('locale')) {  
        const browserLang = localStorage.getItem('locale');
        this.language.setValue(browserLang);  
        translate.use(browserLang.match(/en|te/) ? browserLang : 'en');  
      } else {  
        localStorage.setItem('locale', 'en');  
        translate.setDefaultLang('en');  
      }  
  }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({ 
      oldPassword:['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },{validator: ConfirmPasswordValidator.MatchPassword });
  }

  changePassword() {
    const {confirmPassword, ...changePasswordParams} = this.changePasswordForm.value;
    this.loginService.changePassword(changePasswordParams).subscribe(res => {
      this.changePasswordForm.reset();
      this.snackBar.open("Password Changed Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
    }, err => {
      this.error = err.error.message;
    })
  }

  changeLanguage(language){
    localStorage.setItem('locale', language.value);  
    this.translate.use(language.value); 
  }

}
