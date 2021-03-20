import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { ColorCode } from '../models/issue.model';
import { Observable } from 'rxjs';


const baseUrl = environment.baseUrl;
const issueUrl = baseUrl + '/issues';
const issueReportsUrl = baseUrl + '/issuereports';
const issueDistrictInfoUrl = baseUrl + '';
const volunteerInfoUrl = baseUrl + '';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private http: HttpClient) { }

  uploadIssues(file): Observable<HttpEvent<any>>  {
    console.log('obj', file);
    let formData:FormData = new FormData();
    formData.append('file', file, file.name);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let params = new HttpParams();
    const options = {
      params: params,
      reportProgress: true,
    };
    const req = new HttpRequest('POST', issueUrl, formData, options);
    return this.http.request(req);
    // return this.http.post<any>(issueUrl, obj);
  }

  getColorCodes() {
    return this.http.get<ColorCode[]>(`${issueReportsUrl}/colorcodes`);
  }

  getIssueReportsRelation() {
    return this.http.get<any>(`${issueReportsUrl}/relation`);
  }

  downLoadFile(data: any) {
    let blob = new Blob([data], { type: 'application/octet-stream'});
    let url = window.URL.createObjectURL(blob);
    const fileName = 'issueCode.csv';
    // saveAs(blob, fileName);
    window.open(url, fileName);
    // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
    //     alert( 'Please disable your Pop-up blocker and try again.');
    // }
}

getIssueDistrictInfo(){
  return this.http.get(issueDistrictInfoUrl)
}

getIssueDetails() {
  return this.http.get('/assets/doc/issue-district.json');
}

getVolunteerInfo(){
  return this.http.get(volunteerInfoUrl);
}

getVolunteerDetails(){
  return this.http.get('/assets/doc/leaderboard.json');
}

}
