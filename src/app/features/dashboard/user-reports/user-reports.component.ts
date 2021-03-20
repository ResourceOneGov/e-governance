import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.scss']
})
export class UserReportsComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsersReports();
  }
  getUsersReports() {
    // this.userService.getUsersReports().subscribe(res => {
    //   console.log('res', res);
    // })
  }

}
