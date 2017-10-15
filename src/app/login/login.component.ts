import { Component, OnInit } from '@angular/core';
import {ApiService} from "../services/api.service";
import {Router} from "@angular/router";
import {MdSnackBar} from "@angular/material";
import {Observable} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private apiService: ApiService, private router: Router, private snackbar: MdSnackBar) { }

  ngOnInit() {

  }

  public handleSignIn() : void {
    this.handleSignInOrSignUpResponse(this.apiService.authenticate(this.username, this.password));
  }

  public handleSignUp() : void {
    this.handleSignInOrSignUpResponse(this.apiService.signUp(this.username, this.password));
  }

  private handleSignInOrSignUpResponse(observable: Observable<any>) : void {
    observable.catch((e: any) => {
      this.snackbar.open("Unknown error. Try again later :-(", "OK", {
        duration: 3000
      });
      return null;
    })
    .subscribe(response => {
      if (response.success === false) {
        this.snackbar.open(response.message, "OK", {
          duration: 3000
        });
      } else {
        this.router.navigate(['app/home']);
      }
    });
  }
}
