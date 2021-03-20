import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { NewsService } from 'src/app/core/services/news.service';
import { Subscription } from 'rxjs';
import { NewsResponse } from 'src/app/core/models/news.model';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { UploadNewsDialogComponent } from './upload-news-dialog/upload-news-dialog.component';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-upload-news',
  templateUrl: './upload-news.component.html',
  styleUrls: ['./upload-news.component.scss']
})
export class UploadNewsComponent implements OnInit {
  newsForm: FormGroup;
  showSpinner: boolean = false;
  subscription: Subscription;
  progress: number = 0;
  progressMessage: string;
  error: string;
  latestNews: NewsResponse[];
  @ViewChild(MatAccordion) accordion: MatAccordion;


  constructor(private fb: FormBuilder, private newsService: NewsService, private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService, private dialog: MatDialog) {
     }

  ngOnInit(): void {
    this.getNews();
  }

  openDialog() {
    const dialogRef = this.dialog.open(UploadNewsDialogComponent, {
      width:'75%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getNews();
    });
  }

  getNews() {
    this.newsService.gettNews('articles').subscribe(res => {
      this.latestNews = res;
    })
  }

  deleteNews(event, news) {
    event.stopPropagation();
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
        this.newsService.deleteNews(news).subscribe(res => {
          this.snackBar.open("News Deleted Successfully", "OK", {
            duration: 2000,
            verticalPosition: 'top'
          });
          this.getNews();
        }, err => {
          this.error = err;
        });
      }
    })
  }

}
