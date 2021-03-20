import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputValidator } from 'src/app/core/utils/input.validator';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryComponent implements OnInit {

  categoryForm: FormGroup;
  categories: Category[] = [];
  types:any[] = [{ name: 'E-Learning', type: 'elearning'}, { name: 'Task', type: 'task'}]
  constructor(private fb: FormBuilder, private categoryService: CategoryService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, InputValidator.cannotStartWithSpace]],
      type: ''
    });
    this.getCategories();
  }

  get f(){
    return this.categoryForm.controls;
  }

  onCreateCategory() {
    this.categoryService.onCreateCategory(this.categoryForm.value).subscribe((res) => {
      console.log('res', res);
      this.getCategories();
      this.categoryForm.reset();
      this.snackBar.open("Category Created Successfully", "OK", {
        duration: 2000,
        verticalPosition: 'top'
      });
    });
  }

  onDeleteCategory(category) {
    this.categoryService.onDeleteCategory(category._id).subscribe(res => {
      console.log('res in delete', res);
      this.getCategories();
    })
  }

  getCategories() {
    // this.categoryService.getCategories().subscribe(res => {
    //   console.log('res', res);
    //   this.categories = res;
    // });
  }

}
