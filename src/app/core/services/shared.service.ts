import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userProfileSource = new BehaviorSubject<any>({});
  userProfile = this.userProfileSource.asObservable();

  private issuesSource = new BehaviorSubject<any>({});
  issues = this.issuesSource.asObservable();

  constructor() { }

  changeUserProfile(userProfile) {
    this.userProfileSource.next(userProfile);
  }

  changeIssues(issues) {
    console.log('issues in shared service', issues);
    this.issuesSource.next(issues);
  }

  // getIssues():Observable<any> {
  //   return this.issues;
  // }
}
