import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ELearningService } from '../../core/services/e-learning.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { Subscription } from 'rxjs';
import { InputValidator } from 'src/app/core/utils/input.validator';
import { MatDialog } from '@angular/material/dialog';
import { ElearningDialogComponent } from './elearning-dialog/elearning-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-e-learning',
  templateUrl: './e-learning.component.html',
  styleUrls: ['./e-learning.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ELearningComponent implements OnInit {

  // uploadVideoForm: FormGroup;
  // error: string;
  // showSpinner: boolean = false;
  // categories: Category[];
  // subscription: Subscription;
  // progress: number = 0;
  // progressMessage: string;
  // progressDetails: any;
  // isFileUploading: boolean;

  displayedColumns: string[] = ['No','name', 'category', 'likes', 'action'];
  videosDataSource = new MatTableDataSource();
  limit: number;
  offset: number;
  search: string;
  tasksLength: number;

  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild('taskInput') taskInput: ElementRef;

  constructor(private fb: FormBuilder, private eLearningService: ELearningService, private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService, private categoryService: CategoryService, private dialog: MatDialog) {

      // this.subscription = this.eLearningService.uploadVideoProgress$.subscribe(message => {
      //   if(message) {
      //     console.log('message', message);
      //     this.progressDetails = message;
      //     this.progress = Math.round(message.loaded / message.total * 100);
      //     console.log('Message', this.progress);
      //     if(this.progress > 0 && this.progress < 100) {
      //       this.progressMessage = `${this.progress}% uploaded`;
      //     } else if(this.progress === 100) {
      //       this.progress = 0;
      //       this.isFileUploading = false;
      //       this.snackBar.open("Video Updated Successfully", "OK", {
      //         duration: 2000,
      //       });
      //       this.reset();
      //     }
      //   }
      // }, err => {
      //   console.log('error', err);
      // });
  }

  ngOnInit(): void {
    this.limit = 10;
    this.offset = 0;
    this.getElearningVideos();
    // this.categoryService.getCategories('elearning').subscribe(res => {
    //   this.categories = res;
    // });

    // this.uploadVideoForm = this.fb.group({
    //   name: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
    //   category:'',
    //   description: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
    //   video:''
    // })
  }

  // get f(){
  //   return this.uploadVideoForm.controls;
  // }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  // onUploadVideo() {
  //   this.progress = 0;
  //   this.isFileUploading = true;
  //   console.log('uploadFormVideo', this.uploadVideoForm.value, this.uploadVideoForm.controls['video'].value.files[0]);
  //   this.eLearningService.uploadFile(this.uploadVideoForm.value);
  //   // .then(res => {
  //   //   console.log('res', res);
  //   //   this.spinner.hide();
  //   //   this.snackBar.open("Video Updated Successfully", "OK", {
  //   //     duration: 2000,
  //   //   });
  //   //   this.uploadVideoForm.reset();
  //   // }, error => {
  //   //   this.error = error;
  //   //   this.spinner.hide();
  //   // });

  // }

  // cancelUpload() {
  //   this.eLearningService.cancelUpload();
  //   this.isFileUploading = false;
  //   this.snackBar.open("Video Upload Cancelled Successfully", "OK", {
  //     duration: 2000,
  //   });
  //   this.reset();
  // }

  // reset() {
  //   this.progress = 0;
  //   this.uploadVideoForm.reset();
  //   this.uploadVideoForm.controls['video'].setValue(null, { emitEvent: false });
  //   const fileInput = <HTMLInputElement>document.querySelector('ngx-mat-file-input[formcontrolname="video"] input[type="file"]');
  //   fileInput.value = null;
  // }

  uploadVideo() {
    const dialogRef = this.dialog.open(ElearningDialogComponent, {
      width: "80%",
    });
    const onSubmit = dialogRef.componentInstance.onSubmitVideos.subscribe((data: any) => {
      this.limit = 10;
      this.offset = 0;
      this.search = '';
      dialogRef.close();
      this.getElearningVideos();
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed ' + result);
    });
  }

  getElearningVideos() {
    this.eLearningService.getVideos('','', this.limit, this.offset).subscribe((res)=> {
      this.videosDataSource = new MatTableDataSource(res.videos);
        this.tasksLength = res.count;
        setTimeout(()=> {
          this.videosDataSource.paginator = this.paginator;
        },100);
    })
  }

  editVideo(video) {
    const dialogRef = this.dialog.open(ElearningDialogComponent, {
      data: video,
      width: "80%",
    });
    const onSubmit = dialogRef.componentInstance.onSubmitVideos.subscribe((data: any) => {
      dialogRef.close();
      this.getElearningVideos();
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed ' + result);
    });
  }

  deleteVideo(video) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this video ${video.name}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eLearningService.deleteVideo(video).subscribe(res => {
          console.log('Video deleted Successfully');
          // this.snackBar.open("Video Deleted Successfully");
          this.getElearningVideos();
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        })
      }
    })
  }

  convertDate(date) {
    return moment(date).format('ll');
  }

  onPaginateChange(e) {
    this.limit = e.pageSize;
    this.offset = e.pageIndex * e.pageSize;
    this.getElearningVideos();
  }

}
