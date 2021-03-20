import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IssueService } from 'src/app/core/services/issue.service';

@Component({
  selector: 'app-volunteer-filter-dialog',
  templateUrl: './volunteer-filter-dialog.component.html',
  styleUrls: ['./volunteer-filter-dialog.component.scss']
})
export class VolunteerFilterDialogComponent implements OnInit {
  selectVolunteerForm: FormGroup;
  range: any;
  districts: any[]= [
    'Ananthapur','Chittoor','East Godavari','Guntur','Dr.YSR Kadapa','Krishna','Kurnool','Nellore','Prakasam','Srikakulam','Visakhapatnam','Vizianagaram','West Godavari'
  ]
  user: any;
  location: any;
  filteredDistricts: any[];
  filteredMandal: any;
  mandal: any;
  volunteerDetails: any;
  mandals: unknown[];


  constructor(private issueService: IssueService,public dialogRef: MatDialogRef<VolunteerFilterDialogComponent> ,private fb: FormBuilder) {
    this.user = JSON.parse(localStorage.getItem('userProfile'));
   }

  ngOnInit(): void {
    this.location = this.user.locationAccess[0];
    this.selectVolunteerForm = this.fb.group({
      range: ['', Validators.required],
      volunteerRangeGreater: '',
      volunteerRangeLess: '',
      volunteerRangeFrom:'',
      volunteerRangeTo: '',
      district: '',
      mandal: ''
    });
    if(this.location && this.location.division && this.location.division.locationName){
      this.filteredDistricts = this.districts.filter(di =>
         di.toLowerCase() === this.location.division.locationName.toLowerCase()
    )
    console.log('filtered', this.filteredDistricts);
    } else {
      this.filteredDistricts = this.districts;
    }
  }
  showMandalInfo(district){
    this.issueService.getVolunteerDetails().subscribe(res => {
      this.volunteerDetails = res;
      console.log('json',this.volunteerDetails)
      let obj
        obj = this.volunteerDetails.filter(ma => {
            return ma.DISTRICT.toLowerCase() === district.toLowerCase()
            }).map(ma =>
               ma.MANDAL
        );
        console.log('mandal', obj);
        // this.mandals = [...new Set(obj)];
        this.mandals = obj.filter((i, pos) => obj.indexOf(i) == pos);
        console.log(this.mandals);
      })
  }

  getLeadersInfo(){
    let volunteer
    volunteer = this.selectVolunteerForm.value
    console.log(volunteer)
    localStorage.setItem("volunteerInfo", JSON.stringify(volunteer));
    window.open(`/volunteer-details`)
    this.dialogRef.close();
  }

  dialogClose(): void{
    this.dialogRef.close();
  }

}
