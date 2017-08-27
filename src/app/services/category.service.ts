import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Category } from "../model/category";
import {Observable, Subject} from "rxjs";

@Injectable()
export class CategoryService {

  private subject: Subject<any> = new Subject();
  private observable: Observable<any> = this.subject.asObservable();

  constructor(private http: Http) { }

  // TODO abstract
  private getBaseUrl() : string {
    // TODO is this the best way to infer the path or is there something better that maybe Angular provides?
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
  }

  public createNewCategory(category: Category) : Observable<Category> {
    return this.http.post(`${this.getBaseUrl()}/api/category`, category)
      .map((response: Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getAllCategories() : Observable<Array<Category>> {
    return this.http.get(`${this.getBaseUrl()}/api/categories`)
      .map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getObservable() : Observable<any> {
    return this.observable;
  }

  public broadcast(value?: any) : void {
    this.subject.next(value);
  }

}