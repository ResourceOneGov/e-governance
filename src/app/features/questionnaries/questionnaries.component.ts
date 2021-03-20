import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ELearningService } from 'src/app/core/services/e-learning.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/category.model';
import { InputValidator } from 'src/app/core/utils/input.validator';


@Component({
  selector: 'app-questionnaries',
  templateUrl: './questionnaries.component.html',
  styleUrls: ['./questionnaries.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class QuestionnariesComponent implements OnInit {

  questionnarie: FormGroup;
  disableVideoSelection: boolean = false;
  videos: any[] = [];
  showQuestion: boolean = false;
  options: string[] = [];
  selectedQuestionType: string;
  newOption: string;
  questionsList: any[] = [];
  displayedColumns: string[] = ['question', 'action'];
  questionsDataSource = [];
  disableAddQuestion: boolean = true;

  filteredVideos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();
  categories: Category[];
  
  constructor(private fb: FormBuilder, private eLearningService: ELearningService, private snackBar: MatSnackBar, 
              private spinner: NgxSpinnerService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.questionnarie = this.fb.group({ 
      search: '',
      category:'',
      video: '',
      videoFilter: '',
      question: ['', [InputValidator.cannotStartWithSpace]],
      newOption: ['', [InputValidator.cannotStartWithSpace]],
      answer:''
    })

    // this.questionnarie.get('videoFilter')
    this.getVideos();
    this.getCategories();
    this.questionnarie.get('videoFilter').valueChanges
    .pipe(debounceTime(300)).subscribe(()=> {
      this.getVideos();
    })
    // .pipe(takeUntil(this._onDestroy))
    // .subscribe(() => {
    //   console.log('after change', this.questionnarie.get('videoFilter').value);
    //   this.filterVideos('videoFilter', 'videos', 'filteredVideos', 'description');
    // });
  }

  search() {

  }

  get f(){
    return this.questionnarie.controls;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getCategories() {
    this.categoryService.getCategories('elearning').subscribe(res => {
      console.log('res', res);
      this.categories = res;
    });
  }

  filterVideos(searchValue, key, filteredKey, property) {
    if(!this[key]) {
      return;
    }
    let search = this.questionnarie.get(searchValue).value;
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

  getVideos() {
    this.eLearningService.getVideos(this.questionnarie.get('category').value, this.questionnarie.get('videoFilter').value)
    .subscribe(res => {
      console.log('res in get Videos', res.videos);
      this.videos = JSON.parse(JSON.stringify(res.videos));
      this.filteredVideos.next(res.videos);
    });
  }

  onSaveQuestion(e){
    this.disableVideoSelection = true;
    e.stopPropagation();
    const obj = {
      question: this.questionnarie.get('question').value,
      answers: [this.options[this.questionnarie.get('answer').value]],
      options: JSON.parse(JSON.stringify(this.options))
    }
    console.log('object', obj);
    const data = this.questionsDataSource;
    data.push(JSON.parse(JSON.stringify(obj)));
    this.questionsDataSource = [...data];
    console.log('questionsDataSource', this.questionsDataSource);
    this.questionnarie.setValue({
      search: '',
      category: this.questionnarie.get('category').value,
      video: this.questionnarie.get('video').value,
      question: '',
      newOption: '',
      answer:'',
      videoFilter: ''
    });
    this.options = [];
  }

  showQuestionOptions(e) {
    e.stopPropagation();
    this.showQuestion = true;
  }

  addOptions(e) {
    e.stopPropagation();
    if(this.questionnarie.get('newOption').value.trim() !== '') {
      this.options.push(this.questionnarie.get('newOption').value);
      this.questionnarie.patchValue({newOption : ''});
    }
  }

  deleteOption(index) {
    this.options.splice(index, 1);
  }

  delteQuestion(idx) {
    const data = this.questionsDataSource;
    data.splice(idx, 1);
    this.questionsDataSource = [...data];
    // this.questionsDataSource
  }

  disableSaveBtn() {
    if(this.questionnarie.get('question').value !== '' && this.questionnarie.get('answer').value !== ''
               && this.options.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  updateQuestionnarie() {
    this.spinner.show();
    this.eLearningService.onCreateQuestionnaries(this.questionnarie.get('video').value, this.questionsDataSource).subscribe(res => {
      console.log('res', res);
      // this.questionnarie.get('video').setValue('');
      // this.questionnarie.get('category').setValue('');
      // this.questionnarie.get('videoFilter').setValue('');

      // this.questionnarie.updateValueAndValidity();
      this.questionnarie.reset();
      // this.questionnarie.markAsPristine();
      this.options = [];
      this.questionsDataSource = [];
      this.disableAddQuestion = true;
      this.disableVideoSelection = false;
      this.showQuestion = false;
      this.spinner.hide();
      this.snackBar.open(res.message, "OK", {
        duration: 2000,
      });
    }, err => {
      this.spinner.hide();
    });
  }

  cancelQuestionnarie() {
    
  }

}
