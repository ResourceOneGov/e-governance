import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-upload-bulk-users',
  templateUrl: './upload-bulk-users.component.html',
  styleUrls: ['./upload-bulk-users.component.scss']
})
export class UploadBulkUsersComponent implements OnInit {
  bulkUsersForm: FormGroup;
  error: any;
  progress: number;
  subscription: Subscription;
  progressMessage: string;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private spinner: NgxSpinnerService,
     private userService: UserService) { 
      this.subscription = this.userService.uploadBulkUsersProgress$.subscribe(message => { 
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
    this.bulkUsersForm = this.fb.group({ 
      file:''
    });
    this.uploadStatus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  uploadStatus() {
    
  }

  uploadBulkUsers() {
    this.spinner.show();
    this.userService.uploadBulkUsersFile(this.bulkUsersForm.controls['file'].value.files[0]).then(res => {
      console.log('res for bulk users', res);
      this.uploadBulkUsersKey(res);
    }, error => {
      this.error = error;
      this.progress = 0;
      this.spinner.hide();
    });
  }

  uploadBulkUsersKey(key) {
    console.log('this.userSerice', this.userService);
    this.userService.uploadBulkUsersKey({key}).subscribe(res => {
      console.log('res', res);
      this.spinner.hide();
      this.bulkUsersForm.reset();
      this.progress = 0; 
      this.snackBar.open("Users Uploaded Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
    }, err => {
      console.log('err', err);
      this.error = err.error.message;
      this.spinner.hide();
    })
  }

}
