import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { User } from '../../core/models/user.model';
import { LoginService } from 'src/app/core/services/login-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/user-service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsService } from 'src/app/core/services/notifications.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  @Input() fullSideBar: boolean;
  @Input() currentUser: any;
  isAdmin: boolean = false;
  url: any = '';
  profilePictureSubscription: Subscription;
  progress: number = 0;
  progressMessage: string;
  error: string;
  notificationsCount: number;
  isCM: boolean;
  
  constructor(private loginService: LoginService, private router: Router, private userService: UserService, 
    private snackBar: MatSnackBar, private notificationService: NotificationsService) {
    this.profilePictureSubscription = this.userService.uploadProfilePictureProgress$.subscribe(message => { 
      this.progress = Math.round(message.loaded / message.total * 100);
      console.log('Message', this.progress);
      if(this.progress > 0) {
        this.progressMessage = `${this.progress}% uploaded`;
      }
    }, err => {
      console.log('error', err);
    });
   }

  ngOnInit(): void {
    if(JSON.parse(localStorage.getItem('userProfile')).role.roleLevel === 10) {
      this.isCM = true;
    }
    this.url = JSON.parse(localStorage.getItem('userProfile')).profileImage;
    this.getNotifications();
  }
  getNotifications() {
    this.notificationService.getNotifications(0, 10).subscribe(res => {
      this.notificationsCount = res.count;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes.currentUser && changes.currentUser.currentValue) {
      if(this.currentUser && this.currentUser.role && this.currentUser.role.roleLevel && this.currentUser.role.roleLevel === 5) {
        this.isAdmin = true;
      } else if(this.currentUser && this.currentUser.role && this.currentUser.role.roleLevel && this.currentUser.role.roleLevel === 10) {
        this.isCM = true;
      }
    }
  }

  
  onSelectFile(event) {
    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();

    //   reader.readAsDataURL(event.target.files[0]); // read file as data url

    //   reader.onload = (event) => { // called once readAsDataURL is completed
    //     this.url = event.target.result;
    //   }
    // }
    this.progress = 0;
    if (event.target.files && event.target.files[0]) {
      this.userService.uploadProfilePictureFile(event.target.files[0]).then((res: any) => {
        console.log('res', res);
        this.url = res.Location;
        this.progress = 0;
        this.userService.updateProfileImage(this.url).subscribe(res=>{
          console.log('res', res);
          this.snackBar.open("Profile Picture Updated Successfully", "OK", {
            duration: 2000,
          });
        })
      }, error => {
        this.error = error;
        this.progress = 0;
      });
    }
  }

  

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Log Out!'
    }).then((result) => {
      if (result.value) {
        console.log('logout');
        this.loginService.logout().subscribe(res => {
          this.router.navigate(['/login']);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userProfile');
        });
      }
    })   
  }

  navigatetoHome() {
    this.router.navigate(['/layouts/dashboard']);
    // this.router.navigate(['/layouts/reports']);
  }

}
