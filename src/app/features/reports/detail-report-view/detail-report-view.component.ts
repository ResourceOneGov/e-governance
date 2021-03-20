import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from 'src/app/core/services/reports.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { startWith, tap } from 'rxjs/operators';
import { Reports } from 'src/app/core/models/reports.model';

@Component({
  selector: 'app-detail-report-view',
  templateUrl: './detail-report-view.component.html',
  styleUrls: ['./detail-report-view.component.scss']
})
export class DetailReportViewComponent implements OnInit {

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  title: string;
  @Input() reportObj: any;
  @Input() type: string;
  @Input() consolidatedReports: Reports;
  limit: number = 5;
  offset: number = 0;
  reportsLength: number;
  constructor(public route: ActivatedRoute, public router: Router, private reportService:ReportsService, 
    private location: Location){
    
  }
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;

  ngOnInit() {
    console.log('reportObj', this.reportObj, this.type);
    // this.getReportDetails();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(startWith(null), tap(() => {
      console.log('paginator', this.paginator.pageIndex, this.paginator.pageSize, this.paginator.page)
      this.offset = this.paginator.pageIndex;
      this.limit = this.paginator.pageSize;
      this.getReportDetails();
    })).subscribe();
  }

  pageEvents(e) {
    console.log('e', e);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.limit = 5;
    this.offset = 0;
    this.getReportDetails();
    console.log('detailReportType', this.type);
    // if(changes && changes.type && changes.type.currentValue) {
    //   this.limit = 5;
    //   this.offset = 0;
    //   this.getReportDetails();
    // }
    // if(changes && changes.reportObj && changes.reportObj.currentValue) {
    //   this.limit = 5;
    //   this.offset = 0;
    //   this.getReportDetails();
    // }
  }
  getReportDetails() {
    if(this.type === 'totalVideosFavorite') {
      this.displayedColumns = ['No', 'title', 'FavoriteBy', 'FavoriteOn'];
      this.reportService.getFavoritesReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalVideosLiked') {
      this.displayedColumns = ['No', 'title', 'LikedBy', 'LikedOn'];
      this.reportService.getLikedReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalVideosViewed') {
      this.displayedColumns = ['No', 'title', 'ViewedBy', 'ViewedOn'];
      this.reportService.getWatchedReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalCompletionTime') {
      this.displayedColumns = ['No', 'title', 'WatchedBy', 'UploadedOn', 'CompletedOn', 'TimeTaken'];
      this.reportService.getCompletionReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'completed') {
      this.displayedColumns = ['No', 'name', 'completedBy', 'CompletedOn'];
      this.reportService.getCompletedTasksReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'pending') {
      this.displayedColumns = ['No', 'name', 'assignedTo', 'pendingSince'];
      this.reportService.getPendingTasksReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'inprogress') {
      this.displayedColumns = ['No', 'name', 'taskTakenBy', 'startedTime'];
      this.reportService.getInProgressTasksReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'completiontime') {
      this.displayedColumns = ['No', 'name', 'startDate', 'endDate', 'TimeTaken'];
      this.reportService.getCompletionTimeTasksReports(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalPresent') {
      this.displayedColumns = ['No', 'date', 'userName'];
      this.reportService.getTotalPresents(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalAbsent') {
      this.displayedColumns = ['No', 'date', 'userName'];
      this.reportService.getTotalAbsents(this.reportObj, this.limit, this.offset).subscribe(res => {
        this.dataSource = new MatTableDataSource(res.reports);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalPS') {
      this.displayedColumns = ['No', 'issueSource', 'issueRelatedTo', 'raisedOnDate', 'issueCategory', 'issueType'];
      this.reportService.getIssueEsclationReports(this.reportObj, this.limit, this.offset, 'es01').subscribe(res => {
        this.dataSource = new MatTableDataSource(res.issuesByEscalationLevel);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalMPDO') {
      this.displayedColumns = ['No', 'issueSource', 'issueRelatedTo', 'raisedOnDate', 'issueCategory', 'issueType'];
      this.reportService.getIssueEsclationReports(this.reportObj, this.limit, this.offset, 'es03').subscribe(res => {
        this.dataSource = new MatTableDataSource(res.issuesByEscalationLevel);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    } else if(this.type === 'totalJC') {
      this.displayedColumns = ['No', 'issueSource', 'issueRelatedTo', 'raisedOnDate', 'issueCategory', 'issueType'];      
      this.reportService.getIssueEsclationReports(this.reportObj, this.limit, this.offset, 'es02').subscribe(res => {
        this.dataSource = new MatTableDataSource(res.issuesByEscalationLevel);
        this.reportsLength = res.count;
        setTimeout(()=> {
          this.dataSource.paginator = this.paginator;
        },100);
      });
    }
  }
  millisecondsToMinutesSeconds(ms) {
    return moment.utc(ms).format('HH:mm:ss');
  }

  convertDate(date) {
    return moment(date).format('ll');
  }

  onPaginateChange(e) {
    console.log('event', e);
    this.limit = e.pageSize;
    this.offset = e.pageIndex * e.pageSize;
    this.getReportDetails();
  }

}
