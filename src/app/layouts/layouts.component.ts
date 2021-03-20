import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user-service';
import { User } from '../core/models/user.model';
import { SharedService } from '../core/services/shared.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {
  sideBarOpen: boolean = true;
  currentUser: User;
  isAdmin: boolean = false;
  intervalSubscription: Subscription;
  
  constructor(private userService: UserService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.intervalSubscription = interval(7 * 60 * 1000).subscribe(inv => {
      this.getUserDetails();
    });
  }


  ngOnDestroy() {
    if(this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  sideBarToggler(event) {
    console.log('sidebar toggle');
    this.sideBarOpen = !this.sideBarOpen;
  }

  getUserDetails(){
    this.userService.getCurrentUserDetails().subscribe(res => {
      console.log('users me', res);
      this.currentUser = res;
      if(res && res.role && res.role.roleLevel && res.role.roleLevel === 5) {
        this.isAdmin = true;
      }
    });
  }

}


