import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IssueService } from 'src/app/core/services/issue.service';

@Component({
  selector: 'app-volunteer-details',
  templateUrl: './volunteer-details.component.html',
  styleUrls: ['./volunteer-details.component.scss']
})
export class VolunteerDetailsComponent implements OnInit {
  displayedColumns: string[] = ["rank", "district", "mandalName", "volunteerName", "overallScore"];
  volunteerDetailLength: number = 0;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  volunteerDetails: any;
  volunteer: any;

  constructor(private issueService: IssueService) {
    this.volunteer = JSON.parse(localStorage.getItem("volunteerInfo"));
   }

  ngOnInit(): void {
    this.getVolunteerDetails();
  }

  getVolunteerDetails(){
    this.issueService.getVolunteerDetails().subscribe((res:any) => {
    console.log("res of issue details", res);
    this.volunteerDetails = res;
    if(this.volunteer && this.volunteer.district) {
      this.volunteerDetails = this.volunteerDetails.filter(data => data['DISTRICT'] === this.volunteer.district);
    }
    if(this.volunteer && this.volunteer.mandal) {
      this.volunteerDetails = this.volunteerDetails.filter(data => data['MANDAL'] === this.volunteer.mandal);
    }
    if(this.volunteer && this.volunteer.range){
        if(this.volunteer.range === 'lessThan') {
          this.volunteerDetails = this.volunteerDetails.filter(data => data['Overall_Score'] < this.volunteer.volunteerRangeLess);
        } else if(this.volunteer.range === 'greaterThan') {
          this.volunteerDetails = this.volunteerDetails.filter(data => data['Overall_Score'] > this.volunteer.volunteerRangeGreater);
        } else if(this.volunteer.range === 'between') {
          this.volunteerDetails = this.volunteerDetails.filter(data => data['Overall_Score'] > this.volunteer.volunteerRangeFrom &&  data['Overall_Score'] < this.volunteer.volunteerRangeTo );
        }
    }
    this.dataSource = new MatTableDataSource(this.volunteerDetails);
    this.volunteerDetailLength = this.volunteerDetails.length;
    this.dataSource.paginator = this.paginator;
  })
}
}
