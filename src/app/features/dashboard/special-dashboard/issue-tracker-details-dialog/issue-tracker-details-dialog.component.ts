import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IssueDashboard } from '../special-dashboard.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


// export interface IssueTrackerDetails {
//   green: number;
//   stakeholders: string;
//   blue: number;
//   orange: number;
//   yellow: number;
//   red: number;
//   black:number;
//   total:number;
// }

// const cmo: IssueTrackerDetails[] = [
//   {stakeholders: 'Ananthapur', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Chittoor', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'East Godavari', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Guntur', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Dr.YSR Kadapa', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Krishna', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Kurnool', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Nellore', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Prakasam', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Srikakulam', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Visakapatnam', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Vizianagaram', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'West Godavari', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Total', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0}
// ];

// const gsws: IssueTrackerDetails[] = [
//   {stakeholders: 'Ananthapur', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Chittoor', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'East Godavari', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Guntur', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Dr.YSR Kadapa', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Krishna', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Kurnool', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Nellore', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Prakasam', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Srikakulam', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Visakapatnam', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Vizianagaram', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'West Godavari', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0},
//   {stakeholders: 'Total', green: 0, blue: 0, orange: 0, yellow:0, red:0, black:0, total:0}
// ];

// const jc: IssueTrackerDetails[] = [
//   {stakeholders: 'Ananthapur', green: 111, blue: 20, orange: 54, yellow:100, red:40, black:100, total:425},
//   {stakeholders: 'Chittoor', green: 142, blue: 50, orange: 70, yellow:70, red:60, black:190, total:652},
//   {stakeholders: 'East Godavari', green: 98, blue: 10, orange: 62, yellow:50, red:30, black:100, total:350},
//   {stakeholders: 'Guntur', green: 64, blue: 12, orange: 11, yellow:40, red:12, black:40, total:179},
//   {stakeholders: 'Dr.YSR Kadapa', green: 112, blue: 7, orange: 23, yellow:52, red:7, black:52, total:447},
//   {stakeholders: 'Krishna', green: 0, blue: 24, orange: 7, yellow:40, red:24, black:40, total:135},
//   {stakeholders: 'Kurnool', green: 63, blue: 28, orange: 9, yellow:60, red:28, black:60, total:248},
//   {stakeholders: 'Nellore', green: 72, blue: 30, orange: 239, yellow:73, red:30, black:73, total:517},
//   {stakeholders: 'Prakasam', green: 79, blue: 285, orange: 52, yellow:69, red:100, black:69, total:654},
//   {stakeholders: 'Srikakulam', green: 64, blue: 12, orange: 57, yellow:54, red:185, black:54, total:426},
//   {stakeholders: 'Visakapatnam', green: 350, blue: 11, orange: 31, yellow:24, red:23, black:24, total:463},
//   {stakeholders: 'Vizianagaram', green: 123, blue: 20, orange: 45, yellow:11, red:20, black:11, total:230},
//   {stakeholders: 'West Godavari', green: 137, blue: 7, orange: 40, yellow:7, red:7, black:7, total:205},
//   {stakeholders: 'Total', green: 1415, blue: 516, orange: 700, yellow:720, red:566, black:820, total:4737}
// ];

