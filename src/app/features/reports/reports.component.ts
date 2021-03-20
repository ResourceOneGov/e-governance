import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subscription, Subject, forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Division } from 'src/app/core/models/location.model';
import { GvType, TaskResponse, Secretariat, ReportType } from 'src/app/core/models/task.model';
import { User, Roles } from 'src/app/core/models/user.model';
import { TaskService } from 'src/app/core/services/task.service';
import { UserService } from 'src/app/core/services/user-service';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { ReportsService } from 'src/app/core/services/reports.service';
import {  FavoriteVideo, LikedVideo, WatchedVideo, CompletionTime, Reports } from 'src/app/core/models/reports.model';
import * as moment from 'moment';
import { SharedService } from 'src/app/core/services/shared.service';
import { MatSelect } from '@angular/material/select';
import { fromEvent, Observable } from "rxjs";

// import * as issues from '../../../assets/issue.json'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportsComponent implements OnInit {

  reportsForm: FormGroup;
  groups: Roles[];
  districts: Division[];
  parliaments:Division[];
  assemblies:Division[];
  mandals: Division[];
  secretariats: Division[];
  gvTypes: GvType[];
  reportTypes:ReportType[];
  users: User[];

  filteredGroups: ReplaySubject<Roles[]> = new ReplaySubject<Roles[]>(1);
  filteredDistricts: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredParliaments: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredAssemblies: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredMandals: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredGvTypes: ReplaySubject<GvType[]> = new ReplaySubject<GvType[]>(1);
  filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  filteredTasks: ReplaySubject<TaskResponse[]> = new ReplaySubject<TaskResponse[]>(1);
  filteredSecretariats: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredReportTypes: ReplaySubject<ReportType[]> = new ReplaySubject<ReportType[]>(1);

  error: string;
  currentDivisionLevel: number = 1;
  currentDivisionId: string;
  tooltipMessage: string = 'Select All / Unselect All';
  path: string ='';
  subscription: Subscription;
  progress: number = 0;
  progressMessage: string;
  consolidatedReports: Reports; 
  showReport: boolean = false;
  showDetailReport: boolean = false;
  uesrProfile:any;

  protected _onDestroy = new Subject<void>();
  reportObj: { divisionId?: string; from: any; to: any; users?: any; };
  detailReportType: string;
  duration: string = '';
  selectedDateRange: any[];
  favoriteVideosReport: FavoriteVideo[];
  likedVideosReport: LikedVideo[];
  watchedVideosReport: WatchedVideo[];
  completionVideosReport: CompletionTime[];
  seriesObj: { name: string; data: any[]; }[];
  chartOptions: any;
  showDistricts: boolean;
  showParliaments: boolean;
  showAssemblies: boolean;
  showMandals: boolean;
  showSecretariats: boolean;
  showGvTypes: boolean;
  disableDistrict: boolean = false;
  disableParliament: boolean;
  disableAssembly: boolean;
  disableMandal: boolean;
  disableSecretariat: boolean;
  today: Date = new Date();
  offset: number;
  limit: number;

  @ViewChild('userSelect') selectUserElt: MatSelect;
  searchingUsers: boolean = false;
  isSubmitted: boolean = false;
  selectedUsers: User[];
  showLoading: boolean = false;
  reportType: string;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    private taskService: TaskService, private userService: UserService, private reportService: ReportsService, 
    private sharedService: SharedService) {
      this.resizeObservable$ = fromEvent(window, 'resize')
      this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
        console.log('event in resize ', evt)
      });
     }

  ngOnInit(): void {
    this.uesrProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    this.reportsForm = this.fb.group({ 
      group: ['', Validators.required],
      groupFilter: '',
      district: '',
      districtFilter: '',
      parliament: '',
      parliamentFilter: '',
      assembly: '',
      assemblyFilter: '',
      mandal: '',
      mandalFilter: '',
      secretariat: '',
      secretariatFilter: '',
      gvType: '',
      gvTypeFilter: '',
      user: '',
      userFilter: '',
      reportType: ['', Validators.required],
      reportTypeFilter: '',
      from: '',
      to: ''
    });

    this.reportsForm.valueChanges.subscribe((change) => {
      this.isSubmitted = false;
      console.log('change', change);
    })

    this.reportsForm.get('districtFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      console.log('after change', this.reportsForm.get('districtFilter').value);
      this.filterSelect('districtFilter', 'districts', 'filteredDistricts', 'locationName');
    });

    this.reportsForm.get('parliamentFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      console.log('after change', this.reportsForm.get('parliamentFilter').value);
      this.filterSelect('parliamentFilter', 'parliaments', 'filteredParliaments', 'locationName');
    });

    this.reportsForm.get('assemblyFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      console.log('after change', this.reportsForm.get('parliamentFilter').value);
      this.filterSelect('assemblyFilter', 'assemblies', 'filteredAssemblies', 'locationName');
    });

    this.reportsForm.get('mandalFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('mandalFilter', 'mandals', 'filteredMandals', 'locationName');
    });

    this.reportsForm.get('userFilter').valueChanges
    .pipe(debounceTime(300)).subscribe(()=> {
      this.getUsers();
    })
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterSelect('userFilter', 'users', 'filteredUsers', 'userId');
    // });
    this.disableFilters();
    this.getFiltersData();
  }

  filterSelect(searchValue, key, filteredKey, property) {
    if(!this[key]) {
      return;
    }
    let search = this.reportsForm.get(searchValue).value;
    console.log('search', search);
    if (!search) {
      this[filteredKey].next(this[key]);
      return;
    } else {
      search = search.toLowerCase();
    }
    this[filteredKey].next(
      this[key].filter(item => item[property].toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredUsers.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        console.log('val in toggle Select All', val);
        const result = val.map(usr => { return usr._id });
        if (selectAllValue) {
          this.reportsForm.get('user').patchValue(result);
        } else {
          this.reportsForm.get('user').patchValue([]);
        }
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    // this.subscription.unsubscribe();
  }

  handleDateInput(e) {
    return false;
  }

  enableLocationFilters(role: Roles) {
    console.log('enable Location', role);
    this.disableFilters();
    this.showFiltersBasedOnRoles(role);
  }

  showFiltersBasedOnRoles(role: Roles) {
    this.uesrProfile = JSON.parse(localStorage.getItem('userProfile'));
    if(role && role.assignedLocationLevels && role.assignedLocationLevels.length > 0) {
      for(const level of role.assignedLocationLevels) {
        if(level === 1) {
          this.showDistricts = true;
          // this.reportsForm.get('district').setValidators([Validators.required]);
          if(this.uesrProfile && this.uesrProfile.locationAccess && this.uesrProfile.locationAccess.length > 0) {
            const idx = this.uesrProfile.locationAccess.findIndex(loc => { return loc.divisionLevel === level});
            if(idx >= 0) {
              this.disableDistrict = true;
              this.reportsForm.get('district').setValue(this.uesrProfile.locationAccess[idx].division._id);
              this.currentDivisionLevel = level;
              this.currentDivisionId = this.uesrProfile.locationAccess[idx].division._id;
            }
          } 
        } else if(level === 2) {
          this.showParliaments = true;
          if(this.uesrProfile && this.uesrProfile.locationAccess && this.uesrProfile.locationAccess.length > 0) {
            const idx = this.uesrProfile.locationAccess.findIndex(loc => { return loc.divisionLevel === level});
            if(idx >= 0) {
              this.disableParliament = true;
              this.reportsForm.get('parliament').setValue(this.uesrProfile.locationAccess[idx].division._id);
              this.currentDivisionLevel = level;
              this.currentDivisionId = this.uesrProfile.locationAccess[idx].division._id;
            }
          }
          // this.reportsForm.get('parliament').setValidators([Validators.required]);
          // this.reportsForm.get('parliament').updateValueAndValidity();
        } else if(level === 3) {
          this.showAssemblies = true;
          if(this.uesrProfile && this.uesrProfile.locationAccess && this.uesrProfile.locationAccess.length > 0) {
            const idx = this.uesrProfile.locationAccess.findIndex(loc => { return loc.divisionLevel === level});
            if(idx >= 0) {
              this.disableAssembly = true;
              this.reportsForm.get('assembly').setValue(this.uesrProfile.locationAccess[idx].division._id);
              this.currentDivisionLevel = level;
              this.currentDivisionId = this.uesrProfile.locationAccess[idx].division._id;
            }
          }
          // this.reportsForm.get('assembly').setValidators([Validators.required]);
          // this.reportsForm.get('assembly').updateValueAndValidity();
        } else if(level === 4) {
          this.showMandals = true;
          if(this.uesrProfile && this.uesrProfile.locationAccess && this.uesrProfile.locationAccess.length > 0) {
            const idx = this.uesrProfile.locationAccess.findIndex(loc => { return loc.divisionLevel === level});
            if(idx >= 0) {
              this.disableMandal = true;
              this.reportsForm.get('mandal').setValue(this.uesrProfile.locationAccess[idx].division._id);
              this.currentDivisionLevel = level;
              this.currentDivisionId = this.uesrProfile.locationAccess[idx].division._id;
            }
          }
          // this.reportsForm.get('mandal').setValidators([Validators.required]);
        } else if(level === 5) {
          this.showSecretariats = true;
          if(this.uesrProfile && this.uesrProfile.locationAccess && this.uesrProfile.locationAccess.length > 0) {
            const idx = this.uesrProfile.locationAccess.findIndex(loc => { return loc.divisionLevel === level});
            if(idx >= 0) {
              this.disableSecretariat = true;
              this.reportsForm.get('secretariat').setValue(this.uesrProfile.locationAccess[idx].division._id);
              this.currentDivisionLevel = level;
              this.currentDivisionId = this.uesrProfile.locationAccess[idx].division._id;
            }
          }
          if(role.roleLevel === 1) {
            this.showGvTypes = true;
          }
        }
        if(role.assignedLocationLevels[role.assignedLocationLevels.length - 1] === level) {
          this.getNextLevelDivisionData(this.currentDivisionLevel + 1, this.currentDivisionId);
        }
      }
    } else if(role && role.assignedLocationLevels && role.assignedLocationLevels.length === 0){
      this.userService.getUsers(this.reportsForm.get('userFilter').value, this.currentDivisionId.toString(), this.reportsForm.get('group').value,
        this.limit, this.offset, this.reportsForm.get('gvType').value).subscribe(resp => {
        console.log('Users', resp);
        this.users = resp.users;
        this.filteredUsers.next(this.users);
      })
    }
  }
  disableFilters() {
    this.reportsForm.reset({
      group: this.reportsForm.get('group').value,
      reportType: this.reportsForm.get('reportType').value,
      from: this.reportsForm.get('from').value,
      to: this.reportsForm.get('to').value
    });
    this.showDistricts = false;
    this.showParliaments = false;
    this.showAssemblies = false;
    this.showMandals = false;
    this.showSecretariats = false;
    this.showGvTypes = false;
    this.disableDistrict = false;
    this.disableParliament = false;
    this.disableAssembly = false;
    this.disableMandal = false;
    this.disableSecretariat = false;
    // this.filteredUsers.next([]);
    this.currentDivisionId = '';
    this.currentDivisionLevel = 0;
    this.searchingUsers = false;
    this.isSubmitted = false;
    this.offset = 0;
    this.limit = 20;
    this.selectedUsers = [];
  }

  filterLocations(e, level: number) {
    console.log('locations', e.value, level);
    this.isSubmitted = false;
    this.selectedUsers = [];
    this.reportsForm.get('user').setValue('');
    if(e.value) {
      this.getNextLevelDivisionData(level, e.value);
    } else {
      let val = level === 3 ? this.reportsForm.get('district').value : level === 4 ? this.reportsForm.get('parliament').value :
        level === 5 ? this.reportsForm.get('assembly').value : level === 6 ? this.reportsForm.get('mandal').value : 
        level === 7 ? this.reportsForm.get('secretariat').value : '';
      this.getNextLevelDivisionData(level -1, val);
    }
  }

  getNextLevelDivisionData(level, subDivisionTo) {
    for(let i = level; i <= 5; i++) {
      this.taskService.getLocationUrl(i, subDivisionTo).subscribe(res => {
        console.log('res', res);
        if(i === 2) {
          this.parliaments = res.divisions; 
          this.filteredParliaments.next(res.divisions);
        } 
        if(i === 3) {
          this.assemblies = res.divisions; 
          this.filteredAssemblies.next(res.divisions);
        } 
        if(i === 4) {
          this.mandals = res.divisions; 
          this.filteredMandals.next(res.divisions); 
        }
        if(i === 5) {
          this.secretariats = res.divisions; 
          this.filteredSecretariats.next(res.divisions); 
        }
      });
    }
    this.currentDivisionLevel = level - 1;
    this.currentDivisionId = subDivisionTo;
    this.getUsers();
  }

  getUsers() {
    console.log('this.currentDivisionId', this.currentDivisionId);
    this.searchingUsers = true;
    this.offset = 0;
    this.limit = 20;
    this.userService.getUsers(this.reportsForm.get('userFilter').value, this.currentDivisionId.toString(), this.reportsForm.get('group').value,
      this.limit, this.offset, this.reportsForm.get('gvType').value).subscribe(resp => {
      console.log('Users', resp);
      this.searchingUsers = false;
      this.users = resp.users;
      this.users.push(...this.selectedUsers);
      this.filteredUsers.next(this.users);
    }, err => {
      this.searchingUsers = false;
    })
  }

  getFiltersData() {
    this.userService.getRoles(true).subscribe(res=> {
      this.groups = res;
      this.filteredGroups.next(this.groups);
    });

    this.taskService.getLocationUrl(1).subscribe(res => {
      console.log('res', res);
      this.districts = res.divisions;
      this.filteredDistricts.next(res.divisions);
      console.log('res districts', this.districts, this.filteredDistricts);
    });

    this.taskService.getLocationUrl(2).subscribe(res => {
      console.log('res', res);
      this.parliaments = res.divisions;
      this.filteredParliaments.next(res.divisions);
    });

    this.taskService.getLocationUrl(3).subscribe(res => {
      console.log('res', res);
      this.assemblies = res.divisions;
      this.filteredAssemblies.next(res.divisions);
    });

    this.taskService.getLocationUrl(4).subscribe(res => {
      console.log('res', res);
      this.mandals = res.divisions;
      this.filteredMandals.next(res.divisions);
    });

    this.taskService.getLocationUrl(5).subscribe(res => {
      console.log('res', res);
      this.secretariats = res.divisions;
      this.filteredSecretariats.next(res.divisions);
    });

    this.gvTypes = [{value: 'VV', viewValue: "VV"}, {value: 'WV', viewValue: "WV"}];
    this.filteredGvTypes.next(this.gvTypes);

    // this.reportTypes = [{value: 'attendance', viewValue: "Attendance"}, {value: 'elearning', viewValue: "E-learning"}, {value: 'task', viewValue: "Task"}, {value: 'issue', viewValue: "Issue"}];
    this.reportTypes = [{value: 'elearning', viewValue: "E-learning"}, {value: 'issue', viewValue: "Issue"}];
    this.filteredReportTypes.next(this.reportTypes);

  }

  getReports(){
    this.showLoading = true;
    if(this.reportsForm.get('from').value && this.reportsForm.get('to').value) {
        this.selectedDateRange = this.getDatesBetweenDates(this.reportsForm.get('from').value, this.reportsForm.get('to').value);
        console.log('selectedDateRange', this.selectedDateRange);
        console.log('users', this.reportsForm.get('user').value);
        if(this.reportsForm.get('reportType').value === 'issue') {
          this.reportObj = {
            from: this.reportsForm.get('from').value.toISOString(),
            to: new Date(this.reportsForm.get('to').value.setHours(23,59,59,999)).toISOString(),
          }
        } else {
          this.reportObj = {
            from: this.reportsForm.get('from').value.toISOString(),
            to: new Date(this.reportsForm.get('to').value.setHours(23,59,59,999)).toISOString(),
            users: this.reportsForm.get('user').value.toString(),
          }
          console.log('reortObj', this.reportObj);
        }      
    } else {
        const maxDate = new Date();
        const minDate = moment().startOf('month');
        this.selectedDateRange = this.getDatesBetweenDates(minDate, maxDate);
        console.log('selectedDateRange', this.selectedDateRange);
        this.reportObj = {
          from: minDate,
          to: maxDate,
        }
        console.log('reortObj', this.reportObj);
        this.reportType = this.reportsForm.get('reportType').value;
        this.isSubmitted = true;
        this.showReport = true;
        this.duration = `${moment(minDate.toISOString()).format('ll')} to ${moment(maxDate.toISOString()).format('ll')}`;  
    }
    this.reportService.getReports(this.reportsForm.get('reportType').value, this.reportObj, this.currentDivisionId, this.reportsForm.get('group').value).subscribe(res => {
      this.reportType = this.reportsForm.get('reportType').value;
      this.isSubmitted = true;
      this.showReport = true;
      if(this.reportsForm.get('from').value && this.reportsForm.get('to').value){
        this.duration = `${moment(this.reportsForm.get('from').value).format('ll')} to ${moment(this.reportsForm.get('to').value).format('ll')}`;
      }
      this.consolidatedReports= res;
      this.createChartData();
      this.showLoading = false;
    }, err => {
      this.showLoading = false;
    }); 
  }

  getConsolidatedReports(response) {    
    // this.sharedService.issues.subscribe(data=> {

    //   const resultObject = { totalPSLevel: 0, totalMPDOLevel: 0, totalJoinCollectorLevel: 0, totalIssues: [], totalRuralIssues: [], totalUrbanIssues:[]};
    //   // const data =  (issues as any).default;
      
    //   //this.issues = res;
    //   const sd = new Date(this.reportsForm.get('from').value);
    //   const ed = new Date(this.reportsForm.get('to').value);
    //   let result = data.filter(d => {
    //     // console.log('date range filter', sd, new Date(d['Issue escalated on Date']), ed);
    //     return (sd <= new Date(d['Issue escalated on Date']) && new Date(d['Issue escalated on Date']) <= ed);
    //    });
    //    console.log('result', result);
    //   if(this.reportsForm.get('district').value) {
    //     const districtIndex = this.districts.findIndex(dis => dis._id === this.reportsForm.get('district').value);
    //     console.log('districtIndex', this.districts[districtIndex]);
    //     result = result.filter(di => { 
    //       // console.log('district name',  di['District Name'].toLowerCase(), this.reportsForm.get('district').value.toLowerCase());
    //       return di['District Name'].toLowerCase() === this.districts[districtIndex].locationName.toLowerCase()
    //     });
    //   }

    //   if(this.reportsForm.get('parliament').value) {
    //     const pIndex = this.parliaments.findIndex(dis => dis._id === this.reportsForm.get('parliament').value);
    //     console.log('pIndex', this.parliaments[pIndex]);
    //     result = result.filter(di => { 
    //       // console.log('district name',  di['District Name'].toLowerCase(), this.reportsForm.get('district').value.toLowerCase());
    //       return di['PC'].toLowerCase() === this.parliaments[pIndex].locationName.toLowerCase()
    //     });
    //   }

    //   if(this.reportsForm.get('assembly').value) {
    //     const aIdx = this.assemblies.findIndex(dis => dis._id === this.reportsForm.get('assembly').value);
    //     console.log('aIdx', this.assemblies[aIdx]);
    //     result = result.filter(di => { 
    //       // console.log('district name',  di['District Name'].toLowerCase(), this.reportsForm.get('district').value.toLowerCase());
    //       return di['AC'].toLowerCase() === this.assemblies[aIdx].locationName.toLowerCase()
    //     });
    //   }

    //   if(this.reportsForm.get('mandal').value) {
    //     const mIdx = this.mandals.findIndex(dis => dis._id === this.reportsForm.get('mandal').value);
    //     console.log('mIdx', this.mandals[mIdx]);
    //     result = result.filter(di => { 
    //       // console.log('district name',  di['District Name'].toLowerCase(), this.reportsForm.get('district').value.toLowerCase());
    //       return di['Mandal/Municiplaity Name'].toLowerCase() === this.mandals[mIdx].locationName.toLowerCase()
    //     });
    //   }

    //   if(this.reportsForm.get('secretariat').value) {
    //     const sIdx = this.secretariats.findIndex(dis => dis._id === this.reportsForm.get('secretariat').value);
    //     console.log('sIdx', this.secretariats[sIdx]);
    //     result = result.filter(di => { 
    //       // console.log('district name',  di['District Name'].toLowerCase(), this.reportsForm.get('district').value.toLowerCase());
    //       return di['VS/WS Name'].toLowerCase() === this.secretariats[sIdx].locationName.toLowerCase()
    //     });
    //   }
       
    //   console.log('result', result);
    //   const totalPSLevel = result.filter(p => { return p['Issue escalated to'] === 'PS'});
    //   const totalMPDOLevel = result.filter(p => { return p['Issue escalated to'] === 'MPDO'});
    //   const totalJoinCollectorLevel = result.filter(p => { return p['Issue escalated to'] === 'JC' || p['Issue escalated to'] === 'CEO ZPP'}); 
    //   resultObject.totalPSLevel = totalPSLevel;
    //   resultObject.totalMPDOLevel = totalMPDOLevel;
    //   resultObject.totalJoinCollectorLevel = totalJoinCollectorLevel; 
      
    //   console.log('selectedDateRange', this.selectedDateRange);
    //   for(let date of this.selectedDateRange) {
    //     const dateFilter = result.filter(da => {
    //       console.log('inside for', new Date(da['Issue escalated on Date']).toISOString(), new Date(date).toISOString());
    //        return new Date(da['Issue escalated on Date']).toDateString() === new Date(date).toDateString()  });
    //     const rural = dateFilter.filter(ru => { return ru['Rural/Urban'] === 'Rural'}).length;
    //     resultObject.totalIssues.push({count: dateFilter.length, date: new Date(date).toDateString()});
    //     resultObject.totalUrbanIssues.push({count: dateFilter.length - rural, date: new Date(date).toDateString()});
    //     resultObject.totalRuralIssues.push({count: rural, date: new Date(date).toDateString()})
    //   }
    //   console.log('this.resultObj', resultObject);
    //   this.consolidatedReports = JSON.parse(JSON.stringify(resultObject));
    //   this.createChartData();
    // })
  }

  getDatesBetweenDates(startDate, endDate) {
    let dates = [];
    console.log('getDatesBetweenDates', startDate, endDate);
    if(endDate.valueOf() !== startDate.valueOf()) {
      const theDate = new Date(startDate)
      while (theDate <= endDate) {
        dates = [...dates, moment(theDate).format('ll')];
        theDate.setDate(theDate.getDate() + 1);
      }
    } else {
      dates = [moment(startDate).format('ll')];
    }
    return dates;
  }
  
  createChartData() {
    if(this.reportsForm.get('reportType').value === 'elearning') {
      this.seriesObj = [{ name: 'Total Videos Viewed', data: [] }, { name: 'Total Videos', data: [] }, { name: 'Liked Videos', data: [] },
                      { name: 'Favorite Videos', data: [] }];
      for(const date of this.selectedDateRange) {
        const favorite = this.consolidatedReports.totalFavorites.filter(fav => { return moment(fav.date).format('ll') === date});
        const favoriteCnt = favorite.reduce((a,c) => a + c.count, 0);
        if(favorite.length > 0) {
          this.seriesObj[3].data.push({y:favoriteCnt,color:'#FFA200'});
        } else {
          this.seriesObj[3].data.push({y:0,color:'#FFA200'});
        }
        const liked = this.consolidatedReports.totalLiked.filter(fav => { return moment(fav.date).format('ll') === date});
        const likedCnt = liked.reduce((a,c) => a + c.count, 0);
        if(liked.length > 0) {
          this.seriesObj[2].data.push({y:likedCnt,color:'#00D95F'});
        } else {
          this.seriesObj[2].data.push({y:0,color:'#00D95F'});
        }
        const watched = this.consolidatedReports.totalWatched.filter(fav => { return moment(fav.date).format('ll') === date});
        const watchedCnt = watched.reduce((a,c) => a + c.count, 0);
        if(watched.length > 0) {
          this.seriesObj[0].data.push({y:watchedCnt,color:'#1492E6'});
        } else {
          this.seriesObj[0].data.push({y:0,color:'#1492E6'});
        }
        this.seriesObj[1].data.push({y:this.consolidatedReports.totalVideos, color:'#676767'});
      }
    } else if(this.reportsForm.get('reportType').value === 'task') {
      this.seriesObj = [{ name: 'Total Completed', data: [] }, { name: 'Total In Progress', data: [] }, { name: 'Total Pending', data: [] },
          { name: 'Total Tasks', data: [] }];
      for(const date of this.selectedDateRange) {
        const totalCompleted = this.consolidatedReports.totalCompleted.filter(fav => { return moment(fav.date).format('ll') === date});
        const completedCnt = totalCompleted.reduce((a,c) => a + c.count, 0);
        if(totalCompleted.length > 0) {
          this.seriesObj[0].data.push({ y: completedCnt, color: '#1492E6'});
        } else {
          this.seriesObj[0].data.push({y:0,color: '#1492E6'});
        }
        const totalPending = this.consolidatedReports.totalPending.filter(fav => { return moment(fav.date).format('ll') === date});
        const pendingCnt = totalPending.reduce((a,c) => a + c.count, 0);
        if(totalPending.length > 0) {
          this.seriesObj[2].data.push({ y: pendingCnt, color:'#00D95F'});
        } else {
          this.seriesObj[2].data.push({y:0,color: '#00D95F'});
        }
        const totalInProgress = this.consolidatedReports.totalInProgress.filter(fav => { return moment(fav.date).format('ll') === date});
        const progressCnt = totalInProgress.reduce((a,c) => a + c.count, 0);
        if(totalInProgress.length > 0) {
          this.seriesObj[1].data.push({y:progressCnt, color: '#FFA200'});
        } else {
          this.seriesObj[1].data.push({y:0, color: '#FFA200'});
        }
        this.seriesObj[3].data.push({y:this.consolidatedReports.totalTasks, color:'#676767'});
      }
    } else if(this.reportsForm.get('reportType').value === 'attendance') {
      this.seriesObj = [{ name: 'Total Present', data: [] }, { name: 'Total Absent', data: [] }, { name: 'Total Holidays', data: [] },
          { name: 'Total Users', data: [] }];
      for(const date of this.selectedDateRange) {
        const totalPresent = this.consolidatedReports.totalPresent.filter(fav => { return moment(fav.date).format('ll') === date});
        const presentCnt = totalPresent.reduce((a,c) => a + c.count, 0);
        if(totalPresent.length > 0) {
          this.seriesObj[0].data.push({y:presentCnt,color: '#1492E6'});
        } else {
          this.seriesObj[0].data.push({y:0,color:'#1492E6'});
        }
        const totalAbsent = this.consolidatedReports.totalAbsent.filter(fav => { return moment(fav.date).format('ll') === date});
        const absentCnt = totalAbsent.reduce((a,c) => a + c.count, 0);
        if(totalAbsent.length > 0) {
          this.seriesObj[2].data.push({y:absentCnt,color:'#00D95F'});
        } else {
          this.seriesObj[2].data.push({y:0,color:'#00D95F'});
        }
        const totalHolidays = this.consolidatedReports.totalHolidays.filter(fav => { return moment(fav.date).format('ll') === date});
        const holidaysCnt = totalHolidays.reduce((a,c) => a + c.count, 0);
        if(totalHolidays.length > 0) {
          this.seriesObj[1].data.push({y:holidaysCnt, color:'#FFA200'});
        } else {
          this.seriesObj[1].data.push({y:0,color:'#FFA200'});
        }
        this.seriesObj[3].data.push({y:this.consolidatedReports.totalUsers,color:'#676767'});
      }
    } else if(this.reportsForm.get('reportType').value === 'issue') {
      this.seriesObj = [{ name: 'Total Issues', data: [] }, { name: 'Total Urban Issues', data: [] }, { name: 'Total Rural Issues', data: [] }];
      for(const date of this.selectedDateRange) { 
        const totalIssueIndex = this.consolidatedReports.issueCountByDates.findIndex(iss => { return moment(iss.date).format('ll') === date});
        if(totalIssueIndex >= 0) {
          this.seriesObj[2].data.push(this.consolidatedReports.issueCountByDates[totalIssueIndex].rural);
          this.seriesObj[1].data.push(this.consolidatedReports.issueCountByDates[totalIssueIndex].urban);
          this.seriesObj[0].data.push(this.consolidatedReports.issueCountByDates[totalIssueIndex].rural + 
            this.consolidatedReports.issueCountByDates[totalIssueIndex].urban);
        } else {
          this.seriesObj[0].data.push(0);
          this.seriesObj[1].data.push(0);
          this.seriesObj[2].data.push(0);
        }
      }
    }
    console.log('seriesObj', this.seriesObj);
      // this.chartOptions = {};
    this.chartOptions = this.createChartOptions();
    this.showLoading = false;
    setTimeout(()=> {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  createChartOptions() {
     const obj = {   
      chart: {
         type: 'column'
      },
      legend : {
         reversed: true
      },
      title: {
        text: null
      },
      xAxis:{
        categories: this.selectedDateRange,
        crosshair: true
      },
      yAxis : {
        min: 0,
      },
      credits: {
        enabled: false
      },
      tooltip : {
         valueSuffix: ''
      },
      plotOptions : {
        //  series: {
        //     stacking: 'normal'
        //  }
        column: {
          pointPadding: 0.3,
          borderWidth: 0
        }
      },
      series: this.seriesObj
    };
    return obj;
  }

  displayDetailReport(event) {
    this.showDetailReport = event;
  }

  selectedDetailReportType(event) {
    this.detailReportType = event;
  }

  getNextUsers() {
    this.searchingUsers = true;
    this.offset += 20;
    this.limit = 20;
    this.userService.getUsers(this.reportsForm.get('userFilter').value, this.currentDivisionId.toString(), this.reportsForm.get('group').value,
      this.limit, this.offset, this.reportsForm.get('gvType').value).subscribe(resp => {
      console.log('Users', resp);
      this.searchingUsers = false;
      this.users.push(...resp.users);
      this.filteredUsers.next(this.users);
    }, err => {
      this.searchingUsers = false;
    })
  }

  getSelectedUsers(user) {
    console.log('e.value', user);
    if(this.selectedUsers && this.selectedUsers.length > 0) {
      const idx = this.selectedUsers.findIndex(u => u._id === user._id);
      if(idx >= 0){
        this.selectedUsers.splice(idx, 1);
      } else {
        this.selectedUsers.push(user);
      } 
    }
    else {
      this.selectedUsers.push(user);
    }
    console.log('this.selectedUsers', this.selectedUsers);
  }

  selectedGVType(e) {
    this.selectedUsers = [];
    this.getUsers();
  }

  selectReportType(e) {
    // if(this.reportsForm.get('reportType').value === 'Issue') {
    //   this.reportsForm.get('from').setValidators([]);
    //   this.reportsForm.get('from').updateValueAndValidity();
    //   this.reportsForm.get('to').setValidators([]);
    //   this.reportsForm.get('to').updateValueAndValidity();
    // } else {
    //   this.reportsForm.get('from').setValidators([Validators.required]);
    //   this.reportsForm.get('from').updateValueAndValidity();
    //   this.reportsForm.get('to').setValidators([Validators.required]);
    //   this.reportsForm.get('to').updateValueAndValidity();
    // }
  }

  hideDetailReport(){
    this.showDetailReport = false;
    setTimeout(()=> {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  toggleSelectAllDistricts(select) {
    this.filteredDistricts.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {
      console.log('val', val);
      const result = val.map(district => { return district._id });
      this.reportsForm.get('user').setValue('');
      if (select) {
        this.reportsForm.get('district').patchValue(result);
        this.getNextLevelDivisionData(2, result);
      } else {
        this.reportsForm.get('district').patchValue([]);
      }    
    });
  }

  toggleSelectAllParliaments(select) {
    this.filteredParliaments.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {
      console.log('val', val);
      const result = val.map(parliament => { return parliament._id });
      this.reportsForm.get('user').setValue('');
      if (select) {
        this.reportsForm.get('parliament').patchValue(result);
        this.getNextLevelDivisionData(3, result);
      } else {
        this.reportsForm.get('parliament').patchValue([]);
        this.getNextLevelDivisionData(2, this.reportsForm.get('district').value);
      }    
    });
  }

  toggleSelectAllAssemblies(select) {
    this.filteredParliaments.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {
      console.log('val', val);
      const result = val.map(assembly => { return assembly._id });
      this.reportsForm.get('user').setValue('');
      if (select) {
        this.reportsForm.get('assembly').patchValue(result);
        this.getNextLevelDivisionData(4, result);
      } else {
        this.reportsForm.get('assembly').patchValue([]);
        this.getNextLevelDivisionData(3, this.reportsForm.get('parliament').value);
      }    
    });
  }

  toggleSelectAllMandals(select) {
    this.filteredParliaments.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {
      console.log('val', val);
      const result = val.map(mandal => { return mandal._id });
      this.reportsForm.get('user').setValue('');
      if (select) {
        this.reportsForm.get('mandal').patchValue(result);
        this.getNextLevelDivisionData(5, result);
      } else {
        this.reportsForm.get('mandal').patchValue([]);
        this.getNextLevelDivisionData(4, this.reportsForm.get('assembly').value);
      }    
    });
  }

  toggleSelectAllSecretariats(select) {
    this.filteredParliaments.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {
      console.log('val', val);
      const result = val.map(secretariat => { return secretariat._id });
      this.reportsForm.get('user').setValue('');
      if (select) {
        this.reportsForm.get('secretariat').patchValue(result);
        this.getNextLevelDivisionData(6, result);
      } else {
        this.reportsForm.get('secretariat').patchValue([]);
        this.getNextLevelDivisionData(5, this.reportsForm.get('mandal').value);
      }    
    });
  }

  toggleSelectAllGV(select) {
    this.filteredParliaments.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {
      console.log('val', val);
      const result = val.map(gvType => { return gvType._id });
      this.reportsForm.get('user').setValue('');
      if (select) {
        this.reportsForm.get('gvType').patchValue(result);
        this.getNextLevelDivisionData(7, result);
      } else {
        this.reportsForm.get('gvType').patchValue([]);
        this.getNextLevelDivisionData(6, this.reportsForm.get('secretariat').value);
      }    
    });
  }

}

