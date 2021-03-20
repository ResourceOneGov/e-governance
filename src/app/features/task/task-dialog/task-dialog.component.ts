import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subject, Subscription, fromEvent } from 'rxjs';
import { takeUntil, take, debounceTime, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { TaskService } from 'src/app/core/services/task.service';
import { Location, Division } from '../../../core/models/location.model';
import { User } from '../../../core/models/user.model';
import { UserService } from 'src/app/core/services/user-service';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';
import { Priority, Secretariat, GvType, TaskInTaskList } from 'src/app/core/models/task.model';
import { Router } from '@angular/router';
import { InputValidator } from 'src/app/core/utils/input.validator';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  @Output() onSubmitTasks = new EventEmitter<any>();

   taskForm: FormGroup;

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
   isEditTask: boolean = false;
 
   constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private spinner: NgxSpinnerService,
             private taskService: TaskService, private userService: UserService, private categoryService: CategoryService,
             private router: Router, public dialogRef: MatDialogRef<TaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data:TaskInTaskList, private _snackBar: MatSnackBar) { 
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
 
     this.path = this.router.url;
     this.isEditTask = this.data && this.data._id ?  true : false;
 
     this.taskForm = this.fb.group({ 
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
       task:'',
       taskFilter:'',
       category:['', Validators.required],
       categoryFilter:'',
       priority:['', Validators.required],
       priorityFilter:'',
       name: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
       description: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
       file:''
       // address: '',
       // role: ''
     });

     if(this.isEditTask) {
      this.taskForm.get('districtFilter').valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log('after change', this.taskForm.get('districtFilter').value);
        this.filterSelect('districtFilter', 'districts', 'filteredDistricts', 'locationName');
      });
  
      this.taskForm.get('parliamentFilter').valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log('after change', this.taskForm.get('parliamentFilter').value);
        this.filterSelect('parliamentFilter', 'parliaments', 'filteredParliaments', 'locationName');
      });
  
      this.taskForm.get('assemblyFilter').valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log('after change', this.taskForm.get('parliamentFilter').value);
        this.filterSelect('assemblyFilter', 'assemblies', 'filteredAssemblies', 'locationName');
      });
  
      this.taskForm.get('mandalFilter').valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSelect('mandalFilter', 'mandals', 'filteredMandals', 'locationName');
      });

      this.taskForm.get('userFilter').valueChanges
      .pipe(debounceTime(300)).subscribe(()=> {
        if(this.currentDivisionId) {
          this.userService.getUsers(this.taskForm.get('userFilter').value, this.currentDivisionId, "5f2059f7ca0cf31aee7f988e")
          .subscribe(resp => {
            console.log('Users', resp);
            this.users = resp.users;
            this.filteredUsers.next(this.users);
          })
        }
      });
     } else if(!this.isEditTask){
      this.taskForm.get('user').setValidators([Validators.required]);
      this.taskForm.get('user').updateValueAndValidity();
     }
 
     this.taskForm.get('categoryFilter').valueChanges
     .pipe(takeUntil(this._onDestroy))
     .subscribe(() => {
       this.filterSelect('categoryFilter', 'categories', 'filteredCategories', 'name');
     });
 
     this.taskForm.get('priorityFilter').valueChanges
     .pipe(takeUntil(this._onDestroy))
     .subscribe(() => {
       this.filterSelect('priorityFilter', 'priorities', 'filteredPriorities', 'viewValue');
     });
 
     this.getFiltersData();
   }
 
   filterSelect(searchValue, key, filteredKey, property) {
     if(!this[key]) {
       return;
     }
     let search = this.taskForm.get(searchValue).value;
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
 
   get f(){
     return this.taskForm.controls;
   }
 
   toggleSelectAll(selectAllValue: boolean) {
     this.filteredUsers.pipe(take(1), takeUntil(this._onDestroy))
       .subscribe(val => {
         console.log('val in toggle Select All', val);
         const result = val.map(usr => { return usr._id });
         if (selectAllValue) {
           this.taskForm.get('user').patchValue(result);
         } else {
           this.taskForm.get('user').patchValue([]);
         }
       });
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
     this.userService.getUsers(this.taskForm.get('userFilter').value, subDivisionTo, "5f2059f7ca0cf31aee7f988e").subscribe(resp => {
       console.log('Users', resp);
       this.users = resp.users;
       this.filteredUsers.next(this.users);
     })
   }
 
   getFiltersData() {
     if(!this.isEditTask) {
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

      this.gvTypes = [{value: 'WG', viewValue: "WG"}, {value: 'VG', viewValue: "VG"}];
      this.filteredGvTypes.next(this.gvTypes);
  
      this.secretariats = [{value: 'WS', viewValue: "WS"}, {value: 'VS', viewValue: "VS"}];
      this.filteredSecretariats.next(this.secretariats);
     }

     this.categoryService.getCategories('tasks').subscribe(res => {
       this.categories = res;
       this.filteredCategories.next(res);
       if(this.isEditTask) {
         this.taskForm.get('category').setValue(this.data.category._id);
       }
     });
 
     this.priorities = [{value: 1, viewValue: "Low"}, {value: 2, viewValue: "Medium"}, {value: 3, viewValue: "High"}];
     this.filteredPriorities.next(this.priorities);
     if(this.isEditTask) {
      this.taskForm.get('priority').setValue(this.data.priority);
     }

     if(this.isEditTask) {
      this.taskForm.get('name').setValue(this.data.name);
      this.taskForm.get('description').setValue(this.data.description);
     }
 
   }
 
   async uploadFile() {
     if(this.isEditTask) {
      this.updateTask();
     } else {
      this.progress = 0;
      this.spinner.show();
      console.log('uploadFormVideo', this.taskForm.value, this.taskForm.controls['file'].value.files);
      let promises = [];
      for(let file of this.taskForm.controls['file'].value.files) {
        promises.push(this.uploadTaskFile(file));
      }
      Promise.all(promises)
      .then((results) => { 
        console.log('results', results);
        const urls = results.map((r) => r.Location);
          this.onCreateTask(urls);
      }, error => {
        this.error = error;
        this.spinner.hide();
      });  
     }
   }
  updateTask() {
    const taskObj = [{
      _id: this.data._id,
      task: {
        name: this.taskForm.controls['name'].value,
        description: this.taskForm.controls['description'].value,
        priority: this.taskForm.controls['priority'].value,
        files: this.data.files,
        category: this.taskForm.controls['category'].value,
      }
    }];
    console.log('task Obj', taskObj);
    this.taskService.editTask(taskObj).subscribe(res => {
      this.snackBar.open("Task Updated Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
      this.onSubmitTasks.emit();
    })
  }
 
   async uploadTaskFile(file) {
     return new Promise((resolve, reject) => {
       this.taskService.uploadFile(file).then((res)=> {
         resolve(res)
       });
     });
   }
 
   onCreateTask(res) {
     const taskObj = {
       name: this.taskForm.controls['name'].value,
       description: this.taskForm.controls['description'].value,
       priority: this.taskForm.controls['priority'].value,
       files: res,
       category: this.taskForm.controls['category'].value,
       assignedTo: {
         userIds: this.taskForm.controls['user'].value,
         location: {
           divisionId: this.currentDivisionId
         }
       }
     }
     console.log('task Obj', taskObj);
 
     this.taskService.createTask(taskObj).subscribe(resp => {
       console.log('resp', resp);
       this.spinner.hide();
       this.taskForm.reset();
       this.taskForm.controls['file'].setValue(null, { emitEvent: false });
       const fileInput = <HTMLInputElement>document.querySelector('ngx-mat-file-input[formcontrolname="file"] input[type="file"]');
       fileInput.value = null;
       this.currentDivisionId = '';
       this.users = [];
       this.filteredUsers.next(this.users);
       this.dialogRef.close();
       this.snackBar.open("Task Created Successfully", "OK", {
         duration: 2000,
         verticalPosition: 'top'
       });
       this.onSubmitTasks.emit();
     }, err => {
       this.error = err.error.message;
       this.spinner.hide();
     });
   }

   removeSelectedFile(i) {
    this.data.files.splice(i,1);
   }

}
