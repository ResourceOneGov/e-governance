import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user-service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import { ReplaySubject, Subject } from 'rxjs';
import { Division } from 'src/app/core/models/location.model';
import { Secretariat, GvType } from 'src/app/core/models/task.model';
import { TaskService } from 'src/app/core/services/task.service';
import { takeUntil } from 'rxjs/operators';
import { Roles, LocationAccess } from 'src/app/core/models/user.model';
import { Role } from 'aws-sdk/clients/elastictranscoder';
import { InputValidator } from 'src/app/core/utils/input.validator';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit {

  createUserForm: FormGroup;
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

  constructor(private fb: FormBuilder, private userService: UserService, private snackBar: MatSnackBar, 
              private spinner: NgxSpinnerService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({ 
      userId:  ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      firstName:  ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      lastName:  ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      mobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      profileImage: 'https://www.bavarealtors.in/wp-content/uploads/2019/11/dummy-man-570x570.png',
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
      // address: '',
      // role: ''
    });

    this.createUserForm.get('districtFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('districtFilter', 'districts', 'filteredDistricts', 'locationName');
    });

    this.createUserForm.get('parliamentFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('parliamentFilter', 'parliaments', 'filteredParliaments', 'locationName');
    });

    this.createUserForm.get('assemblyFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('assemblyFilter', 'assemblies', 'filteredAssemblies', 'locationName');
    });

    this.createUserForm.get('mandalFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('mandalFilter', 'mandals', 'filteredMandals', 'locationName');
    });
    this.hideFilters();
    this.getFiltersData();
  }

  getNextLevelDivisionData(level, subDivisionTo) {
    for(let i = level; i <= 4; i++) {
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
    let search = this.createUserForm.get(searchValue).value;
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
          // this.createUserForm.get('district').setValue('');
          this.createUserForm.get('district').setValidators([Validators.required]);
        } else if(level === 2) {
          this.showParliaments = true;
          // this.createUserForm.get('parliament').setValue('');
          this.createUserForm.get('parliament').setValidators([Validators.required]);
          // this.createUserForm.get('parliament').updateValueAndValidity();
        } else if(level === 3) {
          this.showAssemblies = true;
          // this.createUserForm.get('assembly').setValue('');
          this.createUserForm.get('assembly').setValidators([Validators.required]);
          // this.createUserForm.get('assembly').updateValueAndValidity();
        } else if(level === 4) {
          this.showMandals = true;
          // this.createUserForm.get('mandal').setValue('');
          this.createUserForm.get('mandal').setValidators([Validators.required]);
          // this.createUserForm.get('mandal').updateValueAndValidity(); 
        } else if(level === 5) {
          this.showSecretariats = true;
          // this.createUserForm.get('secretariat').setValue('');
          this.createUserForm.get('secretariat').setValidators([Validators.required]);
          // this.createUserForm.get('secretariat').updateValueAndValidity();
          if(role.roleLevel === 1) {
            this.showGvTypes = true;
            // this.createUserForm.get('gvType').setValue('');
            this.createUserForm.get('gvType').setValidators([Validators.required]);
            // this.createUserForm.get('gvType').updateValueAndValidity();
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
      let val = level === 3 ? this.createUserForm.get('district').value : level === 4 ? this.createUserForm.get('parliament').value :
        level === 5 ? this.createUserForm.get('assembly').value : level === 6 ? this.createUserForm.get('mandal').value : 
        level === 7 ? this.createUserForm.get('secretariat').value : '';
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
    return this.createUserForm.controls;
  }

  onCreateUser() {
    console.log('create user', this.locationAccess);
    const createUserObj = {
      userId: this.createUserForm.get('userId').value,
      firstName: this.createUserForm.get('firstName').value,
      lastName: this.createUserForm.get('lastName').value,
      mobileNumber: this.createUserForm.get('mobileNumber').value,
      email: this.createUserForm.get('email').value,
      profileImage: 'https://www.bavarealtors.in/wp-content/uploads/2019/11/dummy-man-570x570.png',
      locationAccess: this.locationAccess,
      role: this.createUserForm.get('group').value,
    };
    if(this.showGvTypes) {
      createUserObj['type'] = this.createUserForm.get('gvType').value;
    }
    this.spinner.show();
    this.userService.onCreateUser(createUserObj).subscribe(res => {
      console.log('create user res', res);
      this.spinner.hide();
      this.error = '';
      this.createUserForm.reset();
      this.hideFilters();
      let snackBarRef = this.snackBar.open(`${res.userId} created successfully`, 'CLOSE', {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top"
      });
    }, error => {
      this.error = error.error.message;
      this.spinner.hide();
    })
  }

}
