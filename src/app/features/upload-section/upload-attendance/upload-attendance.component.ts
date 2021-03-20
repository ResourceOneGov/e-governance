import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-attendance',
  templateUrl: './upload-attendance.component.html',
  styleUrls: ['./upload-attendance.component.scss']
})
export class UploadAttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  error: any;
  progress: number;
  subscription: Subscription;
  progressMessage: string;

  constructor(private fb: FormBuilder, private eLearningService: ELearningService, 
    private snackBar: MatSnackBar, private spinner: NgxSpinnerService, private attendanceService: AttendanceService) { 
      this.subscription = this.attendanceService.uploadAttendanceProgress$.subscribe(message => { 
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
    this.attendanceForm = this.fb.group({ 
      file:''
    });
    this.uploadStatus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  uploadStatus() {
    
  }

  uploadAttendance() {
    this.spinner.show();
    this.attendanceService.uploadAttendanceFile(this.attendanceForm.controls['file'].value.files[0]).then(res => {
      console.log('res', res);
      this.uploadAttendanceKey(res);
    }, error => {
      this.error = error;
      this.progress = 0;
      this.spinner.hide();
    });
  }

  uploadAttendanceKey(key) {
    this.attendanceService.uploadAttendance({key}).subscribe(res => {
      console.log('res', res);
      this.spinner.hide();
      this.attendanceForm.reset();
      this.progress = 0; 
      this.snackBar.open("Attendance Uploaded Successfully", "OK", {
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
