import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model'

const baseUrl = environment.baseUrl;

const categoriesUrl = baseUrl + '/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(type: string) {
    return this.http.get<Category[]>(categoriesUrl, {params: {type}});
  }

  onCreateCategory(categoryObj) {
    return this.http.post(categoriesUrl, categoryObj);
  }

  onDeleteCategory(categoryId) {
    return this.http.delete(`${categoriesUrl}/${categoryId}`);
  }
}
