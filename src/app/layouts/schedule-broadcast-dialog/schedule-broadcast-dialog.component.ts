import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BroadcastService } from '../../core/services/broadcast.service'
import { UserService } from 'src/app/core/services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';


@Component({
  selector: 'app-schedule-broadcast-dialog',
  templateUrl: './schedule-broadcast-dialog.component.html',
  styleUrls: ['./schedule-broadcast-dialog.component.scss']
})
export class ScheduleBroadcastDialogComponent implements OnInit {

  scheduleBroadCastForm:FormGroup;
  minDate = new Date();
  showSpinner: boolean = false;
  header: string;

  constructor(private fb : FormBuilder, public dialogRef: MatDialogRef<ScheduleBroadcastDialogComponent>, 
              private userService: UserService, private snackBar: MatSnackBar, 
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.scheduleBroadCastForm = this.fb.group({ 
      scheduledAt: ''
    })
    if(this.data.type === 'schedule') {
      this.header = 'Schedule';
    } else if(this.data.type === 'reschedule') {
      this.header = 'Reschedule';
    }
  }

  handleDateInput(e) {
    return false;
  }

  scheduleBroadcast(event) {
    // this.showSpinner = true;
    console.log('val', this.scheduleBroadCastForm.value.scheduledAt.toDate().toUTCString());
    event.stopPropagation();
    const scheduleObj = {
      channelId: "resourceone",
      scheduledAt: this.scheduleBroadCastForm.value.scheduledAt.toDate().toUTCString()
    }
    console.log('schedule at', this.scheduleBroadCastForm.value);
    this.userService.scheduleBroadCast(scheduleObj).subscribe(res => {
        console.log('res', res);  
        this.dialogRef.close();
        this.snackBar.open(res.message, "OK", {
          duration: 2000,
        });
    })
  }

}