// const mpdo: IssueTrackerDetails[] = [
//   {stakeholders: 'Ananthapur', green: 148, blue: 40, orange: 16, yellow:62, red:94, black:108, total:468},
//   {stakeholders: 'Chittoor', green: 160, blue: 39, orange: 12, yellow:40, red:90, black:106, total:447},
//   {stakeholders: 'East Godavari', green: 99, blue: 30, orange: 67, yellow:82, red:222, black:341, total:841},
//   {stakeholders: 'Guntur', green: 202, blue: 26, orange: 11, yellow:80, red:223, black:111, total:653},
//   {stakeholders: 'Dr.YSR Kadapa', green: 200, blue: 41, orange: 7, yellow:74, red:110, black:96, total:528},
//   {stakeholders: 'Krishna', green: 212, blue: 42, orange: 4, yellow:68, red:70, black:98, total:494},
//   {stakeholders: 'Kurnool', green: 74, blue: 195, orange: 19, yellow:40, red:68, black:100, total:496},
//   {stakeholders: 'Nellore', green: 150, blue: 25, orange: 20, yellow:24, red:54, black:74, total:347},
//   {stakeholders: 'Prakasam', green: 96, blue: 12, orange: 12, yellow:26, red:48, black:80, total:274},
//   {stakeholders: 'Srikakulam', green: 89, blue: 13, orange: 13, yellow:162, red:24, black:91, total:399},
//   {stakeholders: 'Visakapatnam', green: 114, blue: 7, orange: 7, yellow:34, red:34, black:75, total:288},
//   {stakeholders: 'Vizianagaram', green: 123, blue: 8, orange: 8, yellow:48, red:98, black:66, total:354},
//   {stakeholders: 'West Godavari', green: 252, blue: 4, orange: 4, yellow:50, red:79, black:54, total:456},
//   {stakeholders: 'Total', green: 1919, blue: 200, orange: 200, yellow:800, red:1214, black:1400, total:6045}
// ];

