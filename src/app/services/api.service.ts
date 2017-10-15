import { Injectable } from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiService {

  private token: string = null;
  private headers: Headers = new Headers();

  constructor(private http: Http, private router: Router) { }

  public authenticate(username: string, password: string) {
    return this.handleAuthenticationResponse(this.post("authenticate", { username: username, password: password }));
  }

  public signUp(username: string, password: string) {
    return this.handleAuthenticationResponse(this.post("sign-up", { username: username, password: password }));
  }

  private handleAuthenticationResponse(observable: Observable<any>) : Observable<any> {
    return observable.do((json: { success: boolean, token: string }) => {
      if (json.token) {
        this.token = json.token;
        this.headers = new Headers();
        this.headers.append("x-access-token", this.token);

        // save the token locally to avoid re-auth between page refreshes
        localStorage.setItem("token", this.token);
      }
    });
  }

  public post(url: string, data: any) : Observable<any> {
    return this.handleError(this.http.post(`${environment.baseUrl}/${url}`, data, { headers: this.headers }));
  }

  public put(url: string, data: any) : Observable<any> {
    return this.handleError(this.http.put(`${environment.baseUrl}/${url}`, data, { headers: this.headers }));
  }

  public get(url: string) : Observable<any> {
    return this.handleError(this.http.get(`${environment.baseUrl}/${url}`, { headers: this.headers }));
  }

  public isAuthenticated() : boolean {
    if (!this.token) {
      this.token = localStorage.getItem("token");
      this.headers.append("x-access-token", this.token);
    }

    return this.token != null;
  }

  public signOut() : void {
    this.token = null;
    localStorage.removeItem("token");
  }

  private handleError(observable: Observable<Response>) {
    return observable.map(response => response.text() ? response.json() : null).catch((error: any) => {
      if (error.status === 403) {
        this.token = null;
        this.router.navigate(['app/login']);
        return;
      }

      return Observable.throw(new Error(error.status));
    });
  }
}
