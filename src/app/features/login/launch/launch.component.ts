import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/services/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss']
})
export class LaunchComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  onLaunch() {
    const loginDetails = {
      "userId": "admin",
      "password": "password"
    }
    this.loginService.onLogin(loginDetails).subscribe(res => {
      this.router.navigate(['/layouts/dashboard']);
    }, err => {
      console.log('error', err);
    });
  }

}
