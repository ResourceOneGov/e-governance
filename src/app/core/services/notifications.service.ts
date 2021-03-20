import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationsResp } from '../models/notifications.model';

const baseUrl = environment.baseUrl;

const notificationsUrl = baseUrl + '/notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  getNotifications(offset, limit){
    const obj = {offset, limit}
    return this.http.get<NotificationsResp>(`${notificationsUrl}`, {params: obj});
  }
}
