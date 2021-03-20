import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NewsService } from 'src/app/core/services/news.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputValidator } from 'src/app/core/utils/input.validator';

@Component({
  selector: 'app-upload-news-dialog',
  templateUrl: './upload-news-dialog.component.html',
  styleUrls: ['./upload-news-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadNewsDialogComponent implements OnInit {
  newsForm: FormGroup;
  showSpinner: boolean = false;
  subscription: Subscription;
  progress: number = 0;
  progressMessage: string;
  error: string;

  constructor(private fb: FormBuilder, private newsService: NewsService, private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService, private dialogRef: MatDialogRef<UploadNewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { 
    this.subscription = this.newsService.uploadCarouselProgress$.subscribe(message => { 
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
    this.newsForm = this.fb.group({ 
      title: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      description: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      images:'',
    });
  }

  get f(){
    return this.newsForm.controls;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async uploadFile() {
    this.progress = 0;
    this.spinner.show();
    if(this.newsForm.controls['images'].value) {
      console.log('uploadFormVideo', this.newsForm.value, this.newsForm.controls['images'].value.files[0]);
      this.newsService.uploadCarouselFile(this.newsForm.controls['images'].value.files[0]).then(res => {
        console.log('res', res);
        this.uploadNews(res);
      }, error => {
        this.error = error;
        this.progress = 0;
        this.spinner.hide();
      });
    } else {
      this.uploadNews({});
    } 
  }

  uploadNews(res) {
    const newsObj = {
      isImage: false,
      title: this.newsForm.controls['title'].value,
      content: this.newsForm.controls['description'].value,
      images: res && res.Location ? [ res.Location ] : []
    }
    this.newsService.postNews(newsObj).subscribe(res => {
      console.log('res', res);
      this.spinner.hide();
      this.newsForm.reset();
      this.dialogRef.close();
      this.progress = 0; 
      this.snackBar.open("News Created Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
    }, err => {
      this.progress = 0;
      this.error = err.error.message;
      this.spinner.hide();
    });
  
  }

}
