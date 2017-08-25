import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Category } from "../model/category";
import { Observable } from "rxjs";

@Injectable()
export class CategoryService {

  constructor(private http: Http) { }

  public createNewCategory(category: Category) : Observable<Category> {
    // TODO is this the best way to infer the path or is there something better that maybe Angular provides?
    return this.http.post(`${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/api/category`, category)
      .map((response: Response) => response.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
