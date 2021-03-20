import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from 'moment';

const baseUrl = environment.baseUrl;
const attendanceUrl = baseUrl + '/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  UploadAttendanceProgressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  uploadAttendanceProgress$: Observable<any> =  this.UploadAttendanceProgressSubject.asObservable();
  
  constructor(private http: HttpClient) { }

  uploadAttendance(attendanceObj) {
    return this.http.post<any>(`${attendanceUrl}`, attendanceObj);
  }

  uploadAttendanceFile(fileInfo) {
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
          Key:  `attendance/${moment().format('YYYYMMDDhhmmss')}.${file.name.split('.')[1]}`,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      console.log('bucket and params', bucket, params);
      return new Promise((resolve, reject) => {
        bucket.upload(params).on('httpUploadProgress',  (evt) => {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          this.UploadAttendanceProgressSubject.next({loaded: evt.loaded, total: evt.total, message: `${evt.loaded} of ${evt.total} Bytes`});
        }).send(function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                reject(err);
            }
            console.log('Successfully uploaded file.', data);
            resolve(params.Key);
        });
    })
  }
}
