import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiService {

  private token: string = null;
  private headers: Headers = null;

  constructor(private http: Http, private router: Router) { }

  public authenticate(username: string, password: string) {
    return this.post("authenticate", { username: username, password: password }).do((json: { success: boolean, token: string }) => {
      if (json.token) {
        this.token = json.token;
        this.headers = new Headers();
        this.headers.append("x-access-token", this.token);
      }
    });
  }

  public post(url: string, data: any) : Observable<any> {
    return this.handleError(this.http.post(`${environment.baseUrl}/${url}`, data, { headers: this.headers }));
  }

  public get(url: string) : Observable<any> {
    return this.handleError(this.http.get(`${environment.baseUrl}/${url}`, { headers: this.headers }));
  }

  public isAuthenticated() : boolean {
    return this.token != null;
  }

  public signOut() : void {
    this.token = null;
  }

  private handleError(observable: Observable<Response>) {
    return observable.map(response => response.json()).catch((error: any) => {
      if (error.status === 403) {
        this.token = null;
        this.router.navigate(['login']);
        return;
      }

      return Observable.throw(new Error(error.status));
    });
  }
}
