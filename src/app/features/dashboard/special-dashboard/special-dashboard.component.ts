import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { IssueTrackerDetailsDialogComponent } from './issue-tracker-details-dialog/issue-tracker-details-dialog.component';
import { VolunteerFilterDialogComponent } from './volunteer-filter-dialog/volunteer-filter-dialog.component';


export interface IssueDashboard {
  green: number;
  stakeholders: string;
  blue: number;
  orange: number;
  yellow: number;
  red: number;
  black:number;
  total:number;
}

export interface LeaderBoard {
  rank: number;
  district: string;
  mandal: string;
  volunteerName: string;
  total:number;
}

const ELEMENT_DATA: IssueDashboard[] = [
  {stakeholders: 'CMO', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
  {stakeholders: 'GSWS Department', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
  {stakeholders: 'JC', green: 1432, blue: 0, orange: 720, yellow:0, red:2432, black:192, total:4776},
  {stakeholders: 'MPDO/MC', green: 1921, blue: 0, orange: 240, yellow:0, red:2971, black:98, total:5230},
  {stakeholders: 'VS/WS', green: 678, blue: 0, orange: 737, yellow:0, red:1734, black:125, total:3274},
  {stakeholders: 'Total', green: 4031, blue: 0, orange: 1697, yellow:0, red:7137, black:415, total:13280}
];

const Leader : LeaderBoard[] = [
  {rank: 1, district: 'East Godavari', mandal: 'Rayavaram', volunteerName: 'Pilli Suseela Rani', total:90.88},
  {rank: 2, district: 'East Godavari', mandal: 'Gokavaram', volunteerName: 'Gunipalli Chandrasekhar', total:89.41},
  {rank: 3, district: 'East Godavari', mandal: 'Rayavaram', volunteerName: 'Velagala Sathireddy', total:89.17},
  {rank: 4, district: 'East Godavari', mandal: 'Rajahmundry(Rural)', volunteerName: 'Pinnamareddy Naga Venkata Chakradhar', total:89.07},
  {rank: 5, district: 'Vizianagaram', mandal: 'Makkuva', volunteerName: 'Bagavathala Kranthi Kumar', total:88.84},
  {rank: 6, district: 'Nellore', mandal: 'Gudur', volunteerName: 'Cheeli Sandhya Latha', total:88.56},
  {rank: 7, district: 'East Godavari', mandal: 'Kakinada(Urban)', volunteerName: 'Boddu Malleswara Rao', total:88.56},
  {rank: 8, district: 'Krishna', mandal: 'Pedana(Urban)', volunteerName: 'Mahammad Liyakhatullah', total:87.08},
  {rank: 9, district: 'Guntur', mandal: 'Tadikonda', volunteerName: 'Kuraganti Monika', total:87.26},
  {rank: 10, district: 'East Godavari', mandal: 'Samalkota(Urban)', volunteerName: 'Burra Devi', total:86.13}
];
@Component({
  selector: 'app-special-dashboard',
  templateUrl: './special-dashboard.component.html',
  styleUrls: ['./special-dashboard.component.scss']
})
export class SpecialDashboardComponent implements OnInit {
  displayedColumns: string[] = ['stakeholders', 'green', 'blue', 'orange', 'yellow', 'red', 'black', 'total'];
  columnsToDisplay: string[] = ['rank', 'district', 'mandal', 'volunteerName', 'total'];
  dataSource: MatTableDataSource<any>;
  leader:MatTableDataSource<any>;
  selectedReport= 'January 2021_FOA.pdf';
  panelOpenState = false;
   downloadURL: string = 'assets/doc/January 2021_FOA.pdf';
  user: any;
  constructor(private dialog: MatDialog, private router:Router) {
    this.user = JSON.parse(localStorage.getItem('userProfile'))
  }
  ngOnInit(): void {
    const idx = ELEMENT_DATA.findIndex(i => i.stakeholders.toLocaleLowerCase() === this.user.role.roleName.toLocaleLowerCase())
    console.log('role name', idx);
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.leader = new MatTableDataSource(Leader);
  }


  skillcharts = Highcharts;
   chartOptions = {
      chart : {
         plotBorderWidth: null,
         plotShadow: false
      },
      title : {
         text: 'Loyalty'
      },
      tooltip : {
         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions : {
         pie: {
            shadow: false,
            center: ['50%', '50%'],
            size:'45%',
            innerSize: '70%'
         }
      },
      series : [{
         type: 'pie',
         name: 'Browser share',
         data: [
            ['<50',     30],
            ['50-70',     25],
            ['70-90',    25],
            ['> 90',   10]
         ]
      }]
   };
   attitudecharts = Highcharts;
   attitudeChartOptions = {
      chart : {
         plotBorderWidth: null,
         plotShadow: false
      },
      title : {
         text: 'Aptitude'
      },
      tooltip : {
         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions : {
         pie: {
            shadow: false,
            center: ['50%', '50%'],
            size:'45%',
            innerSize: '70%'
         }
      },
      series : [{
         type: 'pie',
         name: 'Browser share',
         data: [
            ['<50',     34],
            ['50-70',    40],
            ['70-90',    15],
            ['> 90',    6]
         ]
      }]
   };

   overallcharts = Highcharts;
   overallChartOptions = {
      chart: {
         type: 'bar',
         inverted: true
      },
      title: {
         text: 'Overall Volunteer Index'
      },
      legend : {
         layout: 'vertical',
         align: 'left',
         verticalAlign: 'top',
         x: 10,
         y: 10,
         floating: true,
         borderWidth: 1,
         },
         xAxis:{
            categories: ['Overall'],
      },
      yAxis : {
         min: 10,
         max:110,
         tickInterval: 10,
      },
      tooltip : {
         valueSuffix: ' hundered'
      },
      plotOptions : {
         bar: {
            dataLabels: {
               enabled: true
            }
         },
         series: {
            stacking: 'normal'
         }
      },
      credits:{
         enabled: false
      },
      series: [
         {
            name: '<50',
            data: [30]  ,
            color:'#A9FF96',
            pointWidth: 20,
         },
         {
            name: '50 - 70',
            data: [20]  ,
            color:'#4373C6',
            pointWidth: 20,
         },
         {
            name: '70 - 90',
            data: [20],
            color:'#ED802B',
            pointWidth: 20,
         },
         {
            name: '>90',
            data: [30],
            color:'#A9A9A9',
            pointWidth: 20,
         },

      ]

   }

  getIssueTracker(data){
    const dialogRef = this.dialog.open(IssueTrackerDetailsDialogComponent, {
      width: '70%',
      // height: '100%',
      autoFocus: false,
      data
    });
    console.log(data)
    localStorage.setItem("stakeType", data.stakeholders);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // if (result !== true && result !== undefined ) {
      //   this.messageService.add({severity: 'success', summary: 'Success', detail: result});
      // }
      // this.getTransportPermit();
      // this.router.navigate(['isssue-tracker-details']);
    });
  }

  getLeaderFilter(){
    const dialogRef = this.dialog.open(VolunteerFilterDialogComponent, {
      width: '70%',
      // height: '100%',
      autoFocus: false,
    });
    // localStorage.setItem("stakeType", data.stakeholders);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // if (result !== true && result !== undefined ) {
      //   this.messageService.add({severity: 'success', summary: 'Success', detail: result});
      // }
      // this.getTransportPermit();
      // this.router.navigate(['isssue-tracker-details']);
    });
  }

  getTotal(color){
  //   return this.ELEMENT_DATA.map(e => e.color).reduce((acc, value) => acc + value, 0);
   }


  getURL(v) {
      this.downloadURL = `assets/doc/${v.value}`
  }
}


