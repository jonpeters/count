import {BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {
  MdCardModule, MdToolbarModule, MdMenuModule, MdIconModule, MdButtonModule,
  MdSidenavModule, MdDialogModule, MdInputModule, MdSnackBarModule, MdCheckboxModule, MdSelectModule, MdPaginatorModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import {CategoryService} from "./services/category.service";
import {GeneralEventService} from "./services/general-event.service";
import { GenericDialogComponent } from './generic-dialog/generic-dialog.component';
import { GraphComponent } from './graph/graph.component';
import {ApiService} from "./services/api.service";
import { LoginComponent } from './login/login.component';
import {AuthGuardService} from "./services/auth-guard.service";
import { EditComponent } from './edit/edit.component';
import { MomentPipe } from './pipes/moment.pipe';
import {UtilService} from "./services/util.service";
import { AlertsComponent } from './alerts/alerts.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'app/home',
  pathMatch: 'full'
}, {
  path: 'app/home',
  component: HomeComponent,
  canActivate: [AuthGuardService]
}, {
  path: 'app/graph',
  component: GraphComponent,
  canActivate: [AuthGuardService]
}, {
  path: 'app/edit',
  component: EditComponent,
  canActivate: [AuthGuardService]
}, {
  path: 'app/alerts',
  component: AlertsComponent,
  canActivate: [AuthGuardService]
}, {
  path: 'app/login',
  component: LoginComponent
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
    GraphComponent,
    LoginComponent,
    EditComponent,
    MomentPipe,
    AlertsComponent
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
    MdPaginatorModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    CategoryService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    GeneralEventService,
    ApiService,
    AuthGuardService,
    UtilService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ NewCategoryDialogComponent, GenericDialogComponent ]
})
export class AppModule { }
