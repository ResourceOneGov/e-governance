import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Broadcast } from '../models/broadcast.model';

const baseUrl = environment.baseUrl;
const broadcastUrl = baseUrl + '/scheduledLiveBroadcasts';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private _listners = new Subject<any>();

  constructor(private http: HttpClient) { }

  scheduleBroadCast(scheduleObj) {
    return this.http.post<any>(`${broadcastUrl}`, scheduleObj);
  }

  getBroadCast() {
    return this.http.get<Broadcast>(`${broadcastUrl}`);
  }

  deleteBroadcast(channelId) {
    return this.http.delete(`${broadcastUrl}/${channelId}`);
  }

  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  broadCastTrigger(message: string) {
    this._listners.next(message);
  }

}
