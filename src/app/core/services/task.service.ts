import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Task, TaskRes, TaskList } from '../models/task.model';
import { Location } from '../models/location.model';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from 'moment';

const baseUrl = environment.baseUrl;

const getUserLocationsUrl = baseUrl + '/userLocations?divisionLevel=';
const tasksUrl = baseUrl + '/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  UploadProgressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  uploadProgress$: Observable<any> =  this.UploadProgressSubject.asObservable();

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
          Key:  `tasks/${moment().format('YYYYMMDDhhmmss')}.${file.name.split('.')[1]}`,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      console.log('bucket and params', bucket, params);
      return new Promise((resolve, reject) => {
        bucket.upload(params).on('httpUploadProgress',  (evt) => {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          this.UploadProgressSubject.next({loaded: evt.loaded, total: evt.total, message: `${evt.loaded} of ${evt.total} Bytes`});
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

  getLocationUrl(divisionLevel, subDivisionTo='') {
    if(subDivisionTo) {
      return this.http.get<Location>(`${getUserLocationsUrl}${divisionLevel}&subDivisionTo=${subDivisionTo}`);
    } else {
      return this.http.get<Location>(`${getUserLocationsUrl}${divisionLevel}`);
    }
  }

  createTask(taskObj) {
    return this.http.post(tasksUrl, taskObj);
  }

  updateTask(taskId, taskObj) {
    return this.http.put(`${tasksUrl}/${taskId}/status`, taskObj);
  }

  getTasks(userId) {
    return this.http.get<TaskRes>(`${tasksUrl}?assignedTo=${userId}`);
  }

  getTasksList(search, limit, offset) {
    const paramObj: any = {};
    search ? paramObj.search = search : '';
    limit ? paramObj.limit = limit : '';
    offset ? paramObj.offset = offset : '';
    // userType ? paramObj.userType = userType : '';
    return this.http.get<TaskList>(`${tasksUrl}`, {params : paramObj});
  }

  deleteTsk(task) {
    const ids = {ids: task._id};
    return this.http.delete(`${tasksUrl}`, {params: ids})
  }

  editTask(task) {
    return this.http.put(tasksUrl, task);
  }
}
