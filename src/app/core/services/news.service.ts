import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { News, NewsResponse } from '../models/news.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from 'moment';

const baseUrl = environment.baseUrl;

// const getUserLocationsUrl = baseUrl + '/userLocations?divisionLevel=';
const newsUrl = baseUrl + '/latestNews';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  UploadNewsProgressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  uploadNewsProgress$: Observable<any> =  this.UploadNewsProgressSubject.asObservable();

  UploadCarouselProgressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  uploadCarouselProgress$: Observable<any> =  this.UploadCarouselProgressSubject.asObservable();

  constructor(private http: HttpClient) { 

  }

  uploadFile(fileInfo) {
    const file = fileInfo;
    const contentType = file.type;
    const bucket = new S3(
          {
              accessKeyId: 'AKIAXLKSSXESOCSMSNPR',
              secretAccessKey: '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',
              region: 'ap-south-1'
          }
      );
      const params = {
          Bucket: 'foa-assets',
          Key:  `news/${moment().format('YYYYMMDDhhmmss')}.${file.name.split('.')[1]}`,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      console.log('bucket and params', bucket, params);
      return new Promise((resolve, reject) => {
        bucket.upload(params).on('httpUploadProgress',  (evt) => {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          this.UploadNewsProgressSubject.next({loaded: evt.loaded, total: evt.total, message: `${evt.loaded} of ${evt.total} Bytes`});
        }).send(function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                reject(err);
            }
            console.log('Successfully uploaded file.', data);
            resolve(data);
        });
    })
  }

  uploadCarouselFile(fileInfo) {
    const file = fileInfo;
    const contentType = file.type;
    const bucket = new S3(
          {
              accessKeyId: 'AKIAXLKSSXESOCSMSNPR',
              secretAccessKey: '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',
              region: 'ap-south-1'
          }
      );
      const params = {
          Bucket: 'foa-assets',
          Key:  `carousels/${moment().format('YYYYMMDDhhmmss')}.${file.name.split('.')[1]}`,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      console.log('bucket and params', bucket, params);
      return new Promise((resolve, reject) => {
        bucket.upload(params).on('httpUploadProgress',  (evt) => {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          this.UploadCarouselProgressSubject.next({loaded: evt.loaded, total: evt.total, message: `${evt.loaded} of ${evt.total} Bytes`});
        }).send(function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                reject(err);
            }
            console.log('Successfully uploaded file.', data);
            resolve(data);
        });
    })
  }

  gettNews(type) {
    return this.http.get<NewsResponse[]>(`${newsUrl}/${type}`);
  }

  postNews(newsObj: News) {
    return this.http.post(newsUrl, newsObj);
  }

  putNews(newsObj: News, id) {
    return this.http.put<NewsResponse>(`${newsUrl}/images/${id}`, newsObj);
  }

  deleteNews(news: NewsResponse) {
    return this.http.delete(`${newsUrl}/articles/${news._id}`);
  }
}
