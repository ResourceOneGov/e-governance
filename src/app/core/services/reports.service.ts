import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FavoriteVideo, WatchedVideo, LikedVideo, CompletionTime, FavoriteVideoResp, WatchedVideoResp, LikedVideoResp, CompletionTimeResp, CompletedTaskResp, PendingTaskResp, InProgressTaskResp, TaskCompletionTimeResp, TotalPresentResp, TotalAbsentResp, IssueReports, ELearningSummary } from '../models/reports.model';

const baseUrl = environment.baseUrl;

const elearningUrl = baseUrl + '/elearningreports';
const taskUrl = baseUrl + '/taskreports';
const attendanceUrl = baseUrl + '/attendancereports';
const issueUrl = baseUrl + '/issuereports';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { 
  }

  getReports(type, reportObj, divisionId, roleId){
    if(type === 'issue') {
      reportObj.divisionId = divisionId.join(',');
    } else if(roleId) {
      reportObj.role = roleId;
    }
    return this.http.get<any>(`${baseUrl}/${type}reports`, {params: reportObj});
  }

  getFavoritesReports(reportObj, limit, offset){
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<FavoriteVideoResp>(`${elearningUrl}/favorites`, {params: reportObj});
  }

  getWatchedReports(reportObj, limit, offset){
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<WatchedVideoResp>(`${elearningUrl}/watchedvideos`, {params: reportObj});
  }

  getLikedReports(reportObj, limit, offset){
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<LikedVideoResp>(`${elearningUrl}/likedvideos`, {params: reportObj});
  }

  getCompletionReports(reportObj, limit, offset){
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<CompletionTimeResp>(`${elearningUrl}/completionTime`, {params: reportObj});
  }

  getCompletedTasksReports(reportObj, limit, offset) {
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<CompletedTaskResp>(`${taskUrl}/completed`, {params: reportObj});
  }

  getPendingTasksReports(reportObj, limit, offset) {
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<PendingTaskResp>(`${taskUrl}/pending`, {params: reportObj});
  }

  getInProgressTasksReports(reportObj, limit, offset) {
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<InProgressTaskResp>(`${taskUrl}/inprogress`, {params: reportObj});
  }

  getCompletionTimeTasksReports(reportObj, limit, offset) {
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<TaskCompletionTimeResp>(`${taskUrl}/completiontime`, {params: reportObj});
  }

  getTotalPresents(reportObj, limit, offset) {
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<TotalPresentResp>(`${attendanceUrl}/present`, {params: reportObj});
  }

  getTotalAbsents(reportObj, limit, offset) {
    reportObj.limit = limit;
    reportObj.offset = offset;
    return this.http.get<TotalAbsentResp>(`${attendanceUrl}/absent`, {params: reportObj});
  }

  getIssueEsclationReports(reportObj, limit, offset, escalationCode) {
    reportObj.limit = limit;
    reportObj.offset = offset;
    reportObj.level = escalationCode;
    return this.http.get<IssueReports>(`${issueUrl}/escalation`, {params: reportObj});
  }

  getVideoSummary(id) {
    return this.http.get<ELearningSummary>(`${elearningUrl}/${id}/summary`);
  }

}
