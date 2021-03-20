import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Roles, LocationAccess, User } from 'src/app/core/models/user.model';
import { Division } from 'src/app/core/models/location.model';
import { GvType } from 'src/app/core/models/task.model';
import { ReplaySubject, Subject } from 'rxjs';
import { UserService } from 'src/app/core/services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { TaskService } from 'src/app/core/services/task.service';
import { Papa } from 'ngx-papaparse';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  manageUsersForm: FormGroup;
  roleTypes: string[] = ['SLO', 'MLO', 'GV', 'MLO', 'Admin'];
  error: string;
  groups: Roles[];
  districts: Division[];
  parliaments:Division[];
  assemblies:Division[];
  mandals: Division[];
  secretariats: Division[];
  gvTypes: GvType[];


  filteredGroups: ReplaySubject<Roles[]> = new ReplaySubject<Roles[]>(1);
  filteredDistricts: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredParliaments: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredAssemblies: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredMandals: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredGvTypes: ReplaySubject<GvType[]> = new ReplaySubject<GvType[]>(1);
  filteredSecretariats: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);

  currentDivisionLevel: number = 1;
  currentDivisionId: string;

  protected _onDestroy = new Subject<void>();
  showDistricts: boolean = false;
  showParliaments: boolean = false;
  showAssemblies: boolean = false;
  showMandals: boolean = false;
  showSecretariats: boolean = false;
  showGvTypes: boolean = false;
  locationAccess: LocationAccess[];
  uploadUsers: User[];
  errors: any[];
  searchObj: { divisionId: string; role: any; userType: any; };

  constructor(private fb: FormBuilder, private userService: UserService, private snackBar: MatSnackBar, 
              private spinner: NgxSpinnerService, private taskService: TaskService, private papa: Papa) { }

  ngOnInit(): void {
    this.manageUsersForm = this.fb.group({ 
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
      file:''
      // address: '',
      // role: ''
    });

    this.manageUsersForm.get('districtFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('districtFilter', 'districts', 'filteredDistricts', 'locationName');
    });

    this.manageUsersForm.get('parliamentFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('parliamentFilter', 'parliaments', 'filteredParliaments', 'locationName');
    });

    this.manageUsersForm.get('assemblyFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('assemblyFilter', 'assemblies', 'filteredAssemblies', 'locationName');
    });

    this.manageUsersForm.get('mandalFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('mandalFilter', 'mandals', 'filteredMandals', 'locationName');
    });
    this.hideFilters();
    this.getFiltersData();
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
  }

  filterSelect(searchValue, key, filteredKey, property) {
    if(!this[key]) {
      return;
    }
    let search = this.manageUsersForm.get(searchValue).value;
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

    this.gvTypes = [{value: 'WG', viewValue: "WG"}, {value: 'VG', viewValue: "VG"}];
    this.filteredGvTypes.next(this.gvTypes);
  }

  enableLocationFilters(role: Roles) {
    console.log('enable Location', role);
    this.showFiltersBasedOnRoles(role);
  }

  showFiltersBasedOnRoles(role: Roles) {
    this.hideFilters();
    if(role && role.assignedLocationLevels.length > 0) {
      for(const level of role.assignedLocationLevels) {
        if(level === 1) {
          this.showDistricts = true;
          // this.manageUsersForm.get('district').setValue('');
          // this.manageUsersForm.get('district').setValidators([Validators.required]);
        } else if(level === 2) {
          this.showParliaments = true;
          // this.manageUsersForm.get('parliament').setValue('');
          // this.manageUsersForm.get('parliament').setValidators([Validators.required]);
          // this.manageUsersForm.get('parliament').updateValueAndValidity();
        } else if(level === 3) {
          this.showAssemblies = true;
          // this.manageUsersForm.get('assembly').setValue('');
          // this.manageUsersForm.get('assembly').setValidators([Validators.required]);
          // this.manageUsersForm.get('assembly').updateValueAndValidity();
        } else if(level === 4) {
          this.showMandals = true;
          // this.manageUsersForm.get('mandal').setValue('');
          // this.manageUsersForm.get('mandal').setValidators([Validators.required]);
          // this.manageUsersForm.get('mandal').updateValueAndValidity(); 
        } else if(level === 5) {
          this.showSecretariats = true;
          // this.manageUsersForm.get('secretariat').setValue('');
          // this.manageUsersForm.get('secretariat').setValidators([Validators.required]);
          // this.manageUsersForm.get('secretariat').updateValueAndValidity();
          if(role.roleLevel === 1) {
            this.showGvTypes = true;
            // this.manageUsersForm.get('gvType').setValue('');
            // this.manageUsersForm.get('gvType').setValidators([Validators.required]);
            // this.manageUsersForm.get('gvType').updateValueAndValidity();
          }
        }
      }
    }
  }

  hideFilters() {
    this.showDistricts = false;
    this.showParliaments = false;
    this.showAssemblies = false;
    this.showMandals = false;
    this.showSecretariats = false;
    this.showGvTypes = false;
    this.locationAccess = [];
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    // this.subscription.unsubscribe();
  }

  filterLocations(e, level: number) {
    console.log('locations', e.value, level);
    if(e.value) {
      this.getNextLevelDivisionData(level, e.value);
    } else {
      let val = level === 3 ? this.manageUsersForm.get('district').value : level === 4 ? this.manageUsersForm.get('parliament').value :
        level === 5 ? this.manageUsersForm.get('assembly').value : level === 6 ? this.manageUsersForm.get('mandal').value : 
        level === 7 ? this.manageUsersForm.get('secretariat').value : '';
      this.getNextLevelDivisionData(level -1, val);
    }
    if(level !== 7) {
      const obj = {
        divisionLevel: level - 1,
        division: e.value,
        divisionType: level === 2 ? 'District': level === 3 ? 'Parliament' : level === 4 ? 'Assembly' : level === 5 ? 'Mandal' :
          level === 6 ? 'Secretariat' : ''
      }
      if(this.locationAccess && this.locationAccess.length > 0) {
        const idx = this.locationAccess.findIndex(loc => { return loc.divisionLevel === obj.divisionLevel});
        if(idx >= 0) {
          this.locationAccess[idx] = {...obj};
        } else {
          this.locationAccess.push(obj);
        }
      } else {
        this.locationAccess.push(obj);
      }
    }
  }

  get f(){
    return this.manageUsersForm.controls;
  }

  searchUsers() {
    this.searchObj = {
      divisionId: this.currentDivisionId,
      role: this.manageUsersForm.get('group').value,
      userType: this.manageUsersForm.get('gvType').value
    }
  }

}
