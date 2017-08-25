import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {
  MdCardModule, MdToolbarModule, MdMenuModule, MdIconModule, MdButtonModule,
  MdSidenavModule, MdDialogModule, MdInputModule, MdSnackBarModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import {CategoryService} from "./services/category.service";

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
    HomeComponent,
    NewCategoryDialogComponent
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
    MdDialogModule,
    MdInputModule,
    MdSnackBarModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    CategoryService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ NewCategoryDialogComponent ]
})
export class AppModule { }
