import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ScheduleBroadcastDialogComponent } from '../schedule-broadcast-dialog/schedule-broadcast-dialog.component';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import * as moment from 'moment';
import { Broadcast } from 'src/app/core/models/broadcast.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, interval, Subscription } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarMenu: EventEmitter<any> = new EventEmitter();
  @Output() onBroadcast: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatMenuTrigger) menuBtn: MatMenuTrigger;
  @ViewChild(MatMenuTrigger) scheduleMenuBtn: MatMenuTrigger;


  isBroadCastScheduled: boolean = false;
  broadCastScheduledAt: any;
  scheduledBroadcast: Broadcast;
  secondsToMore: number;
  isBroadcastStarted: boolean = false;
  intervalSubscription: Subscription;
  isAdmin: boolean = false;
  notificationsCount: number;

  constructor(public dialog: MatDialog, private broadcastService: BroadcastService, private router: Router,
              private userService: UserService, private snackBar: MatSnackBar, private sharedService: SharedService, 
              private notificationService: NotificationsService) {
                this.getBroadcastInfo();
               }

  ngOnInit(): void {
    this.userService.getCurrentUserDetails().subscribe(res => {
      if(res && res.role && res.role.roleLevel && res.role.roleLevel === 5) {
        this.isAdmin = true;
        this.broadcastService.getBroadCast().subscribe(res => {
          this.scheduledBroadcast = res;
          if(res && res.hasNextScheduledBroadcast && moment(res.scheduledAt).isBefore(moment())) {
            Swal.fire({
              title: 'Broadcast is Active',
              text: "Please join or delete existing broadcast!",
              // icon: 'warning',
              showCancelButton: true,
              showCloseButton: false,
              allowOutsideClick: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, Join it now!',
              cancelButtonText: 'Delete'
            }).then((result) => {
              console.log('result', result.value);
              if (result.value) {
                this.getBroadcastInfo();
                this.router.navigate(['/layouts/broadcast']);
              } else if(result.dismiss === Swal.DismissReason.cancel) {
                this.onDeleteBroadcast();
              }
            })
          }
        })
      }
    })
    this.getNotifications();
  }

  getNotifications() {
    this.notificationService.getNotifications(0, 10).subscribe(res => {
      this.notificationsCount = res.count;
    })
  }

  getBroadcastInfo() {
    this.broadcastService.listen().subscribe(message => {
      console.log('message in header comp', message);
      if(message == 'Delete') {
        this.isBroadCastScheduled = false;
        this.secondsToMore = 0;
        this.isBroadcastStarted = false;
        this.getBroadcast();
      } else if(message === 'started') {
        this.isBroadcastStarted = true;
      }
    });
    this.secondsToMore = 0;
    this.getBroadcast();
    // this.intervalSubscription = interval(30000).subscribe(inv => {
    //   this.getBroadcast();
    // });
  }

  ngOnDestroy() {
  }

  navigateToSettings() {
    this.router.navigate(['/layouts/settings']);
  }

  getBroadcast() {
    this.broadcastService.getBroadCast().subscribe(res => {
      if(res && res.channelId) {
        this.scheduledBroadcast = res;
        this.isBroadCastScheduled = true;
        let days = moment(res.scheduledAt).diff(moment(), 'days');
        console.log('days', days);
        if(days >= 1) {
          this.broadCastScheduledAt = `at ${moment(res.scheduledAt).format('lll')}`;
          this.secondsToMore = 0;
        } else {
          this.secondsToMore = moment(res.scheduledAt).diff(moment(), 'seconds');
          console.log('this.secondsToMore', this.secondsToMore);
          
          // if(this.secondsToMore < -601) {
          //   console.log('secondstoMte', this.secondsToMore);
          //   this.isBroadCastScheduled = false;
          // }
        }
      }
    });
  }

  toggleSideBar() {
    this.toggleSideBarMenu.emit();
    // setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    // }, 100);
  }

  navigateToBroadCast() {
    this.router.navigate(['/layouts/broadcast']);
  }

  scheduleNow() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to schedule a broadcast now!",
      // icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Schedule it now!',
      cancelButtonText: 'Schedule Later'
    }).then((result) => {
      console.log('result', result.value);
      if (result.value) {
        this.scheduleBradcastNow();
      } else if(result.dismiss === Swal.DismissReason.cancel) {
        this.scheduleBroadcast('schedule');
      }
    })
  }

  notifyEvent(e) {
    console.log('notify event', e);
    if(e.action === "done") {
      this.secondsToMore = -1;
      // this.timeOut(600);
    }
  }

  scheduleBradcastNow() {
    const scheduleObj = {
      channelId: "resourceone",
      scheduledAt: moment(new Date()).add(10, 's').toDate().toUTCString()
    }
    this.userService.scheduleBroadCast(scheduleObj).subscribe(res => {
        console.log('res', res);  
        this.snackBar.open(res.message, "OK", {
          duration: 2000,
        });
        this.getBroadcast();
        this.isBroadCastScheduled = true;
        // this.router.navigate(['/layouts/broadcast']);
        this.broadcastService.broadCastTrigger('Create');
    })
  }

  timeOut(seconds) {
    setTimeout(()=> {
      this.isBroadCastScheduled = false;
    }, seconds * 1000);
  }

  scheduleBroadcast(type) {
    const dialogRef = this.dialog.open(ScheduleBroadcastDialogComponent, {
      width: '500px',
      data: {
        type,
        broadCastScheduledAt: this.broadCastScheduledAt
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.broadcastService.broadCastTrigger('Create');
      this.getBroadcast();
    });
  }

  deleteBroadcast() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.onDeleteBroadcast();
      }
    })
  }

  onDeleteBroadcast() {
    this.broadcastService.deleteBroadcast(this.scheduledBroadcast._id).subscribe(res => {
      Swal.fire(
        'Deleted!',
        'Your Broadcast has been deleted.',
        'success'
      );
      this.scheduledBroadcast = null;
      this.isBroadCastScheduled = false;
      this.broadcastService.broadCastTrigger('Delete');
    });
  }

  openMenu() {
    if(this.secondsToMore >= 0) {
      this.menuBtn.openMenu();
    } else {
      this.navigateToBroadCast();
    }
  }

  openScheduleMenu() {
    this.scheduleMenuBtn.openMenu();
  }

}
