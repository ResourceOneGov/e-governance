import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil, take, debounceTime } from 'rxjs/operators';
import { Division } from 'src/app/core/models/location.model';
import { User } from 'src/app/core/models/user.model';
import { Category } from 'src/app/core/models/category.model';
import { Priority, Secretariat, GvType, TaskResponse, TaskRes, Status, StatusUpdatedBy } from 'src/app/core/models/task.model';
import { TaskService } from 'src/app/core/services/task.service';
import { UserService } from 'src/app/core/services/user-service';
import { CategoryService } from 'src/app/core/services/category.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UpdateStatusComponent implements OnInit {

  updateStatusForm: FormGroup;

  districts: Division[];
  parliaments:Division[];
  assemblies:Division[];
  mandals: Division[];
  secretariats: Secretariat[];
  gvTypes: GvType[];
  users: User[];
  tasks: TaskResponse[];
  categories: Category[];
  priorities: Priority[];
  statuses: Status[];
  statusUpdatedBy: StatusUpdatedBy[];

  filteredDistricts: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredParliaments: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredAssemblies: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredMandals: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredGvTypes: ReplaySubject<GvType[]> = new ReplaySubject<GvType[]>(1);
  filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  filteredTasks: ReplaySubject<TaskResponse[]> = new ReplaySubject<TaskResponse[]>(1);
  filteredSecretariats: ReplaySubject<Secretariat[]> = new ReplaySubject<Secretariat[]>(1);
  filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
  filteredPriorities: ReplaySubject<Priority[]> = new ReplaySubject<Priority[]>(1);
  filteredStatuses: ReplaySubject<Status[]> = new ReplaySubject<Status[]>(1);
  filteredStatusUpdatedBy: ReplaySubject<StatusUpdatedBy[]> = new ReplaySubject<StatusUpdatedBy[]>(1);

  error: string;
  currentDivisionLevel: number = 1;
  currentDivisionId: string;
  tooltipMessage: string = 'Select All / Unselect All';
  path: string ='';
  subscription: Subscription;
  progress: number = 0;
  progressMessage: string; 

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private spinner: NgxSpinnerService,
            private taskService: TaskService, private userService: UserService, private categoryService: CategoryService,
            private router: Router) { 
          
  }

  ngOnInit(): void {

    this.subscription = this.taskService.uploadProgress$.subscribe(message => { 
      this.progress = Math.round(message.loaded / message.total * 100);
      console.log('Message', this.progress);
      if(this.progress > 0) {
        this.progressMessage = `${this.progress}% uploaded`;
      }
    }, err => {
      console.log('error', err);
    });     

    this.path = this.router.url;
    
    this.updateStatusForm = this.fb.group({ 
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
      task:['', Validators.required],
      taskFilter:'',
      status: ['', Validators.required],
      statusFilter: '',
      category:'',
      categoryFilter:'',
      priority:'',
      priorityFilter:'',
      comments: ['', Validators.required],
      file:'',
      updatedBy: '',
      updatedByFilter: ''
      // address: '',
      // role: ''
    });

    this.updateStatusForm.get('districtFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      console.log('after change', this.updateStatusForm.get('districtFilter').value);
      this.filterSelect('districtFilter', 'districts', 'filteredDistricts', 'locationName');
    });

    this.updateStatusForm.get('parliamentFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      console.log('after change', this.updateStatusForm.get('parliamentFilter').value);
      this.filterSelect('parliamentFilter', 'parliaments', 'filteredParliaments', 'locationName');
    });

    this.updateStatusForm.get('assemblyFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      console.log('after change', this.updateStatusForm.get('parliamentFilter').value);
      this.filterSelect('assemblyFilter', 'assemblies', 'filteredAssemblies', 'locationName');
    });

    this.updateStatusForm.get('mandalFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('mandalFilter', 'mandals', 'filteredMandals', 'locationName');
    });

    this.updateStatusForm.get('categoryFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('categoryFilter', 'categories', 'filteredCategories', 'name');
    });

    this.updateStatusForm.get('priorityFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('priorityFilter', 'priorities', 'filteredPriorities', 'viewValue');
    });

    this.updateStatusForm.get('userFilter').valueChanges
    .pipe(debounceTime(300)).subscribe(()=> {
      this.userService.getUsers(this.updateStatusForm.get('userFilter').value, this.currentDivisionId)
      .subscribe(resp => {
        console.log('Users', resp);
        this.users = resp.users;
        this.filteredUsers.next(this.users);
      })
    })

    this.updateStatusForm.get('taskFilter').valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSelect('taskFilter', 'tasks', 'filteredTasks', 'name');
    });

    this.getFiltersData();
  }

  getTasks(event) {
    console.log('userId', event);
    this.taskService.getTasks(event.value).subscribe((res:TaskRes) => {
      console.log('get Tasks', res);
      this.tasks = res.tasks;
      this.filteredTasks.next(this.tasks);
    })
  }

  filterSelect(searchValue, key, filteredKey, property) {
    if(!this[key]) {
      return;
    }
    let search = this.updateStatusForm.get(searchValue).value;
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  filterLocations(e, level: number) {
    console.log('locations', e.value, level);
    this.getNextLevelDivisionData(level, e.value);
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
      });
    }
    this.currentDivisionLevel = level - 1;
    this.currentDivisionId = subDivisionTo;
    this.userService.getUsers(this.updateStatusForm.get('userFilter').value, subDivisionTo).subscribe(resp => {
      console.log('Users', resp);
      this.users = resp.users;
      this.filteredUsers.next(this.users);
    })
  }

  getFiltersData() {
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

    this.categoryService.getCategories('tasks').subscribe(res => {
      this.categories = res;
      this.filteredCategories.next(res);
    });

    this.priorities = [{value: 1, viewValue: "Low"}, {value: 2, viewValue: "Medium"}, {value: 3, viewValue: "High"}];
    this.filteredPriorities.next(this.priorities);

    this.gvTypes = [{value: 'WG', viewValue: "WG"}, {value: 'VG', viewValue: "VG"}];
    this.filteredGvTypes.next(this.gvTypes);

    this.secretariats = [{value: 'WS', viewValue: "WS"}, {value: 'VS', viewValue: "VS"}];
    this.filteredSecretariats.next(this.secretariats);

    this.statusUpdatedBy = [{value: 'Admin', viewValue: "Admin"}, {value: 'GV', viewValue: "GV"}];
    this.filteredStatusUpdatedBy.next(this.statusUpdatedBy);

    this.statuses = [{code: 'ts001', name: "Pending"}, {code: 'ts002', name: "In Progress"}, {code: 'ts003', name: "Completed"}];
    this.filteredStatuses.next(this.statuses);
  }

  async uploadFile() {
    this.progress = 0;
    this.spinner.show();
    console.log('uploadFormVideo', this.updateStatusForm.value, this.updateStatusForm.controls['file'].value.files[0]); 
    this.taskService.uploadFile(this.updateStatusForm.controls['file'].value.files[0]).then(res => {
      console.log('res in upload file', res);
      if(res) {
        this.onUpdateTaskStatus(res);
        this.updateStatusForm.reset();
      }
    }, error => {
      this.error = error.error.message;
      this.spinner.hide();
    });
  }

  onUpdateTaskStatus(res) {
    const taskObj = {
      status: this.updateStatusForm.controls['status'].value,
      files: [
        res.Location
      ],
      comments: this.updateStatusForm.controls['comments'].value
    }
    console.log('task Obj', taskObj);

    this.taskService.updateTask(this.updateStatusForm.controls['task'].value, taskObj).subscribe(resp => {
      console.log('resp', resp);
      this.spinner.hide();
      // this.updateStatusForm.reset();
      this.snackBar.open("Task Status Updated Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
    }, err => {
      this.error = err;
      this.spinner.hide();
    });
  }

}
