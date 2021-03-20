import { Component, OnInit } from '@angular/core';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { IssueService } from 'src/app/core/services/issue.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/core/services/user-service';
import { IssueTrackerDetailsDialogComponent } from './special-dashboard/issue-tracker-details-dialog/issue-tracker-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { element } from 'protractor';

export interface IssueDashboard {
  green: number;
  level: string;
  blue: number;
  orange: number;
  yellow: number;
  red: number;
  black:number;
  total:number;
}

const districtData = {
  "Ananthapur": [
    {level: 'CMO', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
    {level: 'GSWS Department', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
    {level: 'JC', green: 1432, blue: 0, orange: 720, yellow:0, red:2432, black:192, total:4776},
    {level: 'MPDO/MC', green: 1921, blue: 0, orange: 240, yellow:0, red:2971, black:98, total:5230},
    {level: 'VS/WS', green: 678, blue: 0, orange: 737, yellow:0, red:1734, black:125, total:3274},
    {level: 'Total', green: 4031, blue: 0, orange: 1697, yellow:0, red:7137, black:415, total:13280}
  ],
  "Chitoor": []
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

 isIssueUploaded: boolean = false;
  displayedColumns: string[] = ['stakeholders', 'green', 'blue', 'orange', 'yellow', 'red', 'black', 'total' ];
  dataSource = new MatTableDataSource();
  volunteerCount: number =0;
  gswsCount: number = 0;
  citizenCount: number = 0;
  chartTypes = [{value:"pie",viewValue: "Pie chart"}, {value:"bar", viewValue:"Bar chart"}];
  selectedVolunteerChart = "pie";
  selectedCitizenChart = "pie";
  colorCodes = {
    1: 'green',
    2: 'blue',
    3: 'yellow',
    4: 'orange',
    5: 'red',
    6: 'black'
  }
  levels = {
    'es01': 'PS',
    'es02': 'JC',
    'es03': 'MPDO',
    'es04': 'Municipal commisioner',
    'es05': 'DPO',
    'es06': 'CEO ZPP',
    'es07': 'Not escalated',
    'es08': 'EO'
  };
  issueCategories = {
    'ic01': 'Salary Discrepancy',
    'ic02': 'Infrastructure Issues',
    'ic03': 'Technical issues',
    'ic04': 'Awareness on Governement Schemes',
    'ic05': 'Political Pressures on GV',
    'ic06': 'Issues related to GV HH mapping',
    'ic07': 'Training related issues',
    'ic08': 'Awareness on roles & responsibilities',
    'ic09': 'Application process',
    'ic10': 'Beneficiary identification',
    'ic11': 'Distribution',
    'ic12': 'Communication',
    'ic13': 'Social audit',
    'ic14': 'Arogyasree card',
    'ic15': 'House patta',
    'ic16': 'Ration card',
    'ic17': 'Pension card',
    'ic18': 'Corruption',
    'ic19': 'Other issues'
  }
  volunteerChartOptions: any;
  citizenChartOptions: any;
  gswsChartOptions: any;
  volunteerBarChartOptions: any;
  citizenBarChartOptions: any;
  gswsBarChartOptions: any;
  userReports: any;
  totalPresentUsers: any;
  totalUsersWithGoodAssessment: any;
  totalPresentUsersUrban: any;
  totalPresentUsersRural: { type: string; count: number; };
  totalUsersWithGoodAssessmentUrban: { type: string; count: number; };
  totalUsersWithGoodAssessmentRural: { type: string; count: number; };
  selectedWSVSChart: string = "pie";
  role: number;
  user: any;
  roleName: any;
  location: any;
  constructor(private broadCastService:BroadcastService, private issueService: IssueService,
    private userService: UserService, private dialog: MatDialog) {
      this.user = JSON.parse(localStorage.getItem('userProfile'))
     }


  ngOnInit(): void {
    if(window.localStorage.getItem('isIssueUploaded') && window.localStorage.getItem('isIssueUploaded') === 'true') {
      console.log('local', window.localStorage.getItem('isIssueUploaded'));
      this.isIssueUploaded = true;
    }
    if(window.localStorage.getItem('userProfile')){
      this.role = JSON.parse(window.localStorage.getItem('userProfile')).role.roleLevel;
      console.log('role', this.role);
      this.roleName = JSON.parse(window.localStorage.getItem('userProfile')).role.roleName
      console.log('role name', this.roleName);
    }
    this.getColorCodes();
    this.getIssueReportsRelation();

    // this.getUsersReports();
  }


  getColorCodes() {
    this.location = this.user.locationAccess[0];
    this.issueService.getColorCodes().subscribe(res => {
      console.log('res', res);
      const levelObject = [];
      let issueLevelObject = [{level:'CMO', total:0}, {level: 'GSWS Department', total: 0}, {level: 'JC', total:0},
                              {level :'MPDO/MC', total: 0},{level: 'VS/WS', total: 0}]
      for(let level of res) {
        let issueObj;
        console.log('esclatedLevel', level.escalatedLevel);
        if(level.escalatedLevel === 'es02' || level.escalatedLevel === 'es06') {
          issueObj =issueLevelObject.find(is=> is.level === 'JC');
        } else if(level.escalatedLevel === 'es01') {
          issueObj = issueLevelObject.find(is => is.level === 'VS/WS');
        } else if(level.escalatedLevel === 'es03' || level.escalatedLevel === 'es04') {
          issueObj = issueLevelObject.find(is => is.level === 'MPDO/MC');
        }
        console.log('issueObj', issueObj);
        for(let code of level.colorCodes) {
          if(issueObj) {
            issueObj[this.colorCodes[code.code]] = issueObj[this.colorCodes[code.code]] ? issueObj[this.colorCodes[code.code]] += code.count : code.count;
            issueObj.total += code.count;
          }
        }
        const obj = { level: this.levels[level.escalatedLevel], total: 0 };
        for(let code of level.colorCodes) {
          obj[this.colorCodes[code.code]] = code.count;
          obj.total += code.count;
        }
        levelObject.push(obj);
      }
      console.log('levelObject', levelObject);
      const issueTotalObj = {
        level: 'Total',
        green: this.sumProp(issueLevelObject, 'green'),
        blue: this.sumProp(issueLevelObject, 'blue'),
        orange: this.sumProp(issueLevelObject, 'orange'),
        yellow: this.sumProp(issueLevelObject, 'yellow'),
        red: this.sumProp(issueLevelObject, 'red'),
        black: this.sumProp(issueLevelObject, 'black'),
        total: this.sumProp(issueLevelObject, 'total')
      }
      console.log('issueTotalObject', issueTotalObj);
      issueLevelObject.push(issueTotalObj);
      console.log('issueLevelObject', issueLevelObject);

      const obj = {
        level: 'Total',
        green: this.sumProp(levelObject, 'green'),
        blue: this.sumProp(levelObject, 'blue'),
        orange: this.sumProp(levelObject, 'orange'),
        yellow: this.sumProp(levelObject, 'yellow'),
        red: this.sumProp(levelObject, 'red'),
        black: this.sumProp(levelObject, 'black'),
        total: this.sumProp(levelObject, 'total')
      }
      console.log('obj', obj);
      levelObject.push(obj);
      console.log(issueLevelObject);
      let data = districtData[this.location.division.locationName];
      const idx = data.findIndex(i => i.level.toLocaleLowerCase() === this.user.role.roleName.toLocaleLowerCase())
      console.log('role name', idx);
      const filteredObj = data.slice(idx, issueLevelObject.length );
      console.log(filteredObj);
      // this.dataSource = new MatTableDataSource(levelObject);
      // const filteredDistrictObj = this.location.division.locationName ===
      this.dataSource = new MatTableDataSource(filteredObj);
      // this.dataSource = [...levelObject];
    });
  }

  getIssueTracker(data){
    const dialogRef = this.dialog.open(IssueTrackerDetailsDialogComponent, {
      width: '70%',
      // height: '50%',
      autoFocus: false,
      data
    });
    console.log('level',data)
    localStorage.setItem("stakeType", data.level);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // if (result !== true && result !== undefined ) {
      //   this.messageService.add({severity: 'success', summary: 'Success', detail: result});
      // }
      this.getColorCodes();
    });
  }

  sumProp(obj, prop) {
    return obj.reduce((acc,curr)=> acc + (curr[prop] ? curr[prop] : 0),0);
  }

  getIssueReportsRelation() {
    this.issueService.getIssueReportsRelation().subscribe(resp => {
      console.log('res', resp);
      this.volunteerCount = resp.volunteer.count;
      this.gswsCount = resp.gsws.count;
      this.citizenCount = resp.citizen.count;
      const volunteer = resp.volunteer.volunteer;
      let volunteerArray = [];
      let volunteerCategoriesArray =[];
      let volunteerBarArray = [];
      for(let obj of volunteer) {
        volunteerCategoriesArray.push(this.issueCategories[obj.category]);
        volunteerBarArray.push(obj.count);
        const arr = [this.issueCategories[obj.category], obj.count];
        volunteerArray.push(arr);
      }
      console.log('volunteer Array', volunteerArray);
      const citizen = resp.citizen.citizen;
      let citizenArray = [];
      let citizenCategoriesArray = [];
      let citizenBarArray = [];
      for(let obj of citizen) {
        citizenCategoriesArray.push(this.issueCategories[obj.category]);
        citizenBarArray.push(obj.count);
        const arr = [this.issueCategories[obj.category], obj.count];
        citizenArray.push(arr);
      }
      console.log('Citizen Array', citizenArray);
      const gsws = resp.gsws.gsws;
      let gswsArray = [];
      let gswsCategoriesArray = [];
      let gswsBarArray = [];
      for(let obj of gsws) {
        gswsCategoriesArray.push(this.issueCategories[obj.category]);
        gswsBarArray.push(obj.count);
        const arr = [this.issueCategories[obj.category], obj.count];
        gswsArray.push(arr);
      }
      console.log('gsws Array', gswsArray);
      this.volunteerChartOptions = this.createChartOptions(volunteerArray);
      this.citizenChartOptions = this.createChartOptions(citizenArray);
      this.gswsChartOptions = this.createChartOptions(gswsArray);

      this.citizenBarChartOptions = this.createBarChartOptions(citizenCategoriesArray,citizenBarArray);
      this.volunteerBarChartOptions = this.createBarChartOptions(volunteerCategoriesArray, volunteerBarArray);
      this.gswsBarChartOptions = this.createBarChartOptions(gswsCategoriesArray, gswsBarArray);
    })
  }

  getUsersReports(videoId) {
    this.userService.getUsersReports(videoId).subscribe(res => {
      console.log('res', res);
      // const userReports = res;
      this.totalPresentUsersUrban = res.totalPresentUsers.find(pru => pru.type === 'WV');
      this.totalPresentUsersRural = res.totalPresentUsers.find(pru => pru.type === 'VV');

      this.totalUsersWithGoodAssessmentUrban = res.totalUsersWithGoodAssessment.find(asu => asu.type === 'WV');
      this.totalUsersWithGoodAssessmentRural = res.totalUsersWithGoodAssessment.find(asu => asu.type === 'VV');

    })
  }

  selectChartType(e, type) {
    type === 'volunteer' ? this.selectedVolunteerChart = e : type === 'citizen' ? this.selectedCitizenChart = e :
      type === 'gsws' ? this.selectedWSVSChart = e : '';
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

  createBarChartOptions(categories, data) {
    const chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories,
        crosshair: true
      },
      credits:{
        enabled: false
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count'
        }
      },
      tooltip: {
        headerFormat: '<span>{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Issue Count',
        data
      }]
    }
    return chartOptions;
  }

}
