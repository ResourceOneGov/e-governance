import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { ReportsService } from 'src/app/core/services/reports.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-volunteer-training',
  templateUrl: './volunteer-training.component.html',
  styleUrls: ['./volunteer-training.component.scss']
})
export class VolunteerTrainingComponent implements OnInit {
  volunteer: FormGroup;
  filteredVideos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  videos: any[] = [];
  totalVideosSummary: any;
  totalUsersAssigned: number = 0;
  totalAssessmentSummary: any;
  totalAssessment: number = 0;
  @Output() sendVideo: EventEmitter<any> = new EventEmitter();

  protected _onDestroy = new Subject<void>();


  constructor(private eLearningService: ELearningService, private reportService: ReportsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.volunteer = this.fb.group({ 
      video: '',
      videoFilter: ''
    })
    this.getVideos();
    this.volunteer.get('videoFilter').valueChanges
    .pipe(debounceTime(300)).subscribe(()=> {
      this.getVideos();
    })
  }
I
  getVideos() {
    this.eLearningService.getVideos('', this.volunteer.get('videoFilter').value)
    .subscribe(res => {
      console.log('res in get Videos', res.videos);
      this.videos = JSON.parse(JSON.stringify(res.videos));
      this.filteredVideos.next(res.videos);
    });
  }

  get f(){
    return this.volunteer.controls;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getVideosCharts(e) {
    console.log('event', e);
    this.sendVideo.emit(e.value);
    this.reportService.getVideoSummary(e.value).subscribe(res => {
      console.log('res in getVideoCharts', res);
      const data = [ ['Total Watched' , res.totalWatched], ['Total Pending', res.totalPending]];
      this.totalUsersAssigned = res.totalPending + res.totalWatched;
      this.totalVideosSummary = this.createChartOptions(data);
      console.log('totalVideosSummary', this.totalVideosSummary);
      // this.totalAssessmentSummary = this.createChartOptions(res.assessment);
      // console.log('totalAssessmentSummary', this.totalAssessmentSummary);
      let assesmentData = {'85+': 0  ,'70-85': 0 ,'50-70': 0 ,'35-50': 0 ,'<35': 0};
      res.assessment.forEach((a) => {
        if(a.boundary > 85) {
          assesmentData['85+'] = assesmentData['85+'] ? assesmentData['85+']+=1 : 1;
        } else if(a.boundary >70 && a.boundary <= 85) {
          console.log('assesmentData["70-85"]', assesmentData['70-85']);
          assesmentData['70-85'] = assesmentData['70-85']  ? assesmentData['70-85'] += 1 : 1;
        } else if(a.boundary >50 && a.boundary <= 70) {
          assesmentData['50-70'] = assesmentData['50-70'] ? assesmentData['50-70'] += 1 : 1;
        } else if(a.boundary > 35 && a.boundary <= 50) {
          assesmentData['35-50'] = assesmentData['35-50'] ? assesmentData['35-50'] += 1 : 1;
        } else {
          assesmentData['<35'] = assesmentData['<35'] ? assesmentData['<35'] += 1 : 1;
        }
      })
      console.log('assessmentData', assesmentData);
      const dataForAssessment = [ ['85+' , assesmentData['85+']], ['70-85', assesmentData['70-85']], 
      ['50-70', assesmentData['50-70']], ['35-50', assesmentData['35-50']], ['<35', assesmentData['<35']]];
      this.totalAssessmentSummary = this.createChartOptions(dataForAssessment);
      this.totalAssessment = res.assessment.reduce((a, c) => a + c.count, 0);
    })
  }

  createChartOptions(data) {
    const chartOptions = {   
        chart : {
          plotBorderWidth: null,
          plotShadow: false
        },
        tooltip : {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> <br>total: {point.y}'
        },
        title: {
          text: null
        },
        credits:{
          enabled: false
        },
        plotOptions : {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false           
              },      
              showInLegend: true
          }
        },
        series : [{
          type: 'pie',
          data
        }]
    };
    return chartOptions;
  }

}
