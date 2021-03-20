import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { NewsService } from 'src/app/core/services/news.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-carousel',
  templateUrl: './upload-carousel.component.html',
  styleUrls: ['./upload-carousel.component.scss']
})
export class UploadCarouselComponent implements OnInit {
  carouselForm: FormGroup;
  urls = [];
  carousels: any;
  imageDisplayBox: boolean =true;
  carouselSubscription: Subscription;
  progress: number = 0;
  progressMessage: string;
  error: string;
  method: string;

  constructor(private fb: FormBuilder, private newsService: NewsService, private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) { 
      this.carouselSubscription = this.newsService.uploadCarouselProgress$.subscribe(message => { 
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
    this.carouselForm = this.fb.group({ 
      file:''
    });
    this.getCarousel();
  }

  getCarousel() {
    this.newsService.gettNews('images').subscribe(res => {
      this.carousels = res;
      if(this.carousels && this.carousels.images) {
        this.urls = [...this.carousels.images];
      } else {
        this.urls = [null, null, null, null, null];
      }
      if(this.carousels && this.carousels._id) {
        this.method = 'put';
      } else {
        this.method = 'create';
      }
    })
  }

  ngOnDestroy() {
    this.carouselSubscription.unsubscribe();
  }

  onSelectFile(event, n) {
    this.progress = 0;
    if (event.target.files && event.target.files[0]) {
      this.newsService.uploadCarouselFile(event.target.files[0]).then((res: any) => {
        console.log('res', res);
        this.urls[n] = res.Location;
        this.progress = 0;
      }, error => {
        this.error = error;
        this.progress = 0;
      });
    }
  }
  
  delete(n){
    if(this.carousels && this.carousels.images) {
      if(this.urls[n] === this.carousels.images[n]) {
        console.log('same');
        this.urls[n] = null;
      } else {
        this.urls[n] = this.carousels.images[n] ? this.carousels.images[n] : null;
      }
    } else {
      this.urls[n] = null;
    }  
  }

  disableCarouselBtn() {
    let checkCarousel = this.urls.filter((url) => { return url !== null });
    if(checkCarousel.length > 0){
      if(this.carousels && this.carousels.images.length > 0) {
        let isSame = (this.urls.length === this.carousels.images.length) && this.urls.every((element, index) => {
          return element === this.carousels.images[index]; 
        });
        // let notNull = this.urls.every(urlC => urlC !== null);
        // return isSame || !notNull;
        return isSame;
      }  
    } else {
      if(this.carousels && this.carousels.images) {
        const disabled = this.carousels.images.length === 0 ?  true :  false;
        return disabled;
      } else {
        return true;
      }
    } 
  }

  uploadCarousels() {
    // const newOrUpdatedCarousel = this.urls.filter(url => { return this.carousels.images.indexOf(url) === -1 });
    // console.log('newOrUpdatedCarousel', newOrUpdatedCarousel);
    const carousalObj = {
      isImage: true,
      images: this.urls.filter((url) => { return url !== null})
    }
    if(this.method === 'create') {
      this.newsService.postNews(carousalObj).subscribe(res => {
        this.snackBar.open("Caruosel Images Uploaded Successfully", "OK", {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.getCarousel();
      });
    } else if(this.method === 'put') {
      this.newsService.putNews(carousalObj, this.carousels._id).subscribe(res => {
        this.snackBar.open("Caruosel Images Uploaded Successfully", "OK", {
          duration: 2000,
          verticalPosition: 'top'
        });
        this.getCarousel();
      });    
    }
  }

}
