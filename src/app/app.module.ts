import {BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {
  MdCardModule, MdToolbarModule, MdMenuModule, MdIconModule, MdButtonModule,
  MdSidenavModule, MdDialogModule, MdInputModule, MdSnackBarModule, MdCheckboxModule, MdSelectModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import {CategoryService} from "./services/category.service";
import {GeneralEventService} from "./services/general-event.service";
import { GenericDialogComponent } from './generic-dialog/generic-dialog.component';
import { GraphComponent } from './graph/graph.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'home',
  component: HomeComponent
}, {
  path: 'graph',
  component: GraphComponent
}];

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    'pinch': { enable: false },
    'rotate': { enable: false }
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewCategoryDialogComponent,
    GenericDialogComponent,
    GraphComponent
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
    MdCheckboxModule,
    MdSelectModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    CategoryService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    GeneralEventService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ NewCategoryDialogComponent, GenericDialogComponent ]
})
export class AppModule { }
