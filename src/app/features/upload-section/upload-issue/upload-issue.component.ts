import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { Papa } from 'ngx-papaparse';
import { SharedService } from 'src/app/core/services/shared.service';
import * as localforage from 'localforage';
import { IssueService } from 'src/app/core/services/issue.service';

@Component({
  selector: 'app-upload-issue',
  templateUrl: './upload-issue.component.html',
  styleUrls: ['./upload-issue.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadIssueComponent implements OnInit {

  issueForm: FormGroup;
  error: any;
  progress: number;
  subscription: Subscription;
  progressMessage: string;
  errors: any[];
  uploadUsers: any;
  issues: any;

  constructor(private fb: FormBuilder, private eLearningService: ELearningService, private papa: Papa,
    private snackBar: MatSnackBar, private spinner: NgxSpinnerService, private sharedService: SharedService, 
    private issueService: IssueService) { 
      // this.subscription = this.attendanceService.uploadAttendanceProgress$.subscribe(message => { 
      //   this.progress = Math.round(message.loaded / message.total * 100);
      //   console.log('Message', this.progress);
      //   if(this.progress > 0) {
      //     this.progressMessage = `${this.progress}% uploaded`;
      //   }
      // }, err => {
      //   console.log('error', err);
      // });
    }

  ngOnInit(): void {
    this.issueForm = this.fb.group({ 
      file:''
    });
    this.uploadStatus();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  uploadStatus() {
    
  }

  uploadIssues() {
    console.log('file', this.issueForm.controls['file'].value.files[0]);
    const issueFile = { file: this.issueForm.controls['file'].value.files[0]};
    console.log('issue file', issueFile);
    this.issueService.uploadIssues(this.issueForm.controls['file'].value.files[0]).subscribe(res => {
      console.log('res', res);
      // this.issueService.downLoadFile(res);
      this.issueForm.reset();
      this.snackBar.open("Issues Uploaded Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
    }, error => {
      this.error = error;
      this.progress = 0;
      this.spinner.hide();
    });
  }

  parseCSV() {
    this.spinner.show();
    this.error = '';
    this.errors = [];
    this.papa.parse(this.issueForm.controls['file'].value.files[0],{
      header: true,
      worker: true,
      complete: (results)=> {
        console.log('Results', results, this);
        if(results.errors.length > 0){
          this.errors = results.errors;          
        } else {
            this.issues = results.data;
            console.log('results data', results.data);
            window.localStorage.setItem('isIssueUploaded','true');
            this.sharedService.changeIssues(results.data);
            localforage.setItem('uploadIssues', JSON.stringify(results.data)).then(val => {
              console.log('val', val);
              localStorage.setItem('issues', val);
            });
            // window.localStorage.setItem('uploadIssues', this.issues);
            this.uploadAttendanceKey('upload');
        } 
      }
    });
  }

  uploadAttendanceKey(key) {
    // this.attendanceService.uploadAttendance({key}).subscribe(res => {
    //   console.log('res', res);
    
    this.spinner.hide();
    this.issueForm.reset();
  //  this.progress = 0; 
    this.snackBar.open("Issues Uploaded Successfully", "OK", {
      duration: 2000,
      verticalPosition: 'top'
    });
    // }, err => {
    //   console.log('err', err);
    //   this.error = err.error.message;
    //   this.spinner.hide();
    // })
  }


}
