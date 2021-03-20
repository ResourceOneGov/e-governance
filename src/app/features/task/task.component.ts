import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subject, Subscription, fromEvent } from 'rxjs';
import { takeUntil, take, debounceTime, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { TaskService } from 'src/app/core/services/task.service';
import { Location, Division } from '../../core/models/location.model';
import { User } from '../../core/models/user.model';
import { UserService } from 'src/app/core/services/user-service';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';
import { Priority, Secretariat, GvType } from 'src/app/core/models/task.model';
import { Router } from '@angular/router';
import { InputValidator } from 'src/app/core/utils/input.validator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskComponent implements OnInit {

  taskForm: FormGroup;

  displayedColumns: string[] = ['No','name', 'description', 'priority', 'createdOn', 'category', 'action'];
  tasksDataSource = new MatTableDataSource();
  limit: number;
  offset: number;
  search: string;
  tasksLength: number;

  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild('taskInput') taskInput: ElementRef;

  districts: Division[];
  parliaments:Division[];
  assemblies:Division[];
  mandals: Division[];
  secretariats: Secretariat[];
  gvTypes: GvType[];
  users: User[];
  tasks: string[];
  categories: Category[];
  priorities: Priority[];

  filteredDistricts: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredParliaments: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredAssemblies: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredMandals: ReplaySubject<Division[]> = new ReplaySubject<Division[]>(1);
  filteredGvTypes: ReplaySubject<GvType[]> = new ReplaySubject<GvType[]>(1);
  filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  filteredTasks: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  filteredSecretariats: ReplaySubject<Secretariat[]> = new ReplaySubject<Secretariat[]>(1);
  filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
  filteredPriorities: ReplaySubject<Priority[]> = new ReplaySubject<Priority[]>(1);

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
            private router: Router, private dialog: MatDialog) { 
    this.subscription = this.taskService.uploadProgress$.subscribe(message => { 
      this.progress = Math.round(message.loaded / message.total * 100);
      console.log('Message', this.progress);
      if(this.progress > 0) {
        this.progressMessage = `${this.progress}% uploaded`;
      }
    }, err => {
      console.log('error', err);
    });     
          
  }

  ngOnInit(): void {

    // this.path = this.router.url;

    // this.taskForm = this.fb.group({ 
    //   district: '',
    //   districtFilter: '',
    //   parliament: '',
    //   parliamentFilter: '',
    //   assembly: '',
    //   assemblyFilter: '',
    //   mandal: '',
    //   mandalFilter: '',
    //   secretariat: '',
    //   secretariatFilter: '',
    //   gvType: '',
    //   gvTypeFilter: '',
    //   user: ['', Validators.required],
    //   userFilter: '',
    //   task:'',
    //   taskFilter:'',
    //   category:['', Validators.required],
    //   categoryFilter:'',
    //   priority:['', Validators.required],
    //   priorityFilter:'',
    //   name: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
    //   description: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
    //   file:''
    //   // address: '',
    //   // role: ''
    // });

    // this.taskForm.get('districtFilter').valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   console.log('after change', this.taskForm.get('districtFilter').value);
    //   this.filterSelect('districtFilter', 'districts', 'filteredDistricts', 'locationName');
    // });

    // this.taskForm.get('parliamentFilter').valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   console.log('after change', this.taskForm.get('parliamentFilter').value);
    //   this.filterSelect('parliamentFilter', 'parliaments', 'filteredParliaments', 'locationName');
    // });

    // this.taskForm.get('assemblyFilter').valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   console.log('after change', this.taskForm.get('parliamentFilter').value);
    //   this.filterSelect('assemblyFilter', 'assemblies', 'filteredAssemblies', 'locationName');
    // });

    // this.taskForm.get('mandalFilter').valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterSelect('mandalFilter', 'mandals', 'filteredMandals', 'locationName');
    // });

    // this.taskForm.get('categoryFilter').valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterSelect('categoryFilter', 'categories', 'filteredCategories', 'name');
    // });

    // this.taskForm.get('priorityFilter').valueChanges
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   this.filterSelect('priorityFilter', 'priorities', 'filteredPriorities', 'viewValue');
    // });

    // this.taskForm.get('userFilter').valueChanges
    // .pipe(debounceTime(300)).subscribe(()=> {
    //   if(this.currentDivisionId) {
    //     this.userService.getUsers(this.taskForm.get('userFilter').value, this.currentDivisionId, "5f2059f7ca0cf31aee7f988e")
    //     .subscribe(resp => {
    //       console.log('Users', resp);
    //       this.users = resp.users;
    //       this.filteredUsers.next(this.users);
    //     })
    //   }
    // })
    this.limit = 10;
    this.offset = 0;
    this.search = '';
    // this.getFiltersData();
    this.getTaskDetails();
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.taskInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(150),
          distinctUntilChanged(),
          tap((text) => {
            console.log(this.taskInput.nativeElement.value);
            this.getTaskDetails();
          })
      )
      .subscribe();
  }

  getTaskDetails() {
    this.taskService.getTasksList(this.search, this.limit, this.offset).subscribe(res => {
        this.tasksDataSource = new MatTableDataSource(res.tasks);
        this.tasksLength = res.count;
        setTimeout(()=> {
          this.tasksDataSource.paginator = this.paginator;
        },100);
      }); 
  }

  convertDate(date) {
    return moment(date).format('ll');
  }

  onPaginateChange(e) {
    this.limit = e.pageSize;
    this.offset = e.pageIndex * e.pageSize;
    this.getTaskDetails();
  }

  // filterSelect(searchValue, key, filteredKey, property) {
  //   if(!this[key]) {
  //     return;
  //   }
  //   let search = this.taskForm.get(searchValue).value;
  //   console.log('search', search);
  //   if (!search) {
  //     this[filteredKey].next(this[key]);
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this[filteredKey].next(
  //     this[key].filter(item => item[property].toLowerCase().indexOf(search) > -1)
  //   );
  // }

  // ngOnDestroy() {
  //   this._onDestroy.next();
  //   this._onDestroy.complete();
  //   this.subscription.unsubscribe();
  // }

  // filterLocations(e, level: number) {
  //   console.log('locations', e.value, level);
  //   this.getNextLevelDivisionData(level, e.value);
  // }

  // get f(){
  //   return this.taskForm.controls;
  // }

  // toggleSelectAll(selectAllValue: boolean) {
  //   this.filteredUsers.pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(val => {
  //       console.log('val in toggle Select All', val);
  //       const result = val.map(usr => { return usr._id });
  //       if (selectAllValue) {
  //         this.taskForm.get('user').patchValue(result);
  //       } else {
  //         this.taskForm.get('user').patchValue([]);
  //       }
  //     });
  // }

  // getNextLevelDivisionData(level, subDivisionTo) {
  //   for(let i = level; i <= 4; i++) {
  //     this.taskService.getLocationUrl(i, subDivisionTo).subscribe(res => {
  //       console.log('res', res);
  //       if(i === 2) {
  //         this.parliaments = res.divisions; 
  //         this.filteredParliaments.next(res.divisions);
  //       } 
  //       if(i === 3) {
  //         this.assemblies = res.divisions; 
  //         this.filteredAssemblies.next(res.divisions);
  //       } 
  //       if(i === 4) {
  //         this.mandals = res.divisions; 
  //         this.filteredMandals.next(res.divisions); 
  //       }
  //     });
  //   }
  //   this.currentDivisionLevel = level - 1;
  //   this.currentDivisionId = subDivisionTo;
  //   this.userService.getUsers(this.taskForm.get('userFilter').value, subDivisionTo, "5f2059f7ca0cf31aee7f988e").subscribe(resp => {
  //     console.log('Users', resp);
  //     this.users = resp.users;
  //     this.filteredUsers.next(this.users);
  //   })
  // }

  // getFiltersData() {
  //   this.taskService.getLocationUrl(1).subscribe(res => {
  //     console.log('res', res);
  //     this.districts = res.divisions;
  //     this.filteredDistricts.next(res.divisions);
  //     console.log('res districts', this.districts, this.filteredDistricts);
  //   });

  //   this.taskService.getLocationUrl(2).subscribe(res => {
  //     console.log('res', res);
  //     this.parliaments = res.divisions;
  //     this.filteredParliaments.next(res.divisions);
  //   });

  //   this.taskService.getLocationUrl(3).subscribe(res => {
  //     console.log('res', res);
  //     this.assemblies = res.divisions;
  //     this.filteredAssemblies.next(res.divisions);
  //   });

  //   this.taskService.getLocationUrl(4).subscribe(res => {
  //     console.log('res', res);
  //     this.mandals = res.divisions;
  //     this.filteredMandals.next(res.divisions);
  //   });

  //   this.categoryService.getCategories('tasks').subscribe(res => {
  //     this.categories = res;
  //     this.filteredCategories.next(res);
  //   });

  //   this.priorities = [{value: 1, viewValue: "Low"}, {value: 2, viewValue: "Medium"}, {value: 3, viewValue: "High"}];
  //   this.filteredPriorities.next(this.priorities);

  //   this.gvTypes = [{value: 'WG', viewValue: "WG"}, {value: 'VG', viewValue: "VG"}];
  //   this.filteredGvTypes.next(this.gvTypes);

  //   this.secretariats = [{value: 'WS', viewValue: "WS"}, {value: 'VS', viewValue: "VS"}];
  //   this.filteredSecretariats.next(this.secretariats);
  // }

  // async uploadFile() {
  //   this.progress = 0;
  //   this.spinner.show();
  //   console.log('uploadFormVideo', this.taskForm.value, this.taskForm.controls['file'].value.files);
  //   let promises = [];
  //   for(let file of this.taskForm.controls['file'].value.files) {
  //     promises.push(this.uploadTaskFile(file));
  //   }
  //   Promise.all(promises)
  //   .then((results) => { 
  //     console.log('results', results);
  //     const urls = results.map((r) => r.Location);
  //       this.onCreateTask(urls);
  //   }, error => {
  //     this.error = error;
  //     this.spinner.hide();
  //   });  
  // }

  // async uploadTaskFile(file) {
  //   return new Promise((resolve, reject) => {
  //     this.taskService.uploadFile(file).then((res)=> {
  //       resolve(res)
  //     });
  //   });
  // }

  // onCreateTask(res) {
  //   const taskObj = {
  //     name: this.taskForm.controls['name'].value,
  //     description: this.taskForm.controls['description'].value,
  //     priority: this.taskForm.controls['priority'].value,
  //     files: res,
  //     category: this.taskForm.controls['category'].value,
  //     assignedTo: {
  //       userIds: this.taskForm.controls['user'].value,
  //       location: {
  //         divisionId: this.currentDivisionId
  //       }
  //     }
  //   }
  //   console.log('task Obj', taskObj);

  //   this.taskService.createTask(taskObj).subscribe(resp => {
  //     console.log('resp', resp);
  //     this.spinner.hide();
  //     this.taskForm.reset();
  //     this.taskForm.controls['file'].setValue(null, { emitEvent: false });
  //     const fileInput = <HTMLInputElement>document.querySelector('ngx-mat-file-input[formcontrolname="file"] input[type="file"]');
  //     fileInput.value = null;
  //     this.currentDivisionId = '';
  //     this.users = [];
  //     this.filteredUsers.next(this.users);
  //     this.getTaskDetails();
  //     this.snackBar.open("Task Created Successfully", "OK", {
  //       duration: 2000,
  //       verticalPosition: 'top'
  //     });
  //   }, err => {
  //     this.error = err.error.message;
  //     this.spinner.hide();
  //   });
  // }

  deleteTask(task) {
    Swal.fire({
      title: `Are you sure?`,
      text: `You won't be able to revert this task (${task.name}) !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTsk(task).subscribe((res) => {
          this.getTaskDetails();
          Swal.fire(
            'Deleted!',
            `Your Task (${task.name}) has been deleted.`,
            'success'
          )
          this.snackBar.open("Task deleted Successfully", "OK", {
            duration: 2000,
            verticalPosition: 'top'
          });
        })
      }
    })
    
  }

  createTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: "80%",
      height: "80%"
    });
    const onSubmit = dialogRef.componentInstance.onSubmitTasks.subscribe((data: any) => { 
      this.limit = 10;
      this.offset = 0;
      this.search = '';
      this.getTaskDetails();
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed ' + result);
    });
  }

  editTask(task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: "80%",
      data: task
    });
    const onSubmit = dialogRef.componentInstance.onSubmitTasks.subscribe((data: any) => { 
      this.getTaskDetails();
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed ' + result);
    });
  }

}
