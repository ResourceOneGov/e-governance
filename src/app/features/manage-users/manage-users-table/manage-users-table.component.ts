import { Component, OnInit, Input, SimpleChange, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/core/services/user-service';
import { MatPaginator } from '@angular/material/paginator';
import { fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-manage-users-table',
  templateUrl: './manage-users-table.component.html',
  styleUrls: ['./manage-users-table.component.scss']
})
export class ManageUsersTableComponent implements OnInit {
  @Input() searchObj;
  displayedColumns: string[] = ['No','userId', 'firstName', 'lastName', 'mobileNumber', 'email', 'status'];
  usersDataSource = new MatTableDataSource();
  limit: number;
  offset: number;
  search: string;
  usersLength: number;

  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(150),
          distinctUntilChanged(),
          tap((text) => {
            console.log(this.input.nativeElement.value);
            this.getUserDetails();
          })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes.searchObj && changes.searchObj.currentValue) {
      this.limit = 5;
      this.offset = 0;
      this.getUserDetails();
    }
  }
  getUserDetails() {
    this.userService.getUsers(this.search, this.searchObj.divisionId, this.searchObj.role, this.limit, this.offset, 
      this.searchObj.userType, true).subscribe(res => {
        this.usersDataSource = new MatTableDataSource(res.users);
        this.usersLength = res.count;
        setTimeout(()=> {
          this.usersDataSource.paginator = this.paginator;
        },100);
      }); 
  }

  toggleUserStatus(e, user) {
    this.userService.updateUserStatus(user, e.checked).subscribe(res => {
      this.getUserDetails();
    });
  }

  applyFilter(e) {
    
  }

  onPaginateChange(e) {
    this.limit = e.pageSize;
    this.offset = e.pageIndex * e.pageSize;
    this.getUserDetails();
  }

}
