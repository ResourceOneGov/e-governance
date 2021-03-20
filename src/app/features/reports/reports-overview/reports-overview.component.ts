import { Component, OnInit, Input, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Reports } from 'src/app/core/models/reports.model';
import { count } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports-overview',
  templateUrl: './reports-overview.component.html',
  styleUrls: ['./reports-overview.component.scss']
})
export class ReportsOverviewComponent implements OnInit {
  @Input() consolidatedReports: Reports;
  @Input() reportType: string;
  totalVideos: number = 0;
  totalVideosViewed: number = 0;
  totalVideosLiked: number = 0;
  totalVideosFavorite: number = 0;
  totalTasks: number = 0;
  totalCompleted: number = 0;
  totalPending: number = 0;
  totalInProgress: number = 0;
  totalUsers: number = 0;
  totalPresent: number = 0;
  totalAbsent: number = 0;
  totalHolidays: number = 0;
  showDetail: boolean = false;
  @Input() reportObj;
  @Output() showDetailReport = new EventEmitter<boolean>();
  @Output() detailReportType = new EventEmitter<string>();
  type: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getCountDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes.consolidatedReports && changes.consolidatedReports.currentValue) {
      this.getCountDetails();
      console.log('init on report overview', this.reportType, this.consolidatedReports);
    }
  }

  getCountDetails() {
    if(this.reportType === 'elearning') {
      this.totalVideosFavorite = 0;
      this.totalVideosLiked = 0;
      this.totalVideosViewed = 0;
      if(this.consolidatedReports) {
        for(const fav of this.consolidatedReports.totalFavorites) {
          this.totalVideosFavorite += fav.count;
        }
        for(const like of this.consolidatedReports.totalLiked) {
          this.totalVideosLiked += like.count;
        }
        for(const watch of this.consolidatedReports.totalWatched) {
          this.totalVideosViewed += watch.count;
        }
      }
    } else if(this.reportType === 'task') {
      this.totalInProgress = 0;
      this.totalPending = 0;
      this.totalCompleted = 0;
      if(this.consolidatedReports) {
        for(const progress of this.consolidatedReports.totalInProgress) {
          this.totalInProgress += progress.count;
        }
        for(const pending of this.consolidatedReports.totalPending) {
          this.totalPending += pending.count;
        }
        for(const comp of this.consolidatedReports.totalCompleted) {
          this.totalCompleted += comp.count;
        }
      }
    } else if(this.reportType === 'attendance') {
      this.totalPresent = 0;
      this.totalAbsent = 0;
      this.totalHolidays = 0;
      if(this.consolidatedReports) {
        for(const presnt of this.consolidatedReports.totalPresent) {
          this.totalPresent += presnt.count;
        }
        for(const absent of this.consolidatedReports.totalAbsent) {
          this.totalAbsent += absent.count;
        }
        for(const holiday of this.consolidatedReports.totalHolidays) {
          this.totalHolidays += holiday.count;
        }
      }
    }
    
  }

  downloadReport() {

  }

  shareReport() {

  }

  showDetailView(type) {
    this.showDetail = true;
    this.type = type;
    this.showDetailReport.emit(true);
    this.detailReportType.emit(type);
  }
}
