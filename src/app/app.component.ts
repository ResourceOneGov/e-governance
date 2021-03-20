import { Component } from '@angular/core';
import { LoginService } from './core/services/login-service';
import { Router } from '@angular/router';
import { TranslateService } from  '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EGovernanceWebPortal';
  currentUser: any;

  constructor(
      private router: Router,
      private loginService: LoginService, private translate: TranslateService
  ) {
      this.loginService.currentUser.subscribe(x => this.currentUser = x);
      translate.addLangs(['en', 'te']);  
      if (localStorage.getItem('locale')) {  
        const browserLang = localStorage.getItem('locale');  
        translate.use(browserLang.match(/en|te/) ? browserLang : 'en');  
      } else {  
        localStorage.setItem('locale', 'en');  
        translate.setDefaultLang('en');  
      }  
  }

  logout() {
      this.loginService.logout();
      this.router.navigate(['/login']);
  }

}
