import { filter } from "rxjs/operators";
import { AfterViewInit, Component, Inject, OnInit, resolveForwardRef, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { IssueService } from "src/app/core/services/issue.service";

@Component({
  selector: "app-issue-district-info",
  templateUrl: "./issue-district-info.component.html",
  styleUrls: ["./issue-district-info.component.scss"]
})
export class IssueDistrictInfoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["district", "mandalName", "vsCode", "vsName", "rural", "issueRelatedTo", "issueRaisedOnDate", "issueCategory", "issueDescription"];
  // dataSource = ELEMENT_DATA;
  issueDistrictInfoLength: number = 0;
  dataSource: MatTableDataSource<any>;
  issueDistrictDetails: any;
  statuses = {
    "green" : "Resolved"
  }
  levels = {
    "CMO" : "CMO",
    "GSWS Department": "GSWS",
    "JC": "JC",
    "CEO ZPP": "JC",
    "MPDO/MC":  "MPDO",
    "Municipal Commissioner": "MPDO/MC",
    "VS/WS": "PS",
    "AS": "VS/WS"
  }
  errors: string[];



  @ViewChild(MatPaginator) paginator: MatPaginator;
  limit: number;
  district: any;
  stakeholdersDistrict: any;
  stakeName: any;
  stakelevel: string;
  stakeType: string;
  color: any;
  // issueDistrictInfoLength: number;
  constructor(private issueService: IssueService) {
    this.district = JSON.parse(localStorage.getItem("districtIssueInfo"));
    this.stakelevel = localStorage.getItem("stakeType");


    console.log(this.district);
    this.stakeholdersDistrict = this.district.district;
    this.color = this.district.color
    console.log(this.stakeholdersDistrict);
    console.log(this.issueDistrictDetails);
    console.log(this.levels)
    console.log(this.stakelevel);

   }



  ngOnInit(): void {
    // console.log(this.data)
    this.limit = 10;
    this.getIssueDetails();
  }

  getIssueDetails() {
    this.issueService.getIssueDetails().subscribe(res => {
      console.log("res of issue details", res);
      this.issueDistrictDetails = res;
      let obj;


   if(this.color){
        obj = this.issueDistrictDetails.filter(di => {
            return di.District.toLowerCase() === this.stakeholdersDistrict.toLowerCase() &&
            this.color.toLowerCase() === di.Colour.toLowerCase() && (this.levels[this.stakelevel] === di.Level_3 || this.levels[this.stakelevel] === di.Level_2
              ||this.levels[this.stakelevel] === di.Level_1)
        })
      }
      else{
        obj = this.issueDistrictDetails.filter(di => {
          return di.District.toLowerCase() === this.stakeholdersDistrict.toLowerCase() && (this.levels[this.stakelevel] === di.Level_3 || this.levels[this.stakelevel] === di.Level_2
            ||this.levels[this.stakelevel] === di.Level_1)
      })
    }
    console.log(obj);
    this.dataSource = new MatTableDataSource(obj);
    this.issueDistrictInfoLength = obj.length;
    this.dataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // For pagination
  }


}



