import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Notification } from '../../core/models/notifications.model';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  notificationsCount: number;
  offset: number = 0;
  limit: number = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Notification> = new MatTableDataSource<Notification>([]);

  constructor(private notificationService: NotificationsService) { }

  ngOnInit(): void {
    this.getNotificationDetails();
  }

  convertDate(date) {
    return moment(date).local().format('ll');
  }
  pageEvents(e) {
    console.log('e', e);
  }

  onPaginateChange(e){
    console.log('event', e);
    this.limit = e.pageSize;
    this.offset = e.pageIndex * e.pageSize;
    this.getNotificationDetails();
  }
  getNotificationDetails() {
    this.notificationService.getNotifications(this.offset, this.limit).subscribe(res => {
      this.notifications = res.notifications;
      this.notificationsCount = res.count;
      this.dataSource = new MatTableDataSource(this.notifications);
      // this.notificationsCount = this.notifications.length;
    })
  }

}
