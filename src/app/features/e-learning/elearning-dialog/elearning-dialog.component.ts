import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { InputValidator } from 'src/app/core/utils/input.validator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-elearning-dialog',
  templateUrl: './elearning-dialog.component.html',
  styleUrls: ['./elearning-dialog.component.scss']
})
export class ElearningDialogComponent implements OnInit {

  @Output() onSubmitVideos = new EventEmitter<any>();

  uploadVideoForm: FormGroup;
  error: string;
  showSpinner: boolean = false;
  categories: Category[];
  subscription: Subscription;
  progress: number = 0;
  progressMessage: string;
  progressDetails: any;
  isFileUploading: boolean;
  isEditVideo: boolean = false;

  constructor(private fb: FormBuilder, private eLearningService: ELearningService, private snackBar: MatSnackBar,
              private spinner: NgxSpinnerService, private categoryService: CategoryService, 
              public dialogRef: MatDialogRef<ElearningDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {

      this.subscription = this.eLearningService.uploadVideoProgress$.subscribe(message => {
        if(message) {
          console.log('message', message);
          this.progressDetails = message; 
          this.progress = Math.round(message.loaded / message.total * 100);
          console.log('Message', this.progress);
          if(this.progress > 0 && this.progress < 100) {
            this.progressMessage = `${this.progress}% uploaded`;
          } else if(this.progress === 100) {
            this.progress = 0;
            this.isFileUploading = false;
            this.onSubmitVideos.emit();
            this.snackBar.open("Video Uploaded Successfully", "OK", {
              duration: 2000,
            });
            this.reset();
          }
        }
      }, err => {
        console.log('error', err);
      });
  }

  ngOnInit(): void {
    if(this.data && this.data._id){
      this.isEditVideo = true;
    }
    
    this.uploadVideoForm = this.fb.group({ 
      name: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      category:'',
      description: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      video:''
    });

    this.categoryService.getCategories('elearning').subscribe(res => {
      this.categories = res;
      this.uploadVideoForm.patchValue({category: this.data.category._id, name: this.data.name, description: this.data.description });
    });
  }

  get f(){
    return this.uploadVideoForm.controls;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onUploadVideo() {
    if(this.isEditVideo) {
      this.updateVideo();
    } else  {
      this.progress = 0;
      this.isFileUploading = true;
      console.log('uploadFormVideo', this.uploadVideoForm.value, this.uploadVideoForm.controls['video'].value.files[0]);
      this.eLearningService.uploadFile(this.uploadVideoForm.value);
    }
    // .then(res => {
    //   console.log('res', res);
    //   this.spinner.hide();
    //   this.snackBar.open("Video Updated Successfully", "OK", {
    //     duration: 2000,
    //   });
    //   this.uploadVideoForm.reset();
    // }, error => {
    //   this.error = error;
    //   this.spinner.hide();
    // });

  }

  cancelUpload() {
    this.eLearningService.cancelUpload();
    this.isFileUploading = false;
    this.onSubmitVideos.emit();
    this.dialogRef.close();
    this.snackBar.open("Video Upload Cancelled Successfully", "OK", {
      duration: 2000,
    });
    this.reset();
  }

  reset() {
    this.progress = 0;
    this.uploadVideoForm.reset();
    this.uploadVideoForm.controls['video'].setValue(null, { emitEvent: false });
    const fileInput = <HTMLInputElement>document.querySelector('ngx-mat-file-input[formcontrolname="video"] input[type="file"]');
    fileInput.value = null;
  }

  updateVideo() {
    const videoObj ={
        name: this.uploadVideoForm.get('name').value,  
        description: this.uploadVideoForm.get('description').value,
        category: this.uploadVideoForm.get('category').value
    };
    this.eLearningService.updateVideo(videoObj, this.data._id).subscribe(res => {
      console.log('res', res);
      this.snackBar.open("Video Updated Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
      this.onSubmitVideos.emit();
    })  
  }

}
