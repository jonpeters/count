import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {
  MdCardModule, MdToolbarModule, MdMenuModule, MdIconModule, MdButtonModule,
  MdSidenavModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'home',
  component: HomeComponent
}];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdCardModule,
    MdToolbarModule,
    MdMenuModule,
    MdIconModule,
    MdButtonModule,
    MdSidenavModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