// const vsws: IssueTrackerDetails[] = [
//   {stakeholders: 'Ananthapur', green: 53, blue: 24, orange: 13, yellow:30, red:48, black:31, total:198},
//   {stakeholders: 'Chittoor', green: 51, blue: 23, orange: 12, yellow:31, red:47, black:29, total:193},
//   {stakeholders: 'East Godavari', green: 66, blue: 75, orange: 11, yellow:25, red:47, black:30, total:254},
//   {stakeholders: 'Guntur', green: 100, blue: 77, orange: 2, yellow:27, red:40, black:50, total:296},
//   {stakeholders: 'Dr.YSR Kadapa', green: 50, blue: 11, orange: 1, yellow:29, red:60, black:24, total:175},
//   {stakeholders: 'Krishna', green: 23, blue: 7, orange: 5, yellow:34, red:20, black:89, total:178},
//   {stakeholders: 'Kurnool', green: 26, blue: 10, orange: 14, yellow:11, red:41, black:21, total:123},
//   {stakeholders: 'Nellore', green: 30, blue: 20, orange: 15, yellow:7, red:20, black:47, total:139},
//   {stakeholders: 'Prakasam', green: 47, blue: 8, orange: 12, yellow:33, red:30, black:32, total:162},
//   {stakeholders: 'Srikakulam', green: 52, blue: 11, orange: 13, yellow:8, red:42, black:12, total:138},
//   {stakeholders: 'Visakapatnam', green: 72, blue: 4, orange: 1, yellow:0, red:20, black:11, total:108},
//   {stakeholders: 'Vizianagaram', green: 50, blue: 7, orange: 61, yellow:164, red:185, black:12, total:479},
//   {stakeholders: 'West Godavari', green: 49, blue: 25, orange: 0, yellow:1, red:20, black:7, total:102},
//   {stakeholders: 'Total', green: 668, blue: 302, orange: 160, yellow:400, red:620, black:395, total:2545}
// ];

 @Component({
  selector: 'app-issue-tracker-details-dialog',
  templateUrl: './issue-tracker-details-dialog.component.html',
  styleUrls: ['./issue-tracker-details-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IssueTrackerDetailsDialogComponent implements OnInit {
  // displayedColumns: string[] = ['stakeholders', 'green', 'blue', 'orange', 'yellow', 'red', 'black', 'total'];
  // dataSource: MatTableDataSource<any>;
  issueDashboard: IssueDashboard;
  issueDistrictUrl: string;
   user: any;
   selectDistrictForm: FormGroup;
   districts: any[]= [
    'Ananthapur','Chittoor','East Godavari','Guntur','Dr.YSR Kadapa','Krishna','Kurnool','Nellore','Prakasam','Srikakulam','Visakhapatnam','Vizianagaram','West Godavari'
  ]
  colors : any[] = [
    'green', 'blue', 'orange', 'yellow', 'red', 'black'
  ]
   selectedDistrict: any;
   location: any;
   filteredDistricts: any[];

  constructor(public dialogRef: MatDialogRef<IssueTrackerDetailsDialogComponent> ,@Inject(MAT_DIALOG_DATA)public data,
      public router: Router, private fb: FormBuilder) {
        this.user = JSON.parse(localStorage.getItem('userProfile'));
        }

  ngOnInit(): void {
    this.location = this.user.locationAccess[0];

    this.selectDistrictForm = this.fb.group({
      district: ['', Validators.required],
      color: '',
    });

    if(this.location && this.location.division && this.location.division.locationName){
      this.filteredDistricts = this.districts.filter(di =>
         di.toLowerCase() === this.location.division.locationName.toLowerCase()
    )
    console.log('filtered', this.filteredDistricts);
    } else {
      this.filteredDistricts = this.districts;
    }

    // console.log('location', location)
    // console.log(this.data)
    // if (this.data && this.data.stakeholders === 'CMO' || this.data && this.data.level === 'CMO') {
    //   let obj;
    //   if(location && location.division && location.division.locationName){
    //     obj = cmo.filter(di => {
    //         return di.stakeholders.toLowerCase() === location.division.locationName.toLowerCase();
    //     })
    //   } else{
    //     obj = cmo;
    //   }
    //   this.dataSource = new MatTableDataSource(obj);
    // }
    // if (this.data && this.data.stakeholders === 'GSWS Department' || this.data && this.data.level === 'GSWS Department') {
    //   let obj;
    //   if(location && location.division && location.division.locationName){
    //     obj = gsws.filter(di => {
    //         return di.stakeholders.toLowerCase() === location.division.locationName.toLowerCase();
    //     })
    //   } else if(this.user.locationAccess.length === 0) {
    //     obj = gsws;
    //   }
    //   this.dataSource = new MatTableDataSource(obj);
    // }
    // if (this.data && this.data.stakeholders === 'JC' || this.data && this.data.level === 'JC') {
    //   let obj;
    //   if(location && location.division && location.division.locationName){
    //     obj = jc.filter(di => {
    //         return di.stakeholders.toLowerCase() === location.division.locationName.toLowerCase();
    //     })
    //   } else{
    //     obj = jc;
    //   }
    //   this.dataSource = new MatTableDataSource(obj);
    // }
    // if (this.data && this.data.stakeholders === 'MPDO/MC' || this.data && this.data.level === 'MPDO/MC') {
    //   let obj;
    //   if(location && location.division && location.division.locationName){
    //     obj = mpdo.filter(di => {
    //         return di.stakeholders.toLowerCase() === location.division.locationName.toLowerCase();
    //     })
    //   } else{
    //     obj = mpdo;
    //   }
    //   this.dataSource = new MatTableDataSource(obj);
    // }
    // if (this.data && this.data.stakeholders === 'VS/WS' || this.data && this.data.level === 'VS/WS') {
    //   let obj;
    //   if(location && location.division && location.division.locationName){
    //     obj = vsws.filter(di => {
    //         return di.stakeholders.toLowerCase() === location.division.locationName.toLowerCase();
    //     })
    //   }
    //   else{
    //     obj = vsws;
    //   }
    //   this.dataSource = new MatTableDataSource(obj);
    // }

  }


  dialogClose(): void{
    this.dialogRef.close();
  }


  getIssueDistrictInfo(){
    let obj
    obj = this.selectDistrictForm.value
    console.log(obj)
    localStorage.setItem("districtIssueInfo", JSON.stringify(obj));
    // localStorage.setItem("selectedDistrictIssueColor", color);
    window.open(`/issue-district-info`)
    this.dialogRef.close();
  }
}
