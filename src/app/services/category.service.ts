import { Injectable } from '@angular/core';
import { Category } from "../model/category";
import {Observable, Subject} from "rxjs";
import {ApiService} from "./api.service";
import {Instant} from "../model/instant";

@Injectable()
export class CategoryService {

  private subject: Subject<any> = new Subject();
  private observable: Observable<any> = this.subject.asObservable();

  constructor(private api: ApiService) { }

  public createNewCategory(category: Category) : Observable<Category> {
    return this.api.post("secure/category", category);
  }

  public getAllCategories() : Observable<Array<Category>> {
    return this.api.get("secure/categories");
  }

  public getCategory(id: string) : Observable<Category> {
    return this.api.get(`secure/category/${id}`);
  }

  public deleteCategories(ids: Array<string>) : Observable<any> {
    return this.api.post("secure/categories", ids);
  }

  public incrementCategoryCount(id: string) : Observable<Category> {
    return this.api.post(`secure/increment-category-count/${id}`, {});
  }

  public getTimeSeries(start: number, end: number, categoryId: string, groupBy: string) : Observable<Array<{ unix_timestamp: number, value: number }>> {
    return this.api.get(`secure/time-series?start=${start}&end=${end}&categoryId=${categoryId}&groupBy=${groupBy}&offset=${new Date().getTimezoneOffset()}`);
  }

  public getInstants(categoryId: string) : Observable<Array<Instant>> {
    return this.api.get(`secure/instants?categoryId=${categoryId}`);
  }

  public updateCategory(category: Category, instantsToDelete: Array<Instant>) : Observable<any> {

    let body = {
      categoryId: category._id,
      categoryName: category.name,
      instantIds: instantsToDelete.map(instant => instant._id)
    };

    return this.api.put("secure/category", body);
  }


  public getObservable() : Observable<any> {
    return this.observable;
  }

  public broadcast(value?: any) : void {
    this.subject.next(value);
  }

}
