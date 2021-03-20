import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login.model';
import { map } from 'rxjs/operators';
import { User, Roles, UserResp, UserReports } from '../models/user.model';
import * as moment from 'moment';
import * as S3 from 'aws-sdk/clients/s3';

const baseUrl = environment.baseUrl;

const createUserUrl = baseUrl + '/users';
const createUserBulkUrl = baseUrl + '/users/bulk';
const userMeUrl = baseUrl + '/users/me';
const usersUrl = baseUrl + '/users';
const broadcastUrl = baseUrl + '/scheduledLiveBroadcasts';
const rolesUrl = baseUrl + '/roles';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  UploadProfilePictureProgressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  uploadProfilePictureProgress$: Observable<any> =  this.UploadProfilePictureProgressSubject.asObservable();

  UploadBulkUsersProgressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  uploadBulkUsersProgress$: Observable<any> =  this.UploadBulkUsersProgressSubject.asObservable();

  constructor(private http: HttpClient) { 
      
  }
  
  onCreateUser(user) {
      return this.http.post<any>(`${createUserUrl}`, user);
  }

  onCreateUsersBulk(user) {
    return this.http.post<any>(`${createUserBulkUrl}`, user);
  }

  getCurrentUserDetails(){
      return this.http.get<any>(userMeUrl).pipe(map(userProfile => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        return userProfile;
    }));
  }

  updateProfileImage(profileImage: string) {
    return this.http.put(userMeUrl, {profileImage: profileImage})
  }

  getUsers(search?: string, divisionId?: string, role?:string, limit?: number, offset?: number, userType?: string, all?: boolean) {
    const paramObj: any = {};
    divisionId ? paramObj.divisionId = divisionId: '',
    role ? paramObj.role = role : '';
    search ? paramObj.search = search : '';
    limit ? paramObj.limit = limit : '';
    offset ? paramObj.offset = offset : '';
    userType ? paramObj.userType = userType : '';
    all ? paramObj.all = true : '';
    return this.http.get<UserResp>(`${usersUrl}`, {params : paramObj}); 
  }

  scheduleBroadCast(scheduleObj) {
      return this.http.post<any>(`${broadcastUrl}`, scheduleObj);
  }

  getRoles(hasAccess?: boolean) {
    if(hasAccess === true) {
      return this.http.get<Roles[]>(`${rolesUrl}`, {params: { hasAccess : "true"}});
    } else {
      return this.http.get<Roles[]>(rolesUrl);
    }
  }

  updateUserStatus(user, status) {
    return this.http.put<any>(`${usersUrl}/${user._id}`, {active: status});
  }

  uploadProfilePictureFile(fileInfo) {
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
          Key:  `ProfileImages/${moment().format('YYYYMMDDhhmmss')}.${file.name.split('.')[1]}`,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      console.log('bucket and params', bucket, params);
      return new Promise((resolve, reject) => {
        bucket.upload(params).on('httpUploadProgress',  (evt) => {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          this.UploadProfilePictureProgressSubject.next({loaded: evt.loaded, total: evt.total, message: `${evt.loaded} of ${evt.total} Bytes`});
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

  uploadBulkUsersKey(bulkUsersObj) {
    return this.http.post<any>(`${usersUrl}/fileupload`, bulkUsersObj);
  }

  uploadBulkUsersFile(fileInfo) {
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
          Key:  `users/${moment().format('YYYYMMDDhhmmss')}.${file.name.split('.')[1]}`,
          Body: file,
          ACL: 'public-read',
          ContentType: contentType
      };
      console.log('bucket and params', bucket, params);
      return new Promise((resolve, reject) => {
        bucket.upload(params).on('httpUploadProgress',  (evt) => {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          this.UploadBulkUsersProgressSubject.next({loaded: evt.loaded, total: evt.total, message: `${evt.loaded} of ${evt.total} Bytes`});
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

  getUsersReports(videoId) {
    return this.http.get<UserReports>(`${usersUrl}/reports`, {params: {videoId}});
  }
}