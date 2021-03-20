import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Videos } from '../models/elearning.model';

const baseUrl = environment.baseUrl;
const videoUrl = baseUrl + '/videos';


@Injectable({
  providedIn: 'root'
})
export class ELearningService {

  UploadVideoProgressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  uploadVideoProgress$: Observable<any> =  this.UploadVideoProgressSubject.asObservable();
  cancelUploadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isCancelUpload: Observable<boolean> = this.cancelUploadSubject.asObservable();
  bucket: S3;
  bucketInfo: any;
  key: string;
  uploadId: string;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  uploadFile(fileInfo) {
    this.uploadId = '';
    const file = fileInfo.video.files[0];
    const contentType = file.type;
    this.key = `${moment().format('YYYYMMDDhhmmss')}.mp4`;
    this.bucket = new S3(
          {
              accessKeyId: 'AKIAXLKSSXESOCSMSNPR',
              secretAccessKey: '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',
              region: 'ap-south-1'
          }
      );
      this.bucket.createMultipartUpload({ Bucket: 'foa-vod-input', Key : this.key, Metadata: {
          name: fileInfo.name,
          description: fileInfo.description,
          category: fileInfo.category,
          duration: "N/A"
        }},(err,data) => {
        console.log('create MultiAPrt Upload', data);
        this.uploadId = data.UploadId;
        
      const params = {
          Bucket: 'foa-vod-input',
          Key:  this.key,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType,
          Metadata: {
            name: fileInfo.name,
            description: fileInfo.description,
            category: fileInfo.category,
            duration: "N/A"
          },
          UploadId: this.uploadId,
        };
      // this.bucket.abortMultipartUpload({ Bucket: 'vod-input-files', Key : this.key, UploadId : this.uploadId});
        console.log('params before upload', params);
        this.bucket.upload(params, (err, data)=> { 
            console.log('data in callback params', err, data);
          }).on('httpUploadProgress',  (evt) => {
            console.log('evt in upload progress', evt);
            console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
            this.UploadVideoProgressSubject.next({loaded: evt.loaded, total: evt.total, message: `${evt.loaded} of ${evt.total} Bytes`});
          }).send(function (err, data) {
              if (err) {
                  console.log('There was an error uploading your file: ', err);
              }
              console.log('Successfully uploaded file.', data);
          });
      });

  }

  cancelUpload() {
    console.log('abort method', this.uploadId);
    this.bucket.abortMultipartUpload({ Bucket: 'foa-vod-input', Key : this.key, UploadId : this.uploadId}, 
        (err, data) => {
          console.log('data in delete', err, data);
        });
    // this.cancelUploadSubject.next(true);
  }

  getVideos(category, search, limit ?: number, offset?: number) {
    const paramObj: any = {};
    category ? paramObj.category = category : '';
    search ? paramObj.search = search : '';
    limit ? paramObj.limit = limit : '';
    offset ? paramObj.offset = offset : '';
    return this.http.get<Videos>(videoUrl, {params : paramObj});
  }

  onCreateQuestionnaries(vid, obj) {
    return this.http.put<any>(`${videoUrl}/${vid}/questionnaire`, obj);
  }

  deleteVideo(video) {
    const ids = {ids: video._id};
    return this.http.delete(`${videoUrl}`, {params:ids});
  }

  updateVideo(videoObj, id) {
    return this.http.put(`${videoUrl}/${id}`, videoObj);
  }
}
